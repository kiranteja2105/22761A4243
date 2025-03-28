import axios from 'axios';

const API_BASE_URL = 'http://20.244.56.144/test';

// Credentials
const credentials = {
    companyName: "LBRCE",
    clientID: "4d5dcfd6-036b-4529-9536-b8acf9f8ec7b",
    clientSecret: "TKJxoJoEFsCzWrfb",
    ownerName: "Parise Kiran Teja",
    ownerEmail: "parisekiranteja@gmail.com",
    rollNo: "22761A4243"
};

let authToken = null;

// Function to get auth token
const getAuthToken = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, credentials);
        authToken = response.data.access_token;
        console.log("Auth token obtained");
        return authToken;
    } catch (error) {
        console.error("Error getting auth token:", error);
        throw new Error("Failed to obtain authentication token");
    }
};

// Configure axios instance with interceptors
const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(async (config) => {
    if (!authToken) {
        await getAuthToken();
    }
    config.headers.Authorization = `Bearer ${authToken}`;
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token might be expired, try to refresh it
            authToken = null;
            try {
                await getAuthToken();
                const originalRequest = error.config;
                originalRequest.headers.Authorization = `Bearer ${authToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

const API = {
    // Fetch all users
    getUsers: async () => {
        try {
            const response = await apiClient.get('/users');
            const users = response.data.users;
            
            // Convert users object to array format
            return Object.entries(users).map(([id, name]) => ({
                id: parseInt(id),
                name
            }));
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to load users');
        }
    },

    // Fetch posts for a specific user
    getUserPosts: async (userId) => {
        try {
            const response = await apiClient.get(`/users/${userId}/posts`);
            const posts = response.data.posts || [];
            
            return posts.map(post => ({
                id: post.id,
                userId: post.userid,
                content: post.content,
                commentCount: post.commentCount || 0,
                timestamp: post.timestamp || new Date().toISOString(),
                title: post.title || `Post ${post.id}`
            }));
        } catch (error) {
            console.error(`Error fetching posts for user ${userId}:`, error);
            throw new Error(`Failed to load posts for user ${userId}`);
        }
    },

    // Get top users with their post counts
    getTopUsers: async () => {
        try {
            const users = await API.getUsers();
            
            // Fetch post counts for each user
            const usersWithPostCounts = await Promise.all(
                users.map(async (user) => {
                    try {
                        const posts = await API.getUserPosts(user.id);
                        return {
                            ...user,
                            postCount: posts.length,
                            avatar: `https://i.pravatar.cc/150?img=${user.id}`
                        };
                    } catch (error) {
                        console.error(`Error processing user ${user.id}:`, error);
                        return {
                            ...user,
                            postCount: 0,
                            avatar: `https://i.pravatar.cc/150?img=${user.id}`
                        };
                    }
                })
            );
            
            // Sort by post count descending and take top 5
            return usersWithPostCounts
                .sort((a, b) => b.postCount - a.postCount)
                .slice(0, 5);
        } catch (error) {
            console.error('Error fetching top users:', error);
            throw error;
        }
    },

    // Get all posts from all users
    getAllPosts: async () => {
        try {
            const users = await API.getUsers();
            
            // Fetch posts for each user
            const allPosts = (await Promise.all(
                users.map(async (user) => {
                    try {
                        const posts = await API.getUserPosts(user.id);
                        return posts.map(post => ({
                            ...post,
                            author: user.name,
                            image: `https://picsum.photos/600/400?random=${post.id}`
                        }));
                    } catch (error) {
                        console.error(`Error fetching posts for user ${user.id}:`, error);
                        return [];
                    }
                })
            )).flat();
            
            return allPosts;
        } catch (error) {
            console.error('Error fetching all posts:', error);
            throw error;
        }
    },

    // Get trending posts (most comments)
    getTrendingPosts: async () => {
        try {
            const allPosts = await API.getAllPosts();
            
            if (allPosts.length === 0) return [];
            
            // Find the maximum comment count
            const maxComments = Math.max(...allPosts.map(post => post.commentCount));
            
            // Return all posts with that count
            return allPosts.filter(post => post.commentCount === maxComments);
        } catch (error) {
            console.error('Error fetching trending posts:', error);
            throw error;
        }
    },

    // Get feed with newest posts first
    getFeed: async () => {
        try {
            const allPosts = await API.getAllPosts();
            
            // Sort by timestamp descending (newest first)
            return allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (error) {
            console.error('Error fetching feed:', error);
            throw error;
        }
    },

    // Simulate real-time updates for the feed
    subscribeToFeedUpdates: (callback) => {
        // In a real implementation, this would use WebSockets or similar
        const interval = setInterval(async () => {
            try {
                const newPosts = await API.getFeed();
                if (newPosts.length > 0) {
                    callback(newPosts[0]); // Just return the newest post
                }
            } catch (error) {
                console.error('Error fetching new posts:', error);
            }
        }, 30000); // Every 30 seconds to minimize API calls
        
        return () => clearInterval(interval);
    }
};

export default API;
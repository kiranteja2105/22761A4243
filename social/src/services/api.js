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
export const getAuthToken = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, credentials);
        authToken = response.data.access_token;  // Save the token
        console.log("Token:", authToken);
    } catch (error) {
        console.error("Error getting auth token:", error);
    }
};

// Function to fetch users
export const fetchUsers = async () => {
    if (!authToken) await getAuthToken(); // Ensure we have a token

    try {
        const response = await axios.get(`${API_BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data.users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return {};
    }
};

// Function to fetch posts for a user
export const fetchPosts = async (userId) => {
    if (!authToken) await getAuthToken(); // Ensure we have a token

    try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}/posts`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data.posts || [];
    } catch (error) {
        console.error(`Error fetching posts for user ${userId}:`, error);
        return [];
    }
};

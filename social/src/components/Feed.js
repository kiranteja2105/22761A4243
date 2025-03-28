import React, { useEffect, useState } from 'react';
import { fetchUsers, fetchPosts } from '../services/api';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadFeed = async () => {
      const users = await fetchUsers();
      let allPosts = [];

      for (const id in users) {
        const userPosts = await fetchPosts(id);
        allPosts = [...allPosts, ...userPosts.map(post => ({ ...post, user: users[id] }))];
      }

      allPosts.sort((a, b) => b.id - a.id);
      setPosts(allPosts);
    };

    loadFeed();
    const interval = setInterval(loadFeed, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Live Feed</h2>
      {posts.map((post) => (
        <div key={post.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{post.user}</h5>
            <p className="card-text">{post.content}</p>
            <span className="badge bg-secondary">Post ID: {post.id}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;

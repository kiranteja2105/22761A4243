import React, { useEffect, useState } from 'react';
import { fetchUsers, fetchPosts } from '../services/api';

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    const loadTrendingPosts = async () => {
      const users = await fetchUsers();
      let allPosts = [];

      for (const id in users) {
        const posts = await fetchPosts(id);
        allPosts = [...allPosts, ...posts];
      }

      allPosts.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
      const maxComments = allPosts[0]?.comments?.length || 0;
      setTrendingPosts(allPosts.filter(post => post.comments?.length === maxComments));
    };

    loadTrendingPosts();
  }, []);

  return (
    <div>
      <h2>Trending Posts</h2>
      {trendingPosts.map((post) => (
        <div key={post.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Post ID: {post.id}</h5>
            <p className="card-text">{post.content}</p>
            <span className="badge bg-info">{post.comments?.length || 0} Comments</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingPosts;

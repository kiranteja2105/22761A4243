import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Box, Alert } from '@mui/material';
import API from '../services/api';
import PostCard from '../components/PostCard';

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await API.getTrendingPosts();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
        setError('Failed to load trending posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Trending Posts
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Posts with the most comments
      </Typography>
      {posts.length === 0 ? (
        <Alert severity="info">No trending posts found.</Alert>
      ) : (
        posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </div>
  );
};

export default TrendingPosts;
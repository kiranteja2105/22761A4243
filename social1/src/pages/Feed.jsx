import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Box, Alert } from '@mui/material';
import API from '../services/api';
import PostCard from '../components/PostCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await API.getFeed();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feed:', error);
        setError('Failed to load feed. Please try again later.');
        setLoading(false);
      }
    };

    fetchInitialData();

    const unsubscribe = API.subscribeToFeedUpdates((newPost) => {
      setPosts(prevPosts => [newPost, ...prevPosts]);
    });

    return () => unsubscribe();
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
        Real-Time Feed
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Newest posts appear at the top
      </Typography>
      {posts.length === 0 ? (
        <Alert severity="info">No posts found.</Alert>
      ) : (
        posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </div>
  );
};

export default Feed;
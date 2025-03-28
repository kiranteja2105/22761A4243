import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Box, Alert } from '@mui/material';
import API from '../services/api';
import UserCard from '../components/UserCard';

const TopUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await API.getTopUsers();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top users:', error);
        setError('Failed to load top users. Please try again later.');
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
        Top Users
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Users with the highest number of posts
      </Typography>
      {users.length === 0 ? (
        <Alert severity="info">No users found.</Alert>
      ) : (
        users.map(user => (
          <UserCard key={user.id} user={user} />
        ))
      )}
    </div>
  );
};

export default TopUsers;
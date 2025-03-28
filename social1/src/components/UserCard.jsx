import React from 'react';
import { Card, CardContent, Typography, Avatar, Grid, Chip } from '@mui/material';

const UserCard = ({ user }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar alt={user.name} src={user.avatar} sx={{ width: 80, height: 80 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h5" component="div">
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Active social media user
            </Typography>
          </Grid>
          <Grid item>
            <Chip label={`${user.postCount} posts`} color="primary" />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserCard;
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Chip } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardMedia
        component="img"
        height="200"
        image={post.image}
        alt={post.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          By {post.author} • {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
        </Typography>
        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>
        <Grid container justifyContent="flex-end">
          <Chip label={`${post.commentCount} comments`} color="primary" />
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PostCard;
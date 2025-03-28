import React, { useEffect, useState } from 'react';
import { fetchUsers, fetchPosts } from '../services/api';

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const users = await fetchUsers();
      const userPostCounts = [];

      for (const id in users) {
        const posts = await fetchPosts(id);
        userPostCounts.push({ id, name: users[id], postCount: posts.length });
      }

      userPostCounts.sort((a, b) => b.postCount - a.postCount);
      setTopUsers(userPostCounts.slice(0, 5));
    };

    loadUsers();
  }, []);

  return (
    <div>
      <h2>Top Users</h2>
      <ul className="list-group">
        {topUsers.map((user) => (
          <li key={user.id} className="list-group-item d-flex justify-content-between">
            {user.name} <span className="badge bg-primary">{user.postCount} posts</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopUsers;

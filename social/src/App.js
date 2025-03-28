import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TopUsers from './components/TopUsers';
import TrendingPosts from './components/TrendingPosts';
import Feed from './components/Feed';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <div className="container mt-4">
        <h1 className="text-center mb-4">Social Media Analytics</h1>
        <nav className="mb-3">
          <Link to="/" className="btn btn-primary me-2">Home</Link>
          <Link to="/top-users" className="btn btn-secondary me-2">Top Users</Link>
          <Link to="/trending-posts" className="btn btn-success">Trending Posts</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/top-users" element={<TopUsers />} />
          <Route path="/trending-posts" element={<TrendingPosts />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

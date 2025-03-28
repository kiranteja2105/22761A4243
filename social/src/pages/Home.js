import React from "react";
import TopUsers from "../components/TopUsers";
import TrendingPosts from "../components/TrendingPosts";
import Feed from "../components/Feed";

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📊 Social Media Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TopUsers />
        <TrendingPosts />
        <Feed />
      </div>
    </div>
  );
};

export default Home;

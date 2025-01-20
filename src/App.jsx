import React from "react";
import Search from "./components/Search";
import { fetchUserData } from "./services/githubService";

import "./App.css";

function App() {
  const handleSearch = async (username) => {
    try {
      const data = await fetchUserData(username);
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
    }
  };
  return (
    <>
      <Search onSearch={handleSearch} />
    </>
  );
}

export default App;

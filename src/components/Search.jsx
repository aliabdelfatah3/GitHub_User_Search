// src/components/Search.jsx
import React, { useState } from "react";
import axios from "axios";
import { fetchUserData } from "../services/githubService"; // Import the updated service

const Search = () => {
  const [username, setUsername] = useState(""); // State for username input
  const [location, setLocation] = useState(""); // State for location input
  const [repoCount, setRepoCount] = useState(""); // State for repository count
  const [users, setUsers] = useState([]); // State for fetched users
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(""); // State for error handling

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (event && event.target) {
      setUsername(event.target.value); // Capture the value from the input
    }
    if (name === "username") setUsername(value);
    else if (name === "location") setLocation(value);
    else if (name === "repoCount") setRepoCount(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setLoading(true); // Show loading while fetching data
    setError(""); // Clear previous errors

    const query = buildQuery(username, location, repoCount); // Construct the query

    try {
      const data = await fetchUserData(username); // Fetch user data from GitHub API
      if (data) {
        setUsers(data); // Set fetched user data
      } else {
        setError("Looks like we cant find the user");
      }
    } catch (err) {
      setError("Looks like we cant find the user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center size-52 items-center h-lvh flex-col w-full">
      <div className="pb-10">
        <h1 className="text-2xl font-bold mb-4">GitHub User Search</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={handleInputChange}
            placeholder="Enter GitHub username"
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="ml-2 p-2 bg-blue-500 text-white rounded"
          >
            Search
          </button>
        </form>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Map through userList array */}
      <div className="flex flex-row">
        {users.length > 0 && (
          <div className="flex justify-center text-center items-center flex-wrap gap-10 mt-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="user-details flex flex-col shadow-2xl items-center mb-4 px-3 py-3 hover:scale-105"
              >
                <img
                  src={user.avatar_url}
                  alt={`${user.login}'s avatar`}
                  className="w-20 h-20 rounded-full"
                />
                <p className="mt-2 font-bold">{user.login}</p>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white rounded px-3 py-1 mt-2"
                >
                  View Profile
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Function to build the query string based on user input
const buildQuery = (username, location, repoCount) => {
  let query = username ? `login:${username}` : "";

  if (location) {
    query += ` location:${location}`;
  }

  if (repoCount) {
    query += ` repos:>${repoCount}`;
  }

  return query.trim(); // Return the constructed query
};

export default Search;

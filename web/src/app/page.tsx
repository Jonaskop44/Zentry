"use client";

import ApiClient from "@/api";
import { useState } from "react";

const apiClient = new ApiClient();

const Home = () => {
  const [user, setUser] = useState({ username: "", password: "" });

  const login = async () => {
    apiClient.auth.helper.login(user);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <h1>Welcome to the Home Page</h1>
      <p>This is a simple React component for the home page.</p>
      <p>Feel free to customize it as needed!</p>
      <div className="flex flex-col items-center mt-4">
        <button
          onClick={() => setUser({ username: "Jonaskop44", password: "root" })}
        >
          Send
        </button>
        <button onClick={login}>nigga</button>
      </div>
    </div>
  );
};

export default Home;

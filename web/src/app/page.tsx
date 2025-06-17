"use client";

import ApiClient from "@/api";
import { useState } from "react";
import { toast } from "sonner";

const apiClient = new ApiClient();

const Home = () => {
  const [user, setUser] = useState({ username: "", password: "" });

  const login = async () => {
    apiClient.auth.helper.login(user).then((response) => {
      if (response.status) {
        toast.success("Login successful");
      } else {
        toast.error("Login failed");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-4">
      <input
        placeholder="Username"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default Home;

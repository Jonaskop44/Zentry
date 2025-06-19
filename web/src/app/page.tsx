"use client";

import ApiClient from "@/api";
import { useState } from "react";
import { toast } from "sonner";

const apiClient = new ApiClient();

const Home = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [employees, setEmployees] = useState([]);

  const login = async () => {
    apiClient.auth.helper.login(user).then((response) => {
      if (response.status) {
        toast.success("Login successful");
      } else {
        toast.error("Login failed");
      }
    });
  };

  const getAllEmployees = async () => {
    apiClient.admin.helper.getAllEmployees().then((response) => {
      if (response.status) {
        setEmployees(response.data);
        toast.success("Employees fetched successfully");
      } else {
        toast.error("Failed to fetch employees");
      }
    });
  };

  return (
    <div>
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
      <div>
        <button
          onClick={getAllEmployees}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Get All Employees
        </button>
        <div className="mt-4">
          {employees.length > 0 ? (
            <ul>
              {employees.map((employee, index) => (
                <p key={index}>Top niiga</p>
              ))}
            </ul>
          ) : (
            <p>No employees found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

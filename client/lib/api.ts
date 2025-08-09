// frontend/lib/api.ts

import axios from "axios";

// Configure the base API instance
const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true, // includes cookies if you use them for sessions
});

// --- Auth Endpoints ---

export const register = (email: string, password: string) =>
  API.post("/register", { email, password });

export const login = (email: string, password: string) =>
  API.post("/login", { email, password });

export const logout = () => API.post("/logout");

// --- Google OAuth URL (used for redirect) ---

export const googleOAuthURL = "http://localhost:5000/api/auth/google";

// components/Auth.LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Points to Express server (adjust port if needed at any point)
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include", // Include cookies if backend uses them
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // backend should return: { token, user }
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Route to protected dashboard
          router.push("/dashboard/dashboard");
        } else {
          setError("No token received from server");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Cannot connect to server. Is your backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="spacing-lg">
      {error && (
        <div className="p-3 bg-brand-coral text-white rounded text-sm">
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          placeholder="Enter your email"
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          placeholder="Enter your password"
          required
          disabled={isLoading}
        />
      </div>

      <div className="text-right">
        <a href="/auth/forgot-password" className="forgot-password-link">
          Forgot your password?
        </a>
      </div>

      <button type="submit" className="btn-brand-primary" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

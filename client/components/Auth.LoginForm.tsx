// components/Auth.LoginForm.tsx - Direct Tailwind classes
"use client";
import { useState } from "react";
import styles from "./Auth.LoginForm.module.css";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Login form submitted:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
      {/* Email Input Group */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className={`block font-medium ${styles.label}`}>
          Enter your email
        </label>
        <input
          id="email"
          type="email"
          className={`w-full rounded-lg outline-none ${styles.input}`}
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Password Input Group */}
      <div className="flex flex-col space-y-2">
        <label
          htmlFor="password"
          className={`block font-medium ${styles.label}`}
        >
          Enter your password
        </label>
        <input
          id="password"
          type="password"
          className={`w-full rounded-lg outline-none ${styles.input}`}
          placeholder="••••••••"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Forgot Password Link */}
      <div className="text-right">
        <a
          href="/auth/forgot-password"
          className={`underline font-medium ${styles.forgotPasswordLink}`}
        >
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full font-medium rounded-lg border-none cursor-pointer ${
          styles.submitButton
        } ${isLoading ? "opacity-70 pointer-events-none" : ""}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Signing in...
          </div>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}

export default LoginForm;

// components/ProtectedRoute.tsx - JWT route protection
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

// JWT utility functions (inline for simplicity)
const jwtUtils = {
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  },

  removeToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_data");
    }
  },

  isValidToken: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      if (payload.exp && payload.exp < currentTime) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  },
};

export default function ProtectedRoute({
  children,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // 🚨 TESTING BYPASS - REMOVE AFTER TESTING
      const BYPASS_PROTECTED_ROUTE = true;

      if (BYPASS_PROTECTED_ROUTE) {
        console.log(
          "🚨 PROTECTED ROUTE BYPASSED FOR TESTING - REMOVE IN PRODUCTION!"
        );
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      /* 
      ===== PRODUCTION CODE - UNCOMMENT AFTER TESTING =====
      Remove the bypass above and uncomment this section for production:
      
      try {
        const token = jwtUtils.getToken();

        // No token found
        if (!token) {
          console.log("No JWT token found, redirecting to login");
          router.push(redirectTo);
          return;
        }

        // Check if token is expired
        if (!jwtUtils.isValidToken(token)) {
          console.log("JWT token expired, redirecting to login");
          jwtUtils.removeToken();
          router.push(redirectTo);
          return;
        }

        // Verify token with backend
        console.log("Verifying JWT token with backend...");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          console.log("JWT token verified successfully:", userData);

          // Update stored user data
          localStorage.setItem("user_data", JSON.stringify(userData));
          setIsAuthenticated(true);
        } else {
          console.log("JWT token verification failed:", response.status);
          // Token is invalid on backend, remove it and redirect
          jwtUtils.removeToken();
          router.push(redirectTo);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Network error or other issue, redirect to login
        jwtUtils.removeToken();
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
      
      ===== END PRODUCTION CODE =====
      */
    };

    checkAuth();
  }, [router, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-8 w-8 text-brand-teal"
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
          <p className="text-brand-dark-grey">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
}

// components/Auth.OAuthButtons.tsx - Updated with routing
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./Auth.OAuthButtons.module.css";

interface OAuthButtonsProps {
  onGoogleLogin?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "light" | "dark";
  state?: "normal" | "success" | "error";
}

function OAuthButtons({
  onGoogleLogin,
  disabled = false,
  className = "",
  variant = "light",
  state = "normal",
}: OAuthButtonsProps) {
  const router = useRouter();
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // User is already authenticated, redirect to dashboard
      router.push("/dashboard/dashboard");
    }
  }, [router]);

  const handleGoogleLogin = async () => {
    if (disabled || loadingGoogle) return;

    setLoadingGoogle(true);
    try {
      if (onGoogleLogin) {
        // Use custom handler if provided
        await onGoogleLogin();
      } else {
        // Default: redirect to Express server's Google OAuth

        // Store the intended destination for after auth
        localStorage.setItem("auth_redirect", "/dashboard/dashboard");

        // Redirect to your Express server's Google OAuth endpoint
        window.location.href = "http://localhost:5001/api/auth/google";

        // Note: setLoadingGoogle(false) won't run because we're redirecting
        // The loading state will persist until the page redirects
      }
    } catch (error) {
      console.error("Google login error:", error);
      setLoadingGoogle(false);
    }
    // Don't set loading to false here for redirect case
    // as the page will navigate away
  };

  // Build button classes dynamically using CSS module classes
  const getButtonClasses = () => {
    const classes = [styles.button];

    if (loadingGoogle) classes.push(styles.buttonLoading);
    if (variant === "dark") classes.push(styles.buttonDark);
    if (state === "success") classes.push(styles.buttonSuccess);
    if (state === "error") classes.push(styles.buttonError);

    return classes.join(" ");
  };

  // Clean icon components using SVG files
  const GoogleIcon = () => (
    <Image
      src="/icons/google.svg"
      alt=""
      width={20}
      height={20}
      className={styles.icon}
      priority
    />
  );

  const LoadingSpinner = () => (
    <Image
      src="/icons/spinner.svg"
      alt=""
      width={20}
      height={20}
      className={styles.spinner}
      priority
    />
  );

  // Dynamic button text based on state
  const getButtonText = () => {
    if (loadingGoogle) return "Redirecting to Google...";
    if (state === "success") return "Signed in successfully";
    if (state === "error") return "Try again";
    return "Continue with Google";
  };

  // Generate accessible aria-label based on current state
  const getAriaLabel = () => {
    if (loadingGoogle) return "Redirecting to Google sign in, please wait";
    if (state === "error") return "Sign in with Google, retry after error";
    if (state === "success") return "Successfully signed in with Google";
    return "Sign in with Google";
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <button
        onClick={handleGoogleLogin}
        disabled={disabled || loadingGoogle || state === "success"}
        type="button"
        aria-label={getAriaLabel()}
        className={getButtonClasses()}
      >
        {loadingGoogle ? <LoadingSpinner /> : <GoogleIcon />}
        <span className={styles.text}>{getButtonText()}</span>
      </button>
    </div>
  );
}

export default OAuthButtons;

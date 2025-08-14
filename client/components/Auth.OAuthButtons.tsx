// components/Auth.OAuthButtons.tsx - Updated to match global patterns
"use client";
import { useState } from "react";
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
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleGoogleLogin = async () => {
    if (disabled || loadingGoogle) return;

    setLoadingGoogle(true);
    try {
      if (onGoogleLogin) {
        await onGoogleLogin();
      } else {
        console.log("Google login clicked");
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setLoadingGoogle(false);
    }
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
    if (loadingGoogle) return "Signing in...";
    if (state === "success") return "Signed in successfully";
    if (state === "error") return "Try again";
    return "Continue with Google";
  };

  // Generate accessible aria-label based on current state
  const getAriaLabel = () => {
    if (loadingGoogle) return "Signing in with Google, please wait";
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

// app/page.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Main Content Container */}
      <div className="w-full max-w-lg flex flex-col items-center justify-center text-center">
        {/* Custom Icon Logo */}
        <div className="mb-12">
          <Image
            src="/icons/docufamicon.svg"
            alt="DocuFam Logo"
            width={96}
            height={96}
            className="drop-shadow-xl"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-gray-900 mb-8">
          Welcome to DocuFam
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 leading-relaxed mb-16">
          Your trusted family document manager
        </p>

        {/* Get Started Button */}
        <button onClick={handleGetStarted} className="btn-brand-primary mb-20">
          Get Started
        </button>

        {/* Footer */}
        <p className="text-sm text-gray-400 tracking-wide">
          Secure • Simple • Family-focused
        </p>
      </div>
    </div>
  );
}

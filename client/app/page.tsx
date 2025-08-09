"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      router.push("/dashboard"); // or wherever you want to redirect
    }
  }, [searchParams, router]);

  return (
    <main className="container">
      <h1 className="title">
        DocuFam – your trusted document group storage and management app
      </h1>
      <nav className="nav">
        <a href="/login" className="link">
          Login
        </a>
        <span className="separator">|</span>
        <a href="/register" className="link">
          Register
        </a>
      </nav>
    </main>
  );
}

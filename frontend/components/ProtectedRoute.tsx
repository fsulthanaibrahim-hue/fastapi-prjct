"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setCheckingAuth(false);
  }, [router]);

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[#f7f2ea] flex items-center justify-center">
        <p className="text-[#6f665c]">
          Checking authentication...
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
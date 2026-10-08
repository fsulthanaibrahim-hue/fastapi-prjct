"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/services/api";
import { getCurrentUser } from "@/services/auth";
import { User } from "@/types/auth";
import ProtectedRoute from "@/components/ProtectedRoute";

type DashboardData = {
  total_projects: number;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------
  // LOAD DASHBOARD
  // --------------------------------

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [currentUser, dashboardData] =
        await Promise.all([
          getCurrentUser(),
          apiRequest("/dashboard"),
        ]);

      setUser(currentUser);
      setDashboard(dashboardData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------
  // LOGOUT
  // --------------------------------

  function logout() {
    localStorage.removeItem("access_token");
    router.push("/login");
  }

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <ProtectedRoute>
        <main
          className="
            min-h-screen
            bg-[#f7f2ea]
            flex
            items-center
            justify-center
          "
        >
          <p className="text-[#6f665c]">
            Loading dashboard...
          </p>
        </main>
      </ProtectedRoute>
    );
  }

  // --------------------------------
  // PAGE
  // --------------------------------

  return (
    <ProtectedRoute>
      <main
        className="
          min-h-screen
          bg-[#f7f2ea]
          text-[#181614]
        "
      >

        {/* ======================================
            NAVBAR
            ====================================== */}

        <header
          className="
            border-b
            border-[#ded5c8]
            bg-[#faf7f1]
          "
        >
          <div
            className="
              max-w-6xl
              mx-auto
              px-6
              py-4
              flex
              items-center
              justify-between
            "
          >

            {/* LOGO */}

            <button
              onClick={() => router.push("/dashboard")}
              className="text-xl font-bold"
            >
              TaskHub
            </button>

            {/* NAVIGATION */}

            <nav
              className="
                flex
                items-center
                gap-6
                text-sm
              "
            >

              <button
                onClick={() =>
                  router.push("/dashboard")
                }
                className="font-medium"
              >
                Dashboard
              </button>

              <button
                onClick={() =>
                  router.push("/projects")
                }
                className="
                  text-[#6f665c]
                  hover:text-black
                  transition
                "
              >
                Projects
              </button>

              <button
                onClick={() =>
                  router.push("/tasks")
                }
                className="
                  text-[#6f665c]
                  hover:text-black
                  transition
                "
              >
                Tasks
              </button>

              <button
                onClick={logout}
                className="
                  text-[#6f665c]
                  hover:text-black
                  transition
                "
              >
                Logout
              </button>

            </nav>

          </div>
        </header>

        {/* ======================================
            MAIN CONTENT
            ====================================== */}

        <section
          className="
            max-w-6xl
            mx-auto
            px-6
            py-10
          "
        >

          {/* ======================================
              WELCOME
              ====================================== */}

          <div className="mb-8">

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
              "
            >
              Welcome, {user?.name}
            </h1>

            <p
              className="
                text-[#756c62]
                mt-2
              "
            >
              Here's an overview of your work.
            </p>

          </div>

          {/* ======================================
              ERROR MESSAGE
              ====================================== */}

          {error && (
            <div
              className="
                mb-6
                px-4
                py-3
                rounded-lg
                bg-red-50
                border
                border-red-200
                text-red-700
                text-sm
              "
            >
              {error}
            </div>
          )}

          {/* ======================================
              STATISTICS
              ====================================== */}

          {dashboard && (
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
                mb-8
              "
            >

              {/* TOTAL PROJECTS */}

              <div
                className="
                  bg-white
                  border
                  border-[#ded5c8]
                  rounded-xl
                  p-5
                "
              >
                <p
                  className="
                    text-sm
                    text-[#81786e]
                  "
                >
                  Total Projects
                </p>

                <p
                  className="
                    text-3xl
                    font-bold
                    mt-2
                  "
                >
                  {dashboard.total_projects}
                </p>
              </div>

              {/* TOTAL TASKS */}

              <div
                className="
                  bg-white
                  border
                  border-[#ded5c8]
                  rounded-xl
                  p-5
                "
              >
                <p
                  className="
                    text-sm
                    text-[#81786e]
                  "
                >
                  Total Tasks
                </p>

                <p
                  className="
                    text-3xl
                    font-bold
                    mt-2
                  "
                >
                  {dashboard.total_tasks}
                </p>
              </div>

              {/* COMPLETED */}

              <div
                className="
                  bg-white
                  border
                  border-[#ded5c8]
                  rounded-xl
                  p-5
                "
              >
                <p
                  className="
                    text-sm
                    text-[#81786e]
                  "
                >
                  Completed
                </p>

                <p
                  className="
                    text-3xl
                    font-bold
                    mt-2
                  "
                >
                  {dashboard.completed_tasks}
                </p>
              </div>

            </div>
          )}

          {/* ======================================
              QUICK ACTIONS
              ====================================== */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
            "
          >

            {/* PROJECTS */}

            <button
              onClick={() =>
                router.push("/projects")
              }
              className="
                text-left
                bg-white
                border
                border-[#ded5c8]
                rounded-xl
                p-6
                hover:border-black
                transition
              "
            >
              <h2
                className="
                  font-semibold
                  text-lg
                "
              >
                Projects
              </h2>

              <p
                className="
                  text-sm
                  text-[#81786e]
                  mt-2
                "
              >
                Create and manage your projects.
              </p>
            </button>

            {/* TASKS */}

            <button
              onClick={() =>
                router.push("/tasks")
              }
              className="
                text-left
                bg-white
                border
                border-[#ded5c8]
                rounded-xl
                p-6
                hover:border-black
                transition
              "
            >
              <h2
                className="
                  font-semibold
                  text-lg
                "
              >
                Tasks
              </h2>

              <p
                className="
                  text-sm
                  text-[#81786e]
                  mt-2
                "
              >
                Manage tasks, priorities and deadlines.
              </p>
            </button>

          </div>

        </section>

      </main>
    </ProtectedRoute>
  );
}
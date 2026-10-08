import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5EFE6] text-[#1C1917]">
      {/* Navbar */}
      <header className="border-b border-[#D8CBB8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold tracking-tight">
            TaskHub
          </h1>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-[#E8DCCB]"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-[#1C1917] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#332C27]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Side */}
          <div>
            <div className="mb-6 inline-flex rounded-full border border-[#C9B9A5] bg-[#EFE5D7] px-4 py-2 text-sm font-medium text-[#795548]">
              Simple Task Management
            </div>

            <h2 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              Work smarter.
              <br />
              <span className="text-[#795548]">
                Stay organized.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#62584F]">
              TaskHub is a simple workspace where you can manage
              projects, create tasks, track progress, and stay on top
              of your work.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-[#1C1917] px-7 py-3.5 font-semibold text-white transition hover:bg-[#332C27]"
              >
                Get Started
              </Link>

              <Link
                href="/login"
                className="rounded-lg border border-[#B9A995] px-7 py-3.5 font-semibold transition hover:bg-[#E8DCCB]"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="rounded-2xl border border-[#D1C2AF] bg-[#F8F3EC] p-5 shadow-xl">
            {/* Fake Dashboard Header */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-[#795548]">
                  Welcome back
                </p>

                <h3 className="text-xl font-bold">
                  Dashboard
                </h3>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1917] text-sm font-bold text-white">
                U
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-[#E8DCCB] p-4">
                <p className="text-xs text-[#795548]">
                  Projects
                </p>

                <p className="mt-2 text-2xl font-bold">
                  12
                </p>
              </div>

              <div className="rounded-xl bg-[#E8DCCB] p-4">
                <p className="text-xs text-[#795548]">
                  Tasks
                </p>

                <p className="mt-2 text-2xl font-bold">
                  48
                </p>
              </div>

              <div className="rounded-xl bg-[#E8DCCB] p-4">
                <p className="text-xs text-[#795548]">
                  Completed
                </p>

                <p className="mt-2 text-2xl font-bold">
                  31
                </p>
              </div>
            </div>

            {/* Task Preview */}
            <div className="mt-5 rounded-xl border border-[#D8CBB8] bg-white/50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-semibold">
                  Recent Tasks
                </h4>

                <span className="text-xs text-[#795548]">
                  View all
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-[#EFE5D7] p-3">
                  <div>
                    <p className="text-sm font-medium">
                      Build dashboard
                    </p>

                    <p className="text-xs text-[#795548]">
                      TaskHub Project
                    </p>
                  </div>

                  <span className="rounded-full bg-[#DCCAB5] px-3 py-1 text-xs">
                    In Progress
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-[#EFE5D7] p-3">
                  <div>
                    <p className="text-sm font-medium">
                      Create API
                    </p>

                    <p className="text-xs text-[#795548]">
                      Backend Project
                    </p>
                  </div>

                  <span className="rounded-full bg-[#DCCAB5] px-3 py-1 text-xs">
                    Completed
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-[#EFE5D7] p-3">
                  <div>
                    <p className="text-sm font-medium">
                      Design login page
                    </p>

                    <p className="text-xs text-[#795548]">
                      Frontend Project
                    </p>
                  </div>

                  <span className="rounded-full bg-[#DCCAB5] px-3 py-1 text-xs">
                    Todo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Info */}
      <section className="border-t border-[#D8CBB8] bg-[#EFE5D7] py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="font-semibold">
              Everything organized in one place.
            </h3>

            <p className="mt-1 text-sm text-[#62584F]">
              Projects, tasks, priorities and progress.
            </p>
          </div>

          <Link
            href="/register"
            className="rounded-lg bg-[#1C1917] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#332C27]"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D8CBB8] py-6">
        <p className="text-center text-sm text-[#795548]">
          © 2026 TaskHub
        </p>
      </footer>
    </main>
  );
}

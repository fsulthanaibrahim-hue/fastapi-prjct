"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/services/api";
import ProtectedRoute from "@/components/ProtectedRoute";

type Project = {
  id: number;
  name: string;
  description: string | null;
};

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------
  // PAGINATION
  // --------------------------------

  const [currentPage, setCurrentPage] = useState(1);

  const projectsPerPage = 5;

  // --------------------------------
  // LOAD PROJECTS
  // --------------------------------

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setError("");

      const data = await apiRequest("/projects");

      setProjects(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load projects"
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------
  // PAGINATION CALCULATION
  // --------------------------------

  const totalPages = Math.ceil(
    projects.length / projectsPerPage
  );

  const startIndex =
    (currentPage - 1) * projectsPerPage;

  const currentProjects = projects.slice(
    startIndex,
    startIndex + projectsPerPage
  );

  // --------------------------------
  // OPEN CREATE MODAL
  // --------------------------------

  function openCreateModal() {
    setEditingId(null);

    setName("");
    setDescription("");

    setError("");

    setShowModal(true);
  }

  // --------------------------------
  // OPEN EDIT MODAL
  // --------------------------------

  function openEditModal(project: Project) {
    setEditingId(project.id);

    setName(project.name);
    setDescription(project.description || "");

    setError("");

    setShowModal(true);
  }

  // --------------------------------
  // CLOSE MODAL
  // --------------------------------

  function closeModal() {
    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingId(null);
    setName("");
    setDescription("");
    setError("");
  }

  // --------------------------------
  // CREATE / UPDATE PROJECT
  // --------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      if (editingId !== null) {
        // UPDATE PROJECT

        await apiRequest(`/projects/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({
            name,
            description,
          }),
        });

        setSuccess("Project updated successfully.");
      } else {
        // CREATE PROJECT

        await apiRequest("/projects", {
          method: "POST",
          body: JSON.stringify({
            name,
            description,
          }),
        });

        setSuccess("Project created successfully.");

        // Go to the first page after creating
        setCurrentPage(1);
      }

      await loadProjects();

      setShowModal(false);

      setEditingId(null);
      setName("");
      setDescription("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------
  // DELETE PROJECT
  // --------------------------------

  async function deleteProject(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await apiRequest(`/projects/${id}`, {
        method: "DELETE",
      });

      setSuccess("Project deleted successfully.");

      await loadProjects();

      // Calculate remaining pages after deletion
      const remainingProjects = projects.length - 1;

      const newTotalPages = Math.ceil(
        remainingProjects / projectsPerPage
      );

      if (
        currentPage > newTotalPages &&
        newTotalPages > 0
      ) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete project"
      );
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
  // GO TO PREVIOUS PAGE
  // --------------------------------

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }

  // --------------------------------
  // GO TO NEXT PAGE
  // --------------------------------

  function goToNextPage() {
    setCurrentPage((page) =>
      Math.min(page + 1, totalPages)
    );
  }

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-[#f7f2ea] flex items-center justify-center">
          <p className="text-[#6f665c]">
            Loading projects...
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
      <main className="min-h-screen bg-[#f7f2ea] text-[#181614]">

        {/* ======================================
            NAVBAR
            ====================================== */}

        <header className="border-b border-[#ded5c8] bg-[#faf7f1]">

          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

            {/* LOGO */}

            <Link
              href="/dashboard"
              className="text-xl font-bold"
            >
              TaskHub
            </Link>

            {/* NAVIGATION */}

            <nav className="flex items-center gap-6 text-sm">

              <Link
                href="/dashboard"
                className="text-[#6f665c] hover:text-black transition"
              >
                Dashboard
              </Link>

              <Link
                href="/projects"
                className="font-medium"
              >
                Projects
              </Link>

              <Link
                href="/tasks"
                className="text-[#6f665c] hover:text-black transition"
              >
                Tasks
              </Link>

              <button
                onClick={logout}
                className="text-[#6f665c] hover:text-black transition"
              >
                Logout
              </button>

            </nav>

          </div>

        </header>

        {/* ======================================
            MAIN CONTENT
            ====================================== */}

        <section className="max-w-6xl mx-auto px-6 py-10">

          {/* ======================================
              PAGE HEADER
              ====================================== */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

            <div>

              <h1 className="text-3xl font-bold">
                Projects
              </h1>

              <p className="text-[#756c62] mt-2">
                Create and manage your projects in one place.
              </p>

            </div>

            {/* CREATE PROJECT BUTTON */}

            <button
              onClick={openCreateModal}
              className="
                bg-black
                text-white
                px-5
                py-3
                rounded-lg
                text-sm
                font-semibold
                hover:bg-[#292624]
                transition
              "
            >
              + Create Project
            </button>

          </div>

          {/* ======================================
              SUCCESS MESSAGE
              ====================================== */}

          {success && (
            <div
              className="
                mb-6
                px-4
                py-3
                rounded-lg
                bg-green-50
                border
                border-green-200
                text-green-700
                text-sm
              "
            >
              {success}
            </div>
          )}

          {/* ======================================
              ERROR MESSAGE
              ====================================== */}

          {error && !showModal && (
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
              PROJECT LIST
              ====================================== */}

          {projects.length === 0 ? (

            <div
              className="
                border
                border-dashed
                border-[#d8cec1]
                rounded-xl
                bg-[#faf7f1]
                p-10
                text-center
              "
            >

              <h2 className="text-lg font-semibold">
                No projects yet
              </h2>

              <p className="text-sm text-[#81786e] mt-2">
                Click "+ Create Project" to create your first project.
              </p>

            </div>

          ) : (

            <>

              <div className="space-y-4">

                {currentProjects.map((project) => (

                  <div
                    key={project.id}
                    className="
                      bg-[#faf7f1]
                      border
                      border-[#ded5c8]
                      rounded-xl
                      p-5
                    "
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                      {/* PROJECT INFORMATION */}

                      <div className="min-w-0">

                        <h2 className="font-semibold text-lg">
                          {project.name}
                        </h2>

                        <p className="text-sm text-[#81786e] mt-1">
                          {project.description ||
                            "No description provided."}
                        </p>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex items-center gap-2 shrink-0">

                        <button
                          onClick={() =>
                            openEditModal(project)
                          }
                          className="
                            px-4
                            py-2
                            border
                            border-[#d8cec1]
                            rounded-lg
                            text-sm
                            font-semibold
                            hover:bg-white
                            transition
                          "
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteProject(project.id)
                          }
                          className="
                            px-4
                            py-2
                            border
                            border-red-200
                            text-red-600
                            rounded-lg
                            text-sm
                            font-semibold
                            hover:bg-red-50
                            transition
                          "
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

              {/* ======================================
                  PAGINATION
                  ====================================== */}

              {totalPages > 1 && (

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-4
                    mt-8
                  "
                >

                  {/* PREVIOUS */}

                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="
                      px-4
                      py-2
                      border
                      border-[#d8cec1]
                      rounded-lg
                      text-sm
                      font-semibold
                      hover:bg-white
                      transition
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    "
                  >
                    ← Previous
                  </button>

                  {/* PAGE NUMBER */}

                  <span
                    className="
                      text-sm
                      text-[#6f665c]
                      min-w-[100px]
                      text-center
                    "
                  >
                    Page {currentPage} of {totalPages}
                  </span>

                  {/* NEXT */}

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="
                      px-4
                      py-2
                      border
                      border-[#d8cec1]
                      rounded-lg
                      text-sm
                      font-semibold
                      hover:bg-white
                      transition
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    "
                  >
                    Next →
                  </button>

                </div>

              )}

            </>

          )}

        </section>

        {/* ======================================
            CREATE / EDIT PROJECT MODAL
            ====================================== */}

        {showModal && (

          <div
            className="
              fixed
              inset-0
              bg-black/40
              flex
              items-center
              justify-center
              p-5
              z-50
            "
          >

            <div
              className="
                bg-[#faf7f1]
                w-full
                max-w-lg
                rounded-xl
                shadow-xl
                max-h-[90vh]
                overflow-y-auto
              "
            >

              {/* ==================================
                  MODAL HEADER
                  ================================== */}

              <div
                className="
                  px-6
                  py-5
                  border-b
                  border-[#ded5c8]
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <h2 className="text-xl font-bold">
                    {editingId !== null
                      ? "Edit Project"
                      : "Create Project"}
                  </h2>

                  <p className="text-sm text-[#81786e] mt-1">
                    {editingId !== null
                      ? "Update the project details."
                      : "Add a new project to your workspace."}
                  </p>

                </div>

                {/* CLOSE */}

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="
                    text-xl
                    text-[#6f665c]
                    hover:text-black
                    disabled:opacity-50
                  "
                >
                  ×
                </button>

              </div>

              {/* ==================================
                  FORM
                  ================================== */}

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5"
              >

                {/* ERROR */}

                {error && (
                  <div
                    className="
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

                {/* PROJECT NAME */}

                <div>

                  <label
                    htmlFor="project-name"
                    className="block text-sm font-medium mb-2"
                  >
                    Project Name
                  </label>

                  <input
                    id="project-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Enter project name"
                    required
                    className="
                      w-full
                      px-4
                      py-3
                      bg-white
                      border
                      border-[#d8cec1]
                      rounded-lg
                      outline-none
                      focus:border-black
                    "
                  />

                </div>

                {/* DESCRIPTION */}

                <div>

                  <label
                    htmlFor="project-description"
                    className="block text-sm font-medium mb-2"
                  >
                    Description
                  </label>

                  <textarea
                    id="project-description"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    placeholder="Enter project description"
                    rows={4}
                    className="
                      w-full
                      px-4
                      py-3
                      bg-white
                      border
                      border-[#d8cec1]
                      rounded-lg
                      outline-none
                      resize-none
                      focus:border-black
                    "
                  />

                </div>

                {/* ==================================
                    MODAL BUTTONS
                    ================================== */}

                <div
                  className="
                    flex
                    justify-end
                    gap-3
                    pt-2
                  "
                >

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="
                      px-5
                      py-3
                      border
                      border-[#d8cec1]
                      rounded-lg
                      text-sm
                      font-semibold
                      hover:bg-white
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="
                      px-5
                      py-3
                      bg-black
                      text-white
                      rounded-lg
                      text-sm
                      font-semibold
                      hover:bg-[#292624]
                      disabled:opacity-50
                    "
                  >
                    {saving
                      ? "Saving..."
                      : editingId !== null
                      ? "Save Changes"
                      : "Create Project"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </main>
    </ProtectedRoute>
  );
}
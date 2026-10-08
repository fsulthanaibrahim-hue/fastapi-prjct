"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/services/api";

type Project = {
  id: number;
  name: string;
  description: string | null;
};

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  due_date: string | null;
  project_id: number;
};

const TASKS_PER_PAGE = 5;

export default function TasksPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedProject, setSelectedProject] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    due_date: "",
  });

  // --------------------------------
  // AUTH
  // --------------------------------

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    loadProjects();
  }, [router]);

  // --------------------------------
  // LOAD PROJECTS
  // --------------------------------

  async function loadProjects() {
    try {
      setLoading(true);

      const data = await apiRequest("/projects");

      setProjects(data);

      if (data.length > 0) {
        setSelectedProject(String(data[0].id));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load projects"
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------
  // LOAD TASKS
  // --------------------------------

  async function loadTasks() {
    if (!selectedProject) return;

    try {
      const params = new URLSearchParams();

      if (statusFilter) {
        params.append("task_status", statusFilter);
      }

      if (priorityFilter) {
        params.append("priority", priorityFilter);
      }

      params.append("page", String(currentPage));
      params.append("limit", String(TASKS_PER_PAGE));

      const data = await apiRequest(
        `/tasks/project/${selectedProject}/filter?${params.toString()}`
      );

      setTasks(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tasks"
      );
    }
  }

  useEffect(() => {
    loadTasks();
  }, [selectedProject, statusFilter, priorityFilter, currentPage]);

  // --------------------------------
  // CREATE MODAL
  // --------------------------------

  function openCreateModal() {
    setEditingTask(null);

    setForm({
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      due_date: "",
    });

    setShowModal(true);
  }

  // --------------------------------
  // EDIT MODAL
  // --------------------------------

  function openEditModal(task: Task) {
    setEditingTask(task);

    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      due_date: task.due_date
        ? task.due_date.substring(0, 10)
        : "",
    });

    setShowModal(true);
  }

  // --------------------------------
  // CREATE / UPDATE
  // --------------------------------

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedProject) {
      setError("Please select a project.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        due_date: form.due_date || null,
        project_id: Number(selectedProject),
      };

      if (editingTask) {
        await apiRequest(`/tasks/${editingTask.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/tasks/", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setShowModal(false);
      await loadTasks();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save task"
      );
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------
  // DELETE
  // --------------------------------

  async function deleteTask(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/tasks/${id}`, {
        method: "DELETE",
      });

      await loadTasks();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete task"
      );
    }
  }

  // --------------------------------
  // SEARCH
  // --------------------------------

  const visibleTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  // --------------------------------
  // CLEAR FILTERS
  // --------------------------------

  function clearFilters() {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setCurrentPage(1);
  }

  // --------------------------------
  // DATE
  // --------------------------------

  function formatDate(date: string | null) {
    if (!date) return "No due date";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
      <main className="min-h-screen bg-[#f7f2ea] flex items-center justify-center">
        <p className="text-[#6f665c]">Loading tasks...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f2ea] text-[#181614]">

      {/* NAVBAR */}

      <header className="border-b border-[#ded5c8] bg-[#faf7f1]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <button
            onClick={() => router.push("/dashboard")}
            className="text-xl font-bold"
          >
            TaskHub
          </button>

          <nav className="flex items-center gap-6 text-sm">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-[#6f665c] hover:text-black"
            >
              Dashboard
            </button>

            <button
              onClick={() => router.push("/projects")}
              className="text-[#6f665c] hover:text-black"
            >
              Projects
            </button>

            <button
              onClick={logout}
              className="text-[#6f665c] hover:text-black"
            >
              Logout
            </button>
          </nav>

        </div>
      </header>

      {/* CONTENT */}

      <section className="max-w-6xl mx-auto px-6 py-10">

        {/* PAGE HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Tasks
            </h1>

            <p className="text-[#756c62] mt-2">
              Create tasks, set priorities, track status and manage deadlines.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-black text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-[#292624] transition"
          >
            + New Task
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* PROJECT */}

        <div className="mb-6">

          <label className="block text-sm font-semibold mb-2">
            Project
          </label>

          <select
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-80 px-4 py-3 bg-white border border-[#d8cec1] rounded-lg outline-none focus:border-black"
          >
            {projects.map((project) => (
              <option
                key={project.id}
                value={project.id}
              >
                {project.name}
              </option>
            ))}
          </select>

        </div>

        {/* FILTERS */}

        <div className="flex flex-col md:flex-row gap-3 mb-6">

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search tasks..."
            className="flex-1 px-4 py-3 bg-white border border-[#d8cec1] rounded-lg outline-none focus:border-black"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 bg-white border border-[#d8cec1] rounded-lg outline-none"
          >
            <option value="">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 bg-white border border-[#d8cec1] rounded-lg outline-none"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {(search || statusFilter || priorityFilter) && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 border border-[#d8cec1] rounded-lg text-sm font-medium hover:bg-white"
            >
              Clear
            </button>
          )}

        </div>

        {/* TASK LIST */}

        <div className="bg-white border border-[#ded5c8] rounded-xl overflow-hidden">

          {/* HEADER */}

          <div className="px-5 py-4 border-b border-[#e8e1d8]">

            <h2 className="font-semibold">
              Your Tasks
            </h2>

            <p className="text-sm text-[#81786e] mt-1">
              {visibleTasks.length} task
              {visibleTasks.length !== 1 ? "s" : ""}
            </p>

          </div>

          {/* TASKS */}

          {visibleTasks.length === 0 ? (

            <div className="py-16 text-center">

              <p className="font-semibold">
                No tasks found
              </p>

              <p className="text-sm text-[#81786e] mt-2">
                Create a task or change your filters.
              </p>

            </div>

          ) : (

            <div>

              {visibleTasks.map((task) => (

                <div
                  key={task.id}
                  className="px-5 py-5 border-b border-[#eee8df] last:border-b-0"
                >

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    {/* TASK DETAILS */}

                    <div className="min-w-0">

                      <h3
                        className={`font-semibold ${
                          task.status === "Completed"
                            ? "line-through text-[#8c847b]"
                            : ""
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-sm text-[#756c62] mt-1">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-3">

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            task.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : task.status === "In Progress"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {task.status}
                        </span>

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            task.priority === "High"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {task.priority}
                        </span>

                        <span className="text-xs text-[#81786e]">
                          Due: {formatDate(task.due_date)}
                        </span>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-2">

                      <button
                        onClick={() => openEditModal(task)}
                        className="px-3 py-2 border border-[#d8cec1] rounded-lg text-sm font-medium hover:bg-[#f7f2ea]"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

          {/* PAGINATION */}

          <div className="px-5 py-4 flex items-center justify-between">

            <span className="text-sm text-[#81786e]">
              Page {currentPage}
            </span>

            <div className="flex gap-2">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                className="px-4 py-2 border border-[#d8cec1] rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f7f2ea]"
              >
                Previous
              </button>

              <button
                disabled={tasks.length < TASKS_PER_PAGE}
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
                className="px-4 py-2 border border-[#d8cec1] rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f7f2ea]"
              >
                Next
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* CREATE / EDIT MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-5 z-50">

          <div className="bg-[#faf7f1] w-full max-w-lg rounded-xl shadow-xl">

            <div className="px-6 py-5 border-b border-[#ded5c8] flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  {editingTask ? "Edit Task" : "Create Task"}
                </h2>

                <p className="text-sm text-[#81786e] mt-1">
                  {editingTask
                    ? "Update the task details."
                    : "Add a new task to your project."}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-xl text-[#6f665c] hover:text-black"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* TITLE */}

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Task Title
                </label>

                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter task title"
                  className="w-full px-4 py-3 bg-white border border-[#d8cec1] rounded-lg outline-none focus:border-black"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the task..."
                  className="w-full px-4 py-3 bg-white border border-[#d8cec1] rounded-lg outline-none resize-none focus:border-black"
                />

              </div>

              {/* STATUS + PRIORITY */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white border border-[#d8cec1] rounded-lg outline-none"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">
                      In Progress
                    </option>
                    <option value="Completed">
                      Completed
                    </option>
                  </select>

                </div>

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Priority
                  </label>

                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        priority: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white border border-[#d8cec1] rounded-lg outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>

                </div>

              </div>

              {/* DUE DATE */}

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Due Date
                </label>

                <input
                  type="date"
                  value={form.due_date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      due_date: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-[#d8cec1] rounded-lg outline-none"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 border border-[#d8cec1] rounded-lg text-sm font-semibold hover:bg-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 bg-black text-white rounded-lg text-sm font-semibold hover:bg-[#292624] disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingTask
                    ? "Save Changes"
                    : "Create Task"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  );
}
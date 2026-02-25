"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Entry } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  ImageIcon,
  Award,
  TrendingUp,
  Shield,
} from "lucide-react";

interface AdminStats {
  totalEntries: number;
  totalVotes: number;
  featuredCount: number;
  winnersCount: number;
  recentSubmissions: number;
  categoryCounts: Record<string, number>;
  topEntries: Array<{
    id: string;
    title: string;
    creator_name: string;
    votes: number;
    category: string;
  }>;
}

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<"selected" | "all">("selected");
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        search: searchQuery,
        category: categoryFilter,
      });
      
      const response = await fetch(`/api/admin/entries?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 403) {
          setError("Access denied. You don't have admin privileges.");
        } else {
          setError(data.error || "Failed to fetch entries");
        }
        return;
      }
      
      setEntries(data.data);
      setTotalPages(Math.ceil(data.total / 20));
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, categoryFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      
      if (response.ok) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      fetchEntries();
      fetchStats();
    }
  }, [authLoading, user, fetchEntries, fetchStats]);

  const handleSelectAll = () => {
    if (selectedEntries.size === entries.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(entries.map(e => e.id)));
    }
  };

  const handleSelectEntry = (id: string) => {
    const newSelected = new Set(selectedEntries);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEntries(newSelected);
  };

  const handleDeleteClick = (type: "selected" | "all") => {
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      
      const body = deleteType === "all" 
        ? { deleteAll: true }
        : { entryIds: Array.from(selectedEntries) };
      
      const response = await fetch("/api/admin/entries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "Failed to delete entries");
        return;
      }
      
      setSuccessMessage(data.message);
      setSelectedEntries(new Set());
      setShowDeleteModal(false);
      
      // Refresh data
      fetchEntries();
      fetchStats();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to delete entries");
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access Required</h1>
          <p className="text-gray-400 mb-6">Please sign in to access the admin panel.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-gray-900 rounded-lg font-semibold hover:bg-cyan-400 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (error === "Access denied. You don't have admin privileges.") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">You don't have permission to access the admin panel.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-gray-900 rounded-lg font-semibold hover:bg-cyan-400 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-cyan-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                <Home className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-cyan-500" />
                  Admin Panel
                </h1>
                <p className="text-gray-400 text-sm">Manage submissions and entries</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Signed in as</span>
              <span className="text-sm text-cyan-500 font-medium">{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-3"
            >
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-green-400">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Entries</p>
                  <p className="text-2xl font-bold text-white">{stats.totalEntries}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Votes</p>
                  <p className="text-2xl font-bold text-white">{stats.totalVotes}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Award className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Featured</p>
                  <p className="text-2xl font-bold text-white">{stats.featuredCount}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Last 7 Days</p>
                  <p className="text-2xl font-bold text-white">{stats.recentSubmissions}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-1 gap-4 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 pr-8 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white appearance-none focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Categories</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="audio">Audio</option>
                  <option value="website">Websites</option>
                </select>
              </div>

              {/* Refresh */}
              <button
                onClick={() => {
                  fetchEntries();
                  fetchStats();
                }}
                className="p-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-cyan-500 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {/* Delete Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleDeleteClick("selected")}
                disabled={selectedEntries.size === 0}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected ({selectedEntries.size})
              </button>
              <button
                onClick={() => handleDeleteClick("all")}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg text-red-500 hover:bg-red-600/30 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                Delete All
              </button>
            </div>
          </div>
        </div>

        {/* Entries Table */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No entries found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="p-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedEntries.size === entries.length && entries.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                        />
                      </th>
                      <th className="p-4 text-left text-gray-400 font-medium">Preview</th>
                      <th className="p-4 text-left text-gray-400 font-medium">Title</th>
                      <th className="p-4 text-left text-gray-400 font-medium">Creator</th>
                      <th className="p-4 text-left text-gray-400 font-medium">Category</th>
                      <th className="p-4 text-left text-gray-400 font-medium">Votes</th>
                      <th className="p-4 text-left text-gray-400 font-medium">Date</th>
                      <th className="p-4 text-left text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {entries.map((entry) => (
                      <tr
                        key={entry.id}
                        className={`hover:bg-gray-700/30 transition-colors ${
                          selectedEntries.has(entry.id) ? "bg-cyan-500/10" : ""
                        }`}
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedEntries.has(entry.id)}
                            onChange={() => handleSelectEntry(entry.id)}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                          />
                        </td>
                        <td className="p-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-900">
                            {entry.file_type === "image" ? (
                              <Image
                                src={entry.file_url}
                                alt={entry.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                {entry.file_type === "video" && "🎬"}
                                {entry.file_type === "audio" && "🎵"}
                                {entry.file_type === "website" && "🌐"}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-white font-medium truncate max-w-[200px]">{entry.title}</p>
                          <p className="text-gray-500 text-sm truncate max-w-[200px]">{entry.tool_used}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-300">{entry.creator_name}</p>
                          <p className="text-gray-500 text-sm">{entry.creator_email}</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-300 capitalize">
                            {entry.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-cyan-500 font-medium">{entry.votes}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-400 text-sm">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                              setSelectedEntries(new Set([entry.id]));
                              handleDeleteClick("selected");
                            }}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-gray-700/50">
                <p className="text-gray-400 text-sm">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="Xed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 border border-red-500/50 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {deleteType === "all" ? "Delete All Entries?" : "Delete Selected Entries?"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {deleteType === "all"
                    ? "This will permanently delete ALL entries and their associated files. This action cannot be undone."
                    : `This will permanently delete ${selectedEntries.size} selected entries and their associated files. This action cannot be undone.`}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-red-600 rounded-xl text-white hover:bg-red-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

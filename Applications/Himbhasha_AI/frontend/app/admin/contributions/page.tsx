"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Trash2,
  Download,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  FileText,
  FileJson,
  Layers,
  MapPin,
  Clock
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { AppleCard } from "../../../components/AppleCard";
import { ContributionService, ContributionItem, StatisticsData } from "../../../services/contribution_service";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminContributionsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [typeFilter, setTypeFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [contributions, setContributions] = useState<ContributionItem[]>([]);
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ContributionService.getContributions({
        status: activeTab === "all" ? undefined : activeTab,
        type_filter: typeFilter || undefined,
        district_filter: districtFilter || undefined,
        search_query: searchQuery || undefined,
      });

      if (res && res.data) {
        setContributions(res.data);
      }

      const statsRes = await ContributionService.getStatistics();
      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error("Failed fetching moderation items:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, typeFilter, districtFilter, searchQuery]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await ContributionService.approveContribution(id);
      await fetchQueue();
    } catch (e) {
      console.error("Approve error:", e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason:", "Does not meet editorial guidelines");
    if (reason === null) return;

    setActionLoading(id);
    try {
      await ContributionService.rejectContribution(id, reason);
      await fetchQueue();
    } catch (e) {
      console.error("Reject error:", e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contribution?")) return;

    setActionLoading(id);
    try {
      await ContributionService.deleteContribution(id);
      await fetchQueue();
    } catch (e) {
      console.error("Delete error:", e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = async (format: "json" | "csv") => {
    try {
      const res = await ContributionService.exportContributions(format, activeTab === "all" ? undefined : activeTab);
      if (res && res.content) {
        const blob = new Blob([res.content], { type: format === "csv" ? "text/csv" : "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = res.filename || `contributions_${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (e) {
      console.error("Export error:", e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-6 space-y-6">
        {/* Header Toolbar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport("json")}
              className="h-8 px-3 rounded-lg bg-soft-gray border border-border-val text-xs font-bold text-gray-600 hover:text-primary flex items-center gap-1"
            >
              <FileJson size={14} />
              <span>Export JSON</span>
            </button>
            
            <button
              onClick={() => handleExport("csv")}
              className="h-8 px-3 rounded-lg bg-soft-gray border border-border-val text-xs font-bold text-gray-600 hover:text-primary flex items-center gap-1"
            >
              <FileText size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-primary" size={24} />
              <h1 className="text-2xl font-extrabold text-apple-text">Community Moderation Panel</h1>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Review, edit, approve, or reject community language contributions before dataset entry.
            </p>
          </div>

          <button
            onClick={fetchQueue}
            className="h-9 px-3 rounded-xl bg-soft-gray border border-border-val flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-primary transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Real-time Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <AppleCard className="p-4 bg-white dark:bg-[#1C1C1E] text-center" hoverEffect={false}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Submitted</span>
              <p className="text-2xl font-black text-apple-text mt-1">{stats.total_contributions}</p>
            </AppleCard>

            <AppleCard className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/40 text-center" hoverEffect={false}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Pending Review</span>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">{stats.pending_count}</p>
            </AppleCard>

            <AppleCard className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/40 text-center" hoverEffect={false}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Approved</span>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{stats.approved_count}</p>
            </AppleCard>

            <AppleCard className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/40 text-center" hoverEffect={false}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Rejected</span>
              <p className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1">{stats.rejected_count}</p>
            </AppleCard>
          </div>
        )}

        {/* Filter Controls & Search */}
        <AppleCard className="p-4 bg-white dark:bg-[#1C1C1E] space-y-4">
          <div className="flex items-center justify-between border-b border-border-val pb-3">
            {/* Status Queue Tabs */}
            <div className="flex gap-4">
              {(["pending", "approved", "rejected", "all"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs font-bold capitalize transition-colors ${
                    activeTab === tab ? "text-primary border-b-2 border-primary pb-1" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab} Queue
                </button>
              ))}
            </div>
            
            <span className="text-xs font-bold text-gray-400">{contributions.length} items</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contributions..."
                className="w-full h-9 pl-9 pr-3 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-xl text-xs font-medium text-apple-text focus:outline-none focus:border-primary"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 px-3 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-xl text-xs font-semibold text-apple-text focus:outline-none focus:border-primary"
            >
              <option value="">All Contribution Types</option>
              <option value="Dictionary Word">Dictionary Word</option>
              <option value="Phrase">Phrase</option>
              <option value="Proverb">Proverb</option>
              <option value="Story">Story</option>
              <option value="Recipe">Recipe</option>
              <option value="Festival">Festival</option>
              <option value="Place">Place</option>
            </select>

            {/* District Filter */}
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="h-9 px-3 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-xl text-xs font-semibold text-apple-text focus:outline-none focus:border-primary"
            >
              <option value="">All Districts</option>
              <option value="Kangra">Kangra</option>
              <option value="Mandi">Mandi</option>
              <option value="Shimla">Shimla</option>
              <option value="Kullu">Kullu</option>
              <option value="Chamba">Chamba</option>
            </select>
          </div>
        </AppleCard>

        {/* Contributions List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-12 text-center text-primary text-xs font-semibold animate-pulse flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              <span>Loading moderation queue...</span>
            </div>
          ) : contributions.length > 0 ? (
            contributions.map((item) => (
              <AppleCard key={item.id} className="p-4 bg-white dark:bg-[#1C1C1E] border border-border-val space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                      {item.type}
                    </span>
                    <h3 className="text-sm font-bold text-apple-text">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === "approved"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : item.status === "rejected"
                        ? "bg-rose-50 text-rose-600 border border-rose-200"
                        : "bg-amber-50 text-amber-600 border border-amber-200"
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">{item.district}</span>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-medium text-apple-text/80 bg-soft-gray/30 dark:bg-white/5 p-2.5 rounded-xl border border-border-val/50">
                  {item.kangri && <div><span className="font-bold text-gray-400">Kangri:</span> {item.kangri}</div>}
                  {item.hindi && <div><span className="font-bold text-gray-400">Hindi:</span> {item.hindi}</div>}
                  {item.english && <div><span className="font-bold text-gray-400">English:</span> {item.english}</div>}
                </div>

                {item.description && (
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {item.description}
                  </p>
                )}

                {item.rejection_reason && (
                  <p className="text-xs text-rose-600 font-bold">
                    Rejection Reason: {item.rejection_reason}
                  </p>
                )}

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border-val">
                  <span className="text-[10px] text-gray-400 font-semibold">
                    Submitted by {item.submitted_by} • {new Date(item.submitted_at).toLocaleDateString()}
                  </span>

                  <div className="flex gap-2">
                    {item.status !== "approved" && (
                      <button
                        onClick={() => handleApprove(item.id)}
                        disabled={actionLoading === item.id}
                        className="h-8 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 hover:opacity-90 disabled:opacity-50 transition-all shadow-xs"
                      >
                        <CheckCircle size={14} />
                        <span>Approve</span>
                      </button>
                    )}

                    {item.status !== "rejected" && (
                      <button
                        onClick={() => handleReject(item.id)}
                        disabled={actionLoading === item.id}
                        className="h-8 px-3 rounded-lg bg-amber-500 text-white text-xs font-bold flex items-center gap-1 hover:opacity-90 disabled:opacity-50 transition-all shadow-xs"
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={actionLoading === item.id}
                      className="h-8 w-8 rounded-lg bg-soft-gray border border-border-val text-gray-400 hover:text-soft-red flex items-center justify-center transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </AppleCard>
            ))
          ) : (
            <p className="text-xs font-medium text-gray-400 py-8 text-center bg-white dark:bg-[#1C1C1E] border border-border-val rounded-2xl">
              No contributions found in this queue.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

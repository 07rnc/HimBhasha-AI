const API_BASE = "http://localhost:8000/api";

export interface ContributionItem {
  id: string;
  type: string;
  title: string;
  kangri?: string;
  hindi?: string;
  english?: string;
  description?: string;
  pronunciation?: string;
  keywords?: string[];
  category?: string;
  district?: string;
  submitted_by?: string;
  submitted_at: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string;
}

export interface ContributionCreatePayload {
  type: string;
  title: string;
  kangri?: string;
  hindi?: string;
  english?: string;
  description?: string;
  pronunciation?: string;
  keywords?: string[];
  category?: string;
  district?: string;
  submitted_by?: string;
}

export interface StatisticsData {
  total_contributions: number;
  pending_count: number;
  approved_count: number;
  rejected_count: number;
  dictionary_entries: number;
  phrases_count: number;
  stories_count: number;
  recipes_count: number;
  by_type: Record<string, number>;
  by_district: Record<string, number>;
}

export const ContributionService = {
  submitContribution: async (payload: ContributionCreatePayload) => {
    const res = await fetch(`${API_BASE}/contributions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Submission failed");
    }
    return res.json();
  },

  getContributions: async (params?: { status?: string; type_filter?: string; district_filter?: string; search_query?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/contributions?${query}`);
    if (!res.ok) throw new Error("Failed fetching contributions");
    return res.json();
  },

  getPending: async () => {
    const res = await fetch(`${API_BASE}/contributions/pending`);
    if (!res.ok) throw new Error("Failed fetching pending contributions");
    return res.json();
  },

  getApproved: async () => {
    const res = await fetch(`${API_BASE}/contributions/approved`);
    if (!res.ok) throw new Error("Failed fetching approved contributions");
    return res.json();
  },

  approveContribution: async (id: string) => {
    const res = await fetch(`${API_BASE}/contributions/${id}/approve`, {
      method: "PUT"
    });
    if (!res.ok) throw new Error("Failed approving contribution");
    return res.json();
  },

  rejectContribution: async (id: string, reason?: string) => {
    const res = await fetch(`${API_BASE}/contributions/${id}/reject`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: reason || "Does not meet guidelines" })
    });
    if (!res.ok) throw new Error("Failed rejecting contribution");
    return res.json();
  },

  deleteContribution: async (id: string) => {
    const res = await fetch(`${API_BASE}/contributions/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed deleting contribution");
    return res.json();
  },

  exportContributions: async (format: "json" | "csv" = "json", status?: string) => {
    const res = await fetch(`${API_BASE}/contributions/export?format=${format}&status=${status || ""}`);
    if (!res.ok) throw new Error("Failed exporting contributions");
    return res.json();
  },

  getStatistics: async () => {
    const res = await fetch(`${API_BASE}/statistics`);
    if (!res.ok) throw new Error("Failed fetching statistics");
    return res.json();
  }
};

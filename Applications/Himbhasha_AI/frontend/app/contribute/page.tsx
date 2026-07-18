"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  HeartHandshake,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BookOpen,
  MapPin,
  Tag,
  User,
  History
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { AppleCard } from "../../components/AppleCard";
import { ContributionService } from "../../services/contribution_service";
import { motion } from "framer-motion";

const CONTRIBUTION_TYPES = [
  "Dictionary Word",
  "Phrase",
  "Proverb",
  "Story",
  "Recipe",
  "Festival",
  "Place",
  "Folk Song",
  "Healthcare Tip",
  "Agriculture Knowledge",
  "Tourism Information",
];

const HP_DISTRICTS = [
  "Kangra",
  "Mandi",
  "Shimla",
  "Kullu",
  "Chamba",
  "Hamirpur",
  "Una",
  "Solan",
  "Sirmaur",
  "Bilaspur",
  "Lahaul and Spiti",
  "Kinnaur",
];

export default function ContributePage() {
  const router = useRouter();
  
  const [type, setType] = useState("Dictionary Word");
  const [title, setTitle] = useState("");
  const [kangri, setKangri] = useState("");
  const [hindi, setHindi] = useState("");
  const [english, setEnglish] = useState("");
  const [description, setDescription] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [district, setDistrict] = useState("Kangra");
  const [submittedBy, setSubmittedBy] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !kangri.trim()) {
      setErrorMsg("Please provide a Title or Kangri word.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    try {
      const res = await ContributionService.submitContribution({
        type,
        title: title || kangri,
        kangri,
        hindi,
        english,
        description,
        pronunciation,
        keywords,
        category: type,
        district,
        submitted_by: submittedBy || "Anonymous Contributor",
      });

      if (res && res.success) {
        setSuccessMsg("🎉 Thank you! Your contribution has been submitted to the moderation queue.");
        setTitle("");
        setKangri("");
        setHindi("");
        setEnglish("");
        setDescription("");
        setPronunciation("");
        setKeywordsInput("");
      } else {
        setErrorMsg(res.message || "Failed to submit contribution.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to connect to moderation backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-6 space-y-6">
        {/* Header Toolbar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
          
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200/50">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>🟢 Community Preservation Platform</span>
          </span>
        </div>

        {/* Title Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HeartHandshake className="text-primary" size={24} />
            <h1 className="text-2xl font-extrabold text-apple-text">Preserve Kangri Language & Culture</h1>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Contribute words, proverbs, recipes, and folk stories to save Himachali heritage. All entries are moderated before addition.
          </p>
        </div>

        {/* Success / Error Alerts */}
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 rounded-2xl flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-300">
            <AlertCircle size={18} className="text-soft-red flex-shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Contribution Form Card */}
        <AppleCard className="bg-white dark:bg-[#1C1C1E] p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Grid row 1: Type & District */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-apple-text mb-1.5 flex items-center gap-1">
                  <BookOpen size={14} className="text-primary" />
                  <span>Contribution Type *</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-10 px-3 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-xl text-xs font-semibold text-apple-text focus:outline-none focus:border-primary"
                >
                  {CONTRIBUTION_TYPES.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-apple-text mb-1.5 flex items-center gap-1">
                  <MapPin size={14} className="text-primary" />
                  <span>District / Region *</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-10 px-3 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-xl text-xs font-semibold text-apple-text focus:outline-none focus:border-primary"
                >
                  {HP_DISTRICTS.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-apple-text mb-1.5">
                Entry Title / Term *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. बंदगी (Bandagi) or Dham Recipe"
                required
                className="w-full h-10 px-3 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-xl text-xs font-semibold text-apple-text focus:outline-none focus:border-primary"
              />
            </div>

            {/* Grid row 2: Kangri, Hindi, English */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-apple-text mb-1.5">Kangri Text</label>
                <input
                  type="text"
                  value={kangri}
                  onChange={(e) => setKangri(e.target.value)}
                  placeholder="e.g. बंदगी"
                  className="w-full h-10 px-3 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-xl text-xs font-semibold text-apple-text focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-apple-text mb-1.5">Hindi Translation</label>
                <input
                  type="text"
                  value={hindi}
                  onChange={(e) => setHindi(e.target.value)}
                  placeholder="e.g. प्रणाम / अभिवादन"
                  className="w-full h-10 px-3 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-xl text-xs font-semibold text-apple-text focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-apple-text mb-1.5">English Translation</label>
                <input
                  type="text"
                  value={english}
                  onChange={(e) => setEnglish(e.target.value)}
                  placeholder="e.g. Respectful Greeting"
                  className="w-full h-10 px-3 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-xl text-xs font-semibold text-apple-text focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Pronunciation & Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-apple-text mb-1.5">Pronunciation Guide</label>
                <input
                  type="text"
                  value={pronunciation}
                  onChange={(e) => setPronunciation(e.target.value)}
                  placeholder="e.g. Bandagi"
                  className="w-full h-10 px-3 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-xl text-xs font-semibold text-apple-text focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-apple-text mb-1.5 flex items-center gap-1">
                  <Tag size={14} className="text-primary" />
                  <span>Keywords (Comma separated)</span>
                </label>
                <input
                  type="text"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="greeting, respect, traditional"
                  className="w-full h-10 px-3 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-xl text-xs font-semibold text-apple-text focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-apple-text mb-1.5">Detailed Description / Context</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the cultural significance, story, or usage instructions..."
                rows={4}
                className="w-full py-3 px-3 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-xl text-xs font-semibold text-apple-text resize-none focus:outline-none focus:border-primary"
              />
            </div>

            {/* Submitted By */}
            <div>
              <label className="block text-xs font-bold text-apple-text mb-1.5 flex items-center gap-1">
                <User size={14} className="text-primary" />
                <span>Your Name / Contributor Handle</span>
              </label>
              <input
                type="text"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                placeholder="e.g. Ramesh Kumar (or leave blank for Anonymous)"
                className="w-full h-10 px-3 bg-soft-gray/50 dark:bg-white/5 border border-border-val rounded-xl text-xs font-semibold text-apple-text focus:outline-none focus:border-primary"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting to Moderation Queue...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Contribution for Moderation</span>
                </>
              )}
            </button>
          </form>
        </AppleCard>
      </main>
    </div>
  );
}

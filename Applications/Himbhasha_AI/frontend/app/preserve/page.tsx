"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, CheckCircle2, ShieldAlert, Sparkles, Mic, FileText, Check } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { AppleCard } from "../../components/AppleCard";
import { ContributionType } from "../../types";
import { motion, AnimatePresence } from "framer-motion";
import { ContributionService } from "../../services/contribution_service";
export default function PreserveLanguage() {
  const router = useRouter();
  const [type, setType] = useState<ContributionType>("vocabulary");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [consent, setConsent] = useState(false);
  const [audioAttached, setAudioAttached] = useState(false);
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !consent || loading) return;

    setLoading(true);
    try {
      await ContributionService.submitContribution({
        type: type as any,
        title: title || "Preservation Entry",
        description: content,
        district: district || "Kangra",
        submitted_by: "Community Preservation Form"
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit contribution. Please check your API server connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
    setAge("");
    setGender("");
    setDistrict("");
    setVillage("");
    setConsent(false);
    setAudioAttached(false);
    setSubmitted(false);
  };

  const contributionTypes: { value: ContributionType; label: string }[] = [
    { value: "vocabulary", label: "Vocabulary Word" },
    { value: "proverb", label: "Local Proverb" },
    { value: "story", label: "Traditional Story" },
    { value: "conversation", label: "Conversation Dialogue" },
    { value: "song", label: "Folk Song lyrics" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-3xl w-full mx-auto px-6 py-6 flex flex-col justify-start">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
          
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">HIMCorpus Preservation</h2>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
            >
              {/* Introduction card */}
              <AppleCard className="bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/10 p-6 mb-6" hoverEffect={false}>
                <div className="flex gap-4">
                  <div className="p-3 rounded-2xl bg-white dark:bg-white/10 text-primary self-start">
                    <Heart size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-apple-text mb-1">
                      Help Preserve Himachal's Languages
                    </h3>
                    <p className="text-xs font-medium text-gray-500 leading-relaxed">
                      Linguistic heritage is disappearing. By contributing local vocabulary, stories, and proverbs, you help Vaani learn your village's dialect and build the HIMCorpus Knowledge Engine.
                    </p>
                  </div>
                </div>
              </AppleCard>

              {/* Form card */}
              <form onSubmit={handleSubmit}>
                <AppleCard className="bg-white dark:bg-[#1C1C1E] p-6 space-y-6" hoverEffect={false}>
                  {/* Contribution Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-apple-text uppercase tracking-wider">
                      Contribution Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as ContributionType)}
                      className="h-11 w-full px-4 bg-soft-gray border border-border-val text-apple-text rounded-xl text-xs font-medium focus:outline-none"
                    >
                      {contributionTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title / Word */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-apple-text uppercase tracking-wider">
                      Title or Main Word
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={type === "vocabulary" ? "e.g., बंदगी" : "e.g., Sair Festival Lore"}
                      className="h-11 w-full px-4 bg-soft-gray border border-border-val rounded-xl text-xs font-medium focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  {/* Content translation/meaning */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-apple-text uppercase tracking-wider">
                      Detailed Content or Translation
                    </label>
                    <textarea
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={
                        type === "vocabulary"
                          ? "Write meaning in Hindi/English, spelling variants, and sentence context..."
                          : "Write details, stories, or proverbs here..."
                      }
                      rows={5}
                      className="w-full p-4 bg-soft-gray border border-border-val rounded-xl text-xs font-medium resize-none focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  {/* Audio checkbox */}
                  <div className="flex items-center gap-3 bg-soft-gray p-4 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setAudioAttached(!audioAttached)}
                      className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
                        audioAttached ? "bg-primary text-white" : "bg-white dark:bg-white/10 text-gray-400 border border-border-val"
                      }`}
                    >
                      <Mic size={16} />
                    </button>
                    <div>
                      <p className="text-xs font-bold text-apple-text">Attach voice recording</p>
                      <p className="text-[10px] text-gray-400">Attach a sample spoken audio clip of this phrase</p>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Age (Optional)</label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : "")}
                        placeholder="e.g. 65"
                        className="h-10 px-3 bg-soft-gray border border-border-val rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as "male" | "female" | "other" | "")}
                        className="h-10 px-3 bg-soft-gray border border-border-val text-apple-text rounded-lg text-xs"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">District</label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Kangra"
                        className="h-10 px-3 bg-soft-gray border border-border-val rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Village</label>
                      <input
                        type="text"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="e.g. Pragpur"
                        className="h-10 px-3 bg-soft-gray border border-border-val rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* Privacy details */}
                  <div className="flex items-start gap-2.5 bg-amber-50/40 dark:bg-amber-950/10 p-4 rounded-2xl border border-amber-100/10 text-amber-800 dark:text-amber-200">
                    <ShieldAlert size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider">Privacy & Consent Protection</p>
                      <p className="text-[10px] font-medium leading-relaxed mt-0.5">
                        Your submission will be de-identified. Your name is never saved. We only store demographic details for dialect mapping. All data is open-sourced under CC-BY-4.0.
                      </p>
                    </div>
                  </div>

                  {/* Consent checkbox */}
                  <div className="flex items-center gap-2.5 pt-2">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="consent" className="text-xs font-semibold text-gray-500 cursor-pointer select-none">
                      I agree to publish this data publicly under CC-BY-4.0 terms.
                    </label>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={!consent || !content.trim() || loading}
                      className="h-11 px-6 rounded-xl bg-primary text-white text-xs font-bold disabled:bg-soft-gray disabled:text-gray-400 transition-colors shadow-sm"
                    >
                      {loading ? "Submitting..." : "Submit Contribution"}
                    </button>
                  </div>
                </AppleCard>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-[#1C1C1E] border border-border-val rounded-3xl p-10 shadow-sm flex flex-col items-center justify-center text-center h-[50vh]"
            >
              <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center mb-6">
                <Check size={28} className="stroke-[3]" />
              </div>
              <h3 className="text-xl font-bold text-apple-text mb-2">Contribution Submitted!</h3>
              <p className="text-sm font-semibold text-gray-400 max-w-sm mb-8">
                Thank you! Your submission has been saved to the validation queue and will be reviewed by a native speaker.
              </p>
              
              <button
                onClick={handleReset}
                className="h-11 px-6 rounded-xl bg-primary text-white text-xs font-bold shadow-sm"
              >
                Contribute another phrase
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

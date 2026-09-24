"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { updateRepo } from "@/actions/github";
import IOSToggle from "./IOSToggle";
import AlertModal from "./AlertModal";
import DangerConfirmModal from "./DangerConfirmModal";

interface RepoSettingsModalProps {
  isOpen: boolean;
  repo: any;
  onClose: () => void;
  onSaved?: () => void;
}

export default function RepoSettingsModal({
  isOpen,
  repo,
  onClose,
  onSaved,
}: RepoSettingsModalProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [saving, setSaving] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "info" as "info" | "success" | "error" | "warning",
    title: undefined as string | undefined,
  });

  const [showConfirm, setShowConfirm] = useState(false);

  // Reset state whenever modal opens
  useEffect(() => {
    if (isOpen && repo) {
      setName(repo.name || "");
      setDescription(repo.description || "");
      setIsPrivate(repo.private || false);
      setSaving(false);
      setShowConfirm(false);
    }
  }, [isOpen, repo]);

  if (!repo) return null;

  const nameChanged = name.trim() !== (repo?.name || "");
  const descriptionChanged = description !== (repo?.description || "");
  const visibilityChanged = isPrivate !== (repo?.private || false);
  const isDirty = nameChanged || descriptionChanged || visibilityChanged;

  // Only name or visibility changes need extra confirmation
  const needsConfirm = nameChanged || visibilityChanged;

  const oldFullPath = `${repo?.owner?.login || ""}/${repo?.name || ""}`;
  const newFullPath = `${repo?.owner?.login || ""}/${name.trim() || repo?.name}`;

  const showAlert = (
    message: string,
    type: "info" | "success" | "error" | "warning" = "info",
    title?: string
  ) => {
    setAlertConfig({ isOpen: true, message, type, title });
  };

  const validateName = (n: string): string | null => {
    if (!n.trim()) return "Repository name cannot be empty.";
    if (n.length > 100) return "Name is too long (max 100 characters).";
    if (!/^[a-zA-Z0-9._-]+$/.test(n)) {
      return "Name can only contain letters, numbers, hyphens, underscores, and dots.";
    }
    return null;
  };

  const executeSave = async () => {
    setSaving(true);
    try {
      const payload: any = {};
      if (nameChanged) payload.name = name.trim();
      if (descriptionChanged) payload.description = description;
      if (visibilityChanged) payload.private = isPrivate;

      const res: any = await updateRepo(repo.owner.login, repo.name, payload);
      if (res?.error) throw new Error(res.error);

      setShowConfirm(false);
      router.refresh();
      onClose();
      onSaved?.();
    } catch (err: any) {
      setShowConfirm(false);
      setSaving(false);
      showAlert(err.message || "Failed to save changes.", "error", "Error");
    }
  };

  const handleSaveClick = () => {
    if (!isDirty || saving) return;

    if (nameChanged) {
      const nameError = validateName(name);
      if (nameError) {
        showAlert(nameError, "error", "Invalid Name");
        return;
      }
    }

    if (needsConfirm) {
      setShowConfirm(true);
    } else {
      executeSave();
    }
  };

  // Confirmation modal copy — dynamic based on what changed
  let confirmTitle = "Confirm Changes";
  let confirmDescription = "The following changes will be applied:";

  if (nameChanged && !visibilityChanged) {
    confirmTitle = "Confirm Rename";
    confirmDescription =
      "Your repository will be renamed. The old URL will automatically redirect to the new one:";
  } else if (!nameChanged && visibilityChanged) {
    if (isPrivate) {
      confirmTitle = "Make Repository Private?";
      confirmDescription =
        "This repository will be hidden from the public. Only you will be able to access it:";
    } else {
      confirmTitle = "Make Repository Public?";
      confirmDescription =
        "All files and history will become visible to everyone on the internet:";
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[10001] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-[420px] bg-[#F2F2F7] rounded-t-[20px] sm:rounded-[20px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Grabber */}
              <div className="sm:hidden flex justify-center pt-2 pb-1 shrink-0">
                <div className="w-9 h-[5px] rounded-full bg-black/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-3 pb-3 shrink-0">
                <h2 className="text-[16px] font-semibold text-black tracking-tight">
                  Repository Settings
                </h2>
                <button
                  onClick={onClose}
                  disabled={saving}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 text-[#8E8E93] active:bg-black/10 transition-colors disabled:opacity-40"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
                {/* Basic Info Card */}
                <div className="bg-white rounded-2xl overflow-hidden mb-4">
                  {/* Name */}
                  <div className="px-4 py-3">
                    <label className="text-[12px] text-[#8E8E93] font-medium block mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={saving}
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      placeholder="repository-name"
                      className="w-full bg-transparent text-[15px] text-black outline-none disabled:opacity-50"
                    />
                  </div>

                  <div className="h-[0.5px] bg-[#C6C6C8]/50 ml-4" />

                  {/* Description */}
                  <div className="px-4 py-3">
                    <label className="text-[12px] text-[#8E8E93] font-medium block mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={saving}
                      rows={3}
                      maxLength={350}
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="Add a description…"
                      className="w-full bg-transparent text-[14px] text-black outline-none resize-none leading-snug disabled:opacity-50"
                    />
                    <div className="text-right text-[11px] text-[#8E8E93] mt-0.5">
                      {description.length}/350
                    </div>
                  </div>
                </div>

                {/* Visibility Section */}
                <div className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider px-1 mb-1.5">
                  Visibility
                </div>

                <div className="bg-white rounded-2xl overflow-hidden mb-4">
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <div className="text-[15px] text-black font-medium">
                        Private
                      </div>
                      <div className="text-[12px] text-[#8E8E93] mt-0.5 leading-snug">
                        {isPrivate
                          ? "Only you can see this repository"
                          : "Anyone can see this repository"}
                      </div>
                    </div>
                    <IOSToggle
                      checked={isPrivate}
                      onChange={setIsPrivate}
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveClick}
                  disabled={!isDirty || saving}
                  className="w-full py-3.5 bg-[#007AFF] active:bg-[#0062CC] text-white text-[15px] font-semibold rounded-2xl transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {saving && (
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeOpacity="0.3"
                      />
                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation (only for name/visibility changes) */}
      <DangerConfirmModal
        isOpen={showConfirm}
        title={confirmTitle}
        description={confirmDescription}
        highlight={oldFullPath}
        instructionPrefix="Type"
        instructionSuffix="below to confirm"
        expectedValue={oldFullPath}
        caseSensitive={true}
        variant="warning"
        confirmText="Save Changes"
        loading={saving}
        onCancel={() => setShowConfirm(false)}
        onConfirm={executeSave}
      />

      {/* Error / Info Alert */}
      <AlertModal
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        title={alertConfig.title}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </>
  );
}
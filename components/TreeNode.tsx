"use client";

import { useState } from "react";
import { Folder, FolderOpen, FileText } from "lucide-react";
import { formatSize, encodeBase64, decodeBase64 } from "@/lib/utils";
import { getFileContent } from "@/actions/github";
import { useEditStore } from "@/store/useEditStore";
import AlertModal from "./AlertModal";
import ConfirmModal from "./ConfirmModal";

export default function TreeNode({
  nodeName,
  nodeData,
}: {
  nodeName: string;
  nodeData: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error" as "info" | "success" | "error" | "warning",
  });
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: () => {},
  });

  const showAlert = (
    message: string,
    type: "info" | "success" | "error" | "warning" = "error"
  ) => setAlertConfig({ isOpen: true, message, type });

  const showConfirm = (
    title: string,
    message: string,
    confirmText: string,
    onConfirm: () => void
  ) => setConfirmConfig({ isOpen: true, title, message, confirmText, onConfirm });

  const { owner, repo, branch, addToQueue, queue, isEditMode, setEditingFile } =
    useEditStore();

  const isFolder = nodeData._info.type === "tree";
  const info = nodeData._info;
  const queuedItem = !isFolder ? queue.find((q) => q.path === info.path) : null;

  const sizeKB = (info.size || 0) / 1024;
  const isLarge = sizeKB > 100;
  const isBinary = Boolean(
    info.path?.match(/\.(png|jpe?g|gif|ico|webp|mp4|mp3|ttf|woff2?|eot|pdf|zip|tar|gz|rar|7z)$/i)
  );

  const handleCopy = async () => {
    setLoading(true);
    try {
      const data = await getFileContent(owner, repo, info.path, branch);
      const decoded = decodeBase64(data.content);
      await navigator.clipboard.writeText(decoded);
    } catch (err: any) {
      showAlert("Copy failed: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const data = await getFileContent(owner, repo, info.path, branch);
      const cleanBase64 = data.content.replace(/\s/g, "");
      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray]);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nodeName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      showAlert("Download failed: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReplace = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return showAlert("Clipboard is empty!", "error");

      showConfirm(
        "Replace File?",
        `Replace "${info.path}" with the content from your clipboard?`,
        "Replace",
        () => {
          const oldSize = info.size || 0;
          const newSize = new Blob([text]).size;
          const sizeDiff = newSize - oldSize;
          const contentBase64 = encodeBase64(text);
          addToQueue({
            path: info.path,
            sha: info.sha,
            contentBase64,
            isDelete: false,
            sizeDiff,
          });
          setConfirmConfig((p) => ({ ...p, isOpen: false }));
        }
      );
    } catch (err: any) {
      showAlert("Replace failed: " + err.message, "error");
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const data = await getFileContent(owner, repo, info.path, branch);
      const decoded = decodeBase64(data.content);
      setEditingFile({
        path: info.path,
        sha: info.sha,
        content: decoded,
        oldSize: info.size || 0,
      });
    } catch (err: any) {
      showAlert("Edit failed: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    showConfirm(
      "Delete File?",
      `"${info.path}" will be added to the commit queue for deletion.`,
      "Delete",
      () => {
        const oldSize = info.size || 0;
        addToQueue({
          path: info.path,
          sha: info.sha,
          isDelete: true,
          sizeDiff: -oldSize,
        });
        setConfirmConfig((p) => ({ ...p, isOpen: false }));
      }
    );
  };

  const childKeys = Object.keys(nodeData)
    .filter((k) => k !== "_info")
    .sort((a, b) => {
      const isDirA = nodeData[a]._info.type === "tree";
      const isDirB = nodeData[b]._info.type === "tree";
      if (isDirA && !isDirB) return -1;
      if (!isDirA && isDirB) return 1;
      return a.localeCompare(b);
    });

  return (
    <>
      <li className="list-none m-0 p-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3 py-2 px-3 rounded-xl hover:bg-black/[0.03] transition-colors group">
          {/* Left: Icon + Name */}
          {isFolder ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
            >
              {isOpen ? (
                <FolderOpen className="w-[18px] h-[18px] text-[#FF9500] shrink-0" strokeWidth={2.2} />
              ) : (
                <Folder className="w-[18px] h-[18px] text-[#FF9500] shrink-0" strokeWidth={2.2} />
              )}
              <span className="font-medium text-[14px] truncate text-black">
                {nodeName}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <FileText
                className="w-[18px] h-[18px] text-[#8E8E93] shrink-0 group-hover:text-[#007AFF] transition-colors"
                strokeWidth={2.2}
              />
              <div className="flex flex-col min-w-0">
                <span
                  className={`font-medium text-[14px] truncate ${
                    queuedItem?.isDelete
                      ? "line-through text-[#FF3B30] opacity-70"
                      : "text-black"
                  }`}
                >
                  {nodeName}
                </span>
                <span className="text-[11px] text-[#8E8E93] font-mono opacity-80 flex items-center">
                  {formatSize(sizeKB)}
                  {queuedItem &&
                    queuedItem.sizeDiff !== undefined &&
                    queuedItem.sizeDiff !== 0 && (
                      <span
                        className={`ml-1.5 font-bold ${
                          queuedItem.sizeDiff > 0
                            ? "text-[#34C759]"
                            : "text-[#FF3B30]"
                        }`}
                      >
                        {queuedItem.sizeDiff > 0 ? "+" : ""}
                        {(queuedItem.sizeDiff / 1024).toFixed(2)} KB
                      </span>
                    )}
                </span>
              </div>
            </div>
          )}

          {/* Right: Action Pills */}
          {!isFolder && (
            <div className="flex items-center gap-1.5 mt-1 md:mt-0 pl-[28px] md:pl-0 w-full md:w-auto md:opacity-0 md:translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all shrink-0">
              {/* Copy / Download */}
              {isBinary || isLarge ? (
                <button
                  onClick={handleDownload}
                  disabled={loading}
                  className="flex-1 md:flex-none px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-[#007AFF1F] text-[#007AFF] hover:bg-[#007AFF33] active:bg-[#007AFF40] transition-colors disabled:opacity-40"
                >
                  {loading ? "…" : "Download"}
                </button>
              ) : (
                <button
                  onClick={handleCopy}
                  disabled={loading}
                  className="flex-1 md:flex-none px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-[#007AFF1F] text-[#007AFF] hover:bg-[#007AFF33] active:bg-[#007AFF40] transition-colors disabled:opacity-40"
                >
                  {loading ? "…" : "Copy"}
                </button>
              )}

              {/* Edit / Replace */}
              {!isBinary &&
                (isEditMode ? (
                  <button
                    onClick={handleEdit}
                    disabled={loading}
                    className="flex-1 md:flex-none px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-[#34C7591F] text-[#34C759] hover:bg-[#34C75933] active:bg-[#34C75940] transition-colors disabled:opacity-40"
                  >
                    {loading ? "…" : "Edit"}
                  </button>
                ) : (
                  <button
                    onClick={handleReplace}
                    disabled={loading}
                    className="flex-1 md:flex-none px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-[#FF95001F] text-[#FF9500] hover:bg-[#FF950033] active:bg-[#FF950040] transition-colors disabled:opacity-40"
                  >
                    Replace
                  </button>
                ))}

              {/* Delete */}
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 md:flex-none px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-[#FF3B301F] text-[#FF3B30] hover:bg-[#FF3B3033] active:bg-[#FF3B3040] transition-colors disabled:opacity-40"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Children */}
        {isFolder && isOpen && (
          <ul className="pl-5 border-l border-[#C6C6C8]/40 ml-2 mt-0.5">
            {childKeys.map((key) => (
              <TreeNode key={key} nodeName={key} nodeData={nodeData[key]} />
            ))}
          </ul>
        )}
      </li>

      {/* Modals */}
      <AlertModal
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        isDestructive={confirmConfig.confirmText === "Delete"}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((p) => ({ ...p, isOpen: false }))}
      />
    </>
  );
}
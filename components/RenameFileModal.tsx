"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AlertModal from "./AlertModal";

interface RenameFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onSave: (newPath: string) => void;
}

export default function RenameFileModal({
  isOpen,
  onClose,
  currentPath,
  onSave,
}: RenameFileModalProps) {
  const [newPath, setNewPath] = useState(currentPath);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error" as const,
  });

  useEffect(() => {
    if (isOpen) setNewPath(currentPath);
  }, [isOpen, currentPath]);

  const handleSave = () => {
    const getExt = (p: string) => {
      const parts = p.split(".");
      return parts.length > 1 ? parts.pop()?.toLowerCase() : "";
    };

    const oldExt = getExt(currentPath);
    const nextExt = getExt(newPath);

    if (oldExt !== nextExt) {
      setAlertConfig({
        isOpen: true,
        message: `Extension change not allowed! Your file must end with ${
          oldExt ? `.${oldExt}` : "no extension"
        }.`,
        type: "error",
      });
      return;
    }

    if (newPath.trim() === "") {
      setAlertConfig({
        isOpen: true,
        message: "Path cannot be empty!",
        type: "error",
      });
      return;
    }

    onSave(newPath.trim());
    onClose();
  };

  const handleClose = () => {
    setNewPath(currentPath);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[300px] bg-[#F2F2F7]/95 backdrop-blur-xl rounded-[14px] overflow-hidden shadow-2xl"
            >
              {/* Content */}
              <div className="px-4 pt-5 pb-4">
                <h3 className="text-[17px] font-semibold text-black leading-tight tracking-tight text-center">
                  Edit File Path
                </h3>
                <p className="text-[13px] text-black/85 leading-snug mt-1.5 text-center">
                  Folders will be automatically created if they don't exist.
                </p>

                <input
                  type="text"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  autoFocus
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="mt-4 w-full px-3 py-2.5 bg-white rounded-[10px] text-[13px] font-mono text-black outline-none focus:ring-2 focus:ring-[#007AFF]/40 transition-all"
                  placeholder="e.g. src/app/main.py"
                />
              </div>

              {/* Divider */}
              <div className="h-[0.5px] bg-[#3C3C43]/30" />

              {/* Buttons */}
              <div className="flex relative">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 text-[17px] text-[#007AFF] active:bg-black/5 transition-colors"
                >
                  Cancel
                </button>

                <div className="w-[0.5px] bg-[#3C3C43]/30" />

                <button
                  onClick={handleSave}
                  className="flex-1 py-3 text-[17px] font-semibold text-[#007AFF] active:bg-black/5 transition-colors"
                >
                  Update
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reuse existing iOS AlertModal for validation errors */}
      <AlertModal
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </>
  );
}
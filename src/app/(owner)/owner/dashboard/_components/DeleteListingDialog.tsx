"use client";

import { useState, useTransition } from "react";
import { Button } from "@/shared/components/ui/Button";
import { deleteListingAction } from "@/features/listing/actions";

interface Props {
  listingId: string;
  listingName: string;
  onClose: () => void;
}

export default function DeleteListingDialog({ listingId, listingName, onClose }: Props) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError("");
    startTransition(async () => {
      const result = await deleteListingAction(listingId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-black text-[#0F172A] text-lg">Delete Court</h3>
            <p className="text-[#737373] text-sm mt-0.5">This action cannot be undone.</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#A3A3A3] hover:text-[#0F172A] transition-colors p-1 rounded-md"
            aria-label="Close"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <p className="text-sm text-[#525252]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#0F172A]">{listingName}</span>? Historical
          booking records will be preserved.
        </p>

        {error && <p className="text-sm text-[#DC2626]">{error}</p>}

        <div className="flex gap-2 pt-1">
          <Button variant="ghost" size="md" fullWidth onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="danger" size="md" fullWidth loading={isPending} onClick={handleDelete}>
            Delete Court
          </Button>
        </div>
      </div>
    </div>
  );
}

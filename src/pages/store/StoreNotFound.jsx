import React from "react";

export default function StoreNotFound({ reason }) {
  return (
    <div className="min-h-dvh flex items-center justify-center text-center px-4 bg-paper">
      <div className="max-w-sm">
        <div className="eyebrow mb-4">{reason === "not-found" ? "404" : "Error"}</div>
        <h1 className="text-3xl text-ink mb-3">Store not found</h1>
        <p className="text-ink-soft leading-relaxed">
          {reason === "not-found"
            ? "This storefront doesn’t exist, or isn’t live yet."
            : "Something went wrong loading this storefront. Please try again shortly."}
        </p>
      </div>
    </div>
  );
}

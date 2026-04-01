import React from "react";

export const Textarea = React.forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        ref={ref}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition resize-none bg-white text-gray-900 placeholder-gray-400 ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-300 focus:ring-emerald-500"
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
});

Textarea.displayName = "Textarea";

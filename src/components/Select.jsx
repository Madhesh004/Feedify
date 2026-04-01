import React from "react";

export const Select = React.forwardRef(({ label, error, options = [], ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        ref={ref}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition bg-white text-gray-900 ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-300 focus:ring-emerald-500"
        }`}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
});

Select.displayName = "Select";

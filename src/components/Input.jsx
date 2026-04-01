import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const Input = React.forwardRef(({ label, error, type = "text", ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition bg-white text-gray-900 placeholder-gray-400 ${
            error
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 focus:ring-emerald-500"
          }`}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";

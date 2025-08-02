import React from "react";

const Alert = ({
  type = "info",
  message,
  onClose,
  dismissible = false,
  className = "",
}) => {
  const baseClasses =
    "px-4 py-3 rounded-md border-l-4 mb-4 flex items-start justify-between";

  const typeClasses = {
    success: "bg-green-50 border-green-500 text-green-800",
    error: "bg-red-50 border-red-500 text-red-800",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
    info: "bg-blue-50 border-blue-500 text-blue-800",
  };

  const iconClasses = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div
      className={`${baseClasses} ${typeClasses[type]} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <span className="mr-2 text-lg font-bold">{iconClasses[type]}</span>
        <div className="flex-1">
          {typeof message === "string" ? (
            <p className="text-sm font-medium">{message}</p>
          ) : (
            message
          )}
        </div>
      </div>

      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-lg font-bold hover:opacity-75 focus:outline-none"
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;

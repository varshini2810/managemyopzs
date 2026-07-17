import React from "react"; // Custom pill toggle — replaces all default checkboxes for settings toggles
// Usage: <Toggle checked={val} onChange={setVal} />
export default function Toggle({ checked, onChange, disabled = false, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      {" "}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className="relative inline-flex shrink-0 h-5 w-9 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: checked ? "#2D5BFF" : "#D4D1CE" }}
      >
        {" "}
        <span
          className="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out"
          style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }}
        />{" "}
      </button>{" "}
      {label && <span className="text-sm text-ink">{label}</span>}{" "}
    </label>
  );
}

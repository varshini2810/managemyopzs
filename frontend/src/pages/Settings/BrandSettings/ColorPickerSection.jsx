import React from "react";
const PRESET_SWATCHES = [
  "#F59E0B",
  "#EA580C",
  "#DC2626",
  "#E11D48",
  "#7E22CE",
  "#586EF0",
  "#2563EB",
  "#0891B2",
  "#16A34A",
  "#111827",
];
export default function ColorPickerSection({ accentColor, setAccentColor }) {
  const handleHexChange = (e) => {
    setAccentColor(e.target.value);
  };
  return (
    <div className="bg-white border border-stone-200 rounded-card p-6 mb-8 shadow-sm">
      {" "}
      <h3 className="text-lg font-semibold text-stone-900 mb-1">
        Pick an accent color
      </h3>{" "}
      <p className="text-sm text-stone-500 mb-6">
        This color will be used for buttons, links, and highlights.
      </p>{" "}
      <div className="flex flex-col sm:flex-row gap-6">
        {" "}
        {/* Large Color Preview Box */}{" "}
        <div
          className="w-24 h-24 rounded-card shadow-inner flex-shrink-0 border border-stone-200"
          style={{ backgroundColor: accentColor || "#2196F3" }}
        />{" "}
        <div className="flex flex-col flex-1 gap-4">
          {" "}
          <div className="flex gap-4 items-center">
            {" "}
            <div className="flex flex-col gap-1 w-32">
              {" "}
              <label className="text-xs font-medium text-stone-700 uppercase tracking-wider">
                HEX
              </label>{" "}
              <div className="relative">
                {" "}
                <input
                  type="text"
                  value={accentColor}
                  onChange={handleHexChange}
                  className="w-full px-3 py-2 border border-stone-300 rounded-input text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex flex-col gap-1">
              {" "}
              <label className="text-xs font-medium text-stone-700 uppercase tracking-wider">
                Visual
              </label>{" "}
              <div className="relative overflow-hidden w-10 h-10 rounded-card border border-stone-300">
                {" "}
                <input
                  type="color"
                  value={accentColor || "#2196F3"}
                  onChange={handleHexChange}
                  className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer"
                />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="text-xs font-medium text-stone-700 uppercase tracking-wider block mb-2">
              Presets
            </label>{" "}
            <div className="flex flex-wrap gap-2">
              {" "}
              {PRESET_SWATCHES.map((color) => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className={`w-8 h-8 rounded-card border-2 transition-transform hover:scale-110 ${accentColor === color ? "border-stone-900 ring-2 ring-offset-1 ring-stone-900" : "border-transparent shadow-sm"}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

import React, { useState, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Archive,
} from "lucide-react"; /* ─── Skeleton Row ─────────────────────────────────────────────── */
function SkeletonRows({ columns, count = 8 }) {
  return Array.from({ length: count }).map((_, i) => (
    <tr key={i} className="border-b border-border">
      {columns.map((col, ci) => (
        <td key={ci} className="px-4 py-3">
          <div
            className="skeleton rounded"
            style={{
              height: 14,
              width:
                col.skeletonWidth ||
                (ci === 0 ? "60%" : ci === columns.length - 1 ? "50px" : "80%"),
              background: "#E7E5E2",
              animation: "skeletonPulse 1.5s ease-in-out infinite",
              animationDelay: `${i * 60}ms`,
            }}
          />{" "}
        </td>
      ))}</tr>
  ));
} /* ─── DataTable ─────────────────────────────────────────────────── */
export default function DataTable({
  columns,
  data,
  loading = false,
  totalElements = 0,
  page = 0,
  size = 20,
  onPageChange,
  onSearch,
  searchPlaceholder = "Search…",
  actions,
  onRowClick,
  bulkActions,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [showCheck, setShowCheck] = useState(false);
  const totalPages = Math.ceil(totalElements / size);
  const startRow = page * size + 1;
  const endRow = Math.min((page + 1) * size, totalElements);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch?.(searchTerm);
  };
  const toggleRow = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setShowCheck(true);
  }, []);
  const toggleAll = () => {
    if (selected.size === data.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.map((r) => r.id)));
    }
  };
  const clearSelection = () => {
    setSelected(new Set());
    setShowCheck(false);
  };
  return (
    <div
      className="bg-surface rounded-lg overflow-hidden"
      style={{ border: "1px solid #E7E5E2" }}
    >
      {" "}
      {/* ── Toolbar ── */}{" "}
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
        style={{ borderBottom: "1px solid #E7E5E2" }}
      >
        {" "}
        {/* Search */}{" "}
        <div className="relative" style={{ minWidth: 220, maxWidth: 360 }}>
          {" "}
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#A8A49F" }}
          />{" "}
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input pl-8 text-sm"
            style={{ height: 32 }}
          />{" "}
        </div>{" "}
        {/* Actions slot */}{" "}
        <div className="flex items-center gap-2"> {actions} </div>{" "}
      </div>{" "}
      {/* ── Table ── */}{" "}
      <div className="tbl-wrapper">
        <table className="tbl">
          <thead>
            <tr>
              {/* Checkbox col */}{" "}
              {(showCheck || selected.size > 0) && (
                <th style={{ width: 40, paddingLeft: 16 }}>
                  <input
                    type="checkbox"
                    checked={selected.size === data.length && data.length > 0}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 accent-accent cursor-pointer"
                  />{" "}
                </th>
              )}{" "}
              {columns.map((col, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: col.align === "right" ? "right" : "left",
                    width: col.width,
                  }}
                >
                  {col.header}{" "}
                </th>
              ))}</tr></thead>{" "}
          <tbody>
            {loading ? (
              <SkeletonRows
                columns={[
                  ...(showCheck ? [{ skeletonWidth: 20 }] : []),
                  ...columns,
                ]}
              />
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showCheck ? 1 : 0)}
                  className="px-4 py-12 text-center text-sm"
                  style={{ color: "#A8A49F" }}
                >
                  No records found{" "}
                </td></tr>
            ) : (
              data.map((row, ri) => (
                <tr
                  key={row.id || ri}
                  onClick={() => onRowClick?.(row)}
                  onMouseEnter={() =>
                    !showCheck && selected.size === 0 && undefined
                  }
                >
                  {(showCheck || selected.size > 0) && (
                    <td
                      style={{ width: 40, paddingLeft: 16 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRow(row.id);
                      }}
                    >
                      {" "}
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleRow(row.id)}
                        className="w-3.5 h-3.5 accent-accent cursor-pointer"
                      />{" "}
                    </td>
                  )}{" "}
                  {columns.map((col, ci) => (
                    <td key={ci} className={col.align === "right" ? "num" : ""}>
                      {col.cell ? col.cell(row) : row[col.accessor]}{" "}
                    </td>
                  ))}</tr>
              ))
            )}</tbody></table>{" "}
      </div>{" "}
      {/* ── Pagination ── */}{" "}
      {!loading && totalElements > 0 && (
        <div
          className="flex items-center justify-between px-4 py-3 text-xs"
          style={{ borderTop: "1px solid #E7E5E2", color: "#6B6863" }}
        >
          {" "}
          <span className="tabular-nums">
            {" "}
            Showing{" "}
            <strong className="text-ink">
              {startRow}–{endRow}
            </strong>{" "}
            of{" "}
            <strong className="text-ink">
              {totalElements.toLocaleString()}
            </strong>{" "}
          </span>{" "}
          <div className="flex items-center gap-1">
            {" "}
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page === 0}
              className="btn btn-secondary btn-xs"
              style={{ padding: "4px 6px" }}
            >
              {" "}
              <ChevronLeft size={12} />{" "}
            </button>{" "}
            <span
              className="px-2 tabular-nums"
              style={{ minWidth: 80, textAlign: "center" }}
            >
              {" "}
              Page {page + 1} / {totalPages || 1}{" "}
            </span>{" "}
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages - 1}
              className="btn btn-secondary btn-xs"
              style={{ padding: "4px 6px" }}
            >
              {" "}
              <ChevronRight size={12} />{" "}
            </button>{" "}
          </div>{" "}
        </div>
      )}{" "}
      {/* ── Floating Bulk Action Bar ── */}{" "}
      {selected.size > 0 && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-ink text-white rounded-lg shadow-tooltip"
          style={{ border: "1px solid #2A2620" }}
        >
          {" "}
          <span className="text-sm font-medium tabular-nums">
            {" "}
            {selected.size} selected{" "}
          </span>{" "}
          <div className="w-px h-4 bg-stone-600" />{" "}
          {bulkActions?.map((ba, i) => (
            <button
              key={i}
              onClick={() => {
                ba.action(Array.from(selected));
                clearSelection();
              }}
              className="flex items-center gap-1.5 text-sm hover:text-stone-300 transition-colors"
            >
              {" "}
              {ba.icon && <ba.icon size={14} />} {ba.label}{" "}
            </button>
          ))}{" "}
          <button
            onClick={clearSelection}
            className="text-stone-400 hover:text-white text-xs ml-2 transition-colors"
          >
            {" "}
            Cancel{" "}
          </button>{" "}
        </div>
      )}{" "}
    </div>
  );
}

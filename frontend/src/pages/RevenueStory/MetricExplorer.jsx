import React, { useState } from "react";
import { Search, Download, Save, BarChart2 } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/api";
import toast from "react-hot-toast";
export default function MetricExplorer() {
  const [metric, setMetric] = useState("MRR");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState("Line");
  const handleApply = () => {
    setLoading(true);
    api
      .get("/revenue-story/dashboard")
      .then((res) => {
        setData(res.data.data.chartData);
      })
      .catch(() => toast.error("Failed to load metric data"))
      .finally(() => setLoading(false));
  };
  const renderChart = () => {
    if (!data) {
      return (
        <div className="flex flex-col items-center gap-2">
          {" "}
          <BarChart2 size={32} className="text-stone-300" />{" "}
          <span>Select metrics and apply filters to explore data</span>{" "}
        </div>
      );
    }
    if (loading) return <div>Loading data...</div>;
    const dataKey = metric === "MRR" ? "mrr" : "customers";
    const color = metric === "MRR" ? "#2D5BFF" : "#00A86B";
    if (chartType === "Bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          {" "}
          <BarChart data={data}>
            {" "}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E7E5E2"
            />{" "}
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#848281", fontSize: 12 }}
              dy={10}
            />{" "}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#848281", fontSize: 12 }}
              dx={-10}
            />{" "}
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #E7E5E2",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              }}
              cursor={{ fill: "#F4F4F5" }}
            />{" "}
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />{" "}
          </BarChart>{" "}
        </ResponsiveContainer>
      );
    }
    if (chartType === "Line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          {" "}
          <LineChart data={data}>
            {" "}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E7E5E2"
            />{" "}
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#848281", fontSize: 12 }}
              dy={10}
            />{" "}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#848281", fontSize: 12 }}
              dx={-10}
            />{" "}
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #E7E5E2",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              }}
            />{" "}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />{" "}
          </LineChart>{" "}
        </ResponsiveContainer>
      );
    }
    return (
      <div className="w-full h-full overflow-auto p-4">
        <table className="w-full text-left text-sm text-slate-700">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-2 font-medium">Period</th>{" "}
              <th className="pb-2 font-medium text-right">Value</th></tr></thead>{" "}
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100">
                <td className="py-2">{row.name}</td>{" "}
                <td className="py-2 text-right">{row[dataKey]}</td></tr>
            ))}</tbody></table>{" "}
      </div>
    );
  };
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {" "}
      <div className="page-header">
        {" "}
        <div>
          {" "}
          <h1 className="page-title">Metric Explorer</h1>{" "}
          <p className="page-subtitle">
            Flexible analysis for all your revenue metrics.
          </p>{" "}
        </div>{" "}
        <div className="flex items-center gap-3">
          {" "}
          <button className="btn-secondary">
            <Save size={14} /> Save as Custom Metric
          </button>{" "}
          <button className="btn-secondary">
            <Download size={14} /> Export
          </button>{" "}
        </div>{" "}
      </div>{" "}
      <div className="card p-4 flex items-end gap-4 bg-stone-50">
        {" "}
        <div className="flex-1">
          {" "}
          <label className="label">Metric</label>{" "}
          <select
            className="select"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            {" "}
            <option value="MRR">Monthly Recurring Revenue (MRR)</option>{" "}
            <option value="ARR">Annual Recurring Revenue (ARR)</option>{" "}
            <option value="Customers">Total Customers</option>{" "}
          </select>{" "}
        </div>{" "}
        <div className="flex-1">
          {" "}
          <label className="label">Filter By</label>{" "}
          <select className="select">
            <option>All Plans</option>
          </select>{" "}
        </div>{" "}
        <div className="flex-1">
          {" "}
          <label className="label">Group By</label>{" "}
          <select className="select">
            {" "}
            <option>Month</option> <option>Quarter</option>{" "}
            <option>Week</option>{" "}
          </select>{" "}
        </div>{" "}
        <button className="btn-primary" onClick={handleApply}>
          Apply
        </button>{" "}
      </div>{" "}
      <div className="card min-h-[400px] flex flex-col">
        {" "}
        <div className="flex items-center justify-between mb-4">
          {" "}
          <div className="section-label mb-0">{metric} Trend</div>{" "}
          <div className="seg-control">
            {" "}
            <button
              className={`seg-btn ${chartType === "Line" ? "active" : ""}`}
              onClick={() => setChartType("Line")}
            >
              Line
            </button>{" "}
            <button
              className={`seg-btn ${chartType === "Bar" ? "active" : ""}`}
              onClick={() => setChartType("Bar")}
            >
              Bar
            </button>{" "}
            <button
              className={`seg-btn ${chartType === "Table" ? "active" : ""}`}
              onClick={() => setChartType("Table")}
            >
              Table
            </button>{" "}
          </div>{" "}
        </div>{" "}
        <div
          className={`flex-1 flex items-center justify-center ${!data ? "text-muted border border-dashed border-border rounded" : ""} min-h-[300px]`}
        >
          {" "}
          {renderChart()}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

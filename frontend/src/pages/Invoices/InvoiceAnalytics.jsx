import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../../services/api";
const COLORS = ["#6366f1", "#10b981", "#f43f5e", "#f59e0b"];
export default function InvoiceAnalytics() {
  const [metric, setMetric] = useState("Total Paid Amount");
  const [range, setRange] = useState("Last 30 Days");
  const [groupBy, setGroupBy] = useState("Daily");
  const [chartType, setChartType] = useState("Bar");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    api
      .get(
        `/invoices/analytics?metric=${metric}&range=${range}&groupBy=${groupBy}&chartType=${chartType}`,
      )
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [metric, range, groupBy, chartType]);
  const renderChart = () => {
    if (loading)
      return (
        <div className="h-64 flex items-center justify-center text-muted">
          Loading chart data...
        </div>
      );
    if (chartType === "Pie" || metric === "Invoices by Payment Status") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          {" "}
          <PieChart>
            {" "}
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label
            >
              {" "}
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}{" "}
            </Pie>{" "}
            <Tooltip /> <Legend />{" "}
          </PieChart>{" "}
        </ResponsiveContainer>
      );
    }
    if (chartType === "Line") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          {" "}
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            {" "}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />{" "}
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />{" "}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />{" "}
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />{" "}
            <Legend />{" "}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />{" "}
          </LineChart>{" "}
        </ResponsiveContainer>
      );
    }
    /*  Default to Bar  */ return (
      <ResponsiveContainer width="100%" height={400}>
        {" "}
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          {" "}
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />{" "}
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />{" "}
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />{" "}
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            cursor={{ fill: "#f3f4f6" }}
          />{" "}
          <Legend />{" "}
          <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />{" "}
        </BarChart>{" "}
      </ResponsiveContainer>
    );
  };
  return (
    <div className="space-y-6">
      {" "}
      <div className="bg-surface rounded-card border border-gray-200 p-6 flex gap-4">
        {" "}
        <div className="flex-1">
          {" "}
          <label className="label">Metric</label>{" "}
          <select
            className="input w-full"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            {" "}
            <option>Total Paid Amount</option>{" "}
            <option>Invoices by Payment Status</option>{" "}
            <option>Revenue by Expense Type</option>{" "}
          </select>{" "}
        </div>{" "}
        <div className="flex-1">
          {" "}
          <label className="label">Time Range</label>{" "}
          <select
            className="input w-full"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            {" "}
            <option>Last 7 Days</option> <option>Last 30 Days</option>{" "}
            <option>This Quarter</option>{" "}
          </select>{" "}
        </div>{" "}
        <div className="flex-1">
          {" "}
          <label className="label">Group By</label>{" "}
          <select
            className="input w-full"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            {" "}
            <option>Daily</option> <option>Weekly</option>{" "}
            <option>Monthly</option>{" "}
          </select>{" "}
        </div>{" "}
        <div className="flex-1">
          {" "}
          <label className="label">Chart Type</label>{" "}
          <select
            className="input w-full"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            {" "}
            <option>Bar</option> <option>Line</option> <option>Pie</option>{" "}
          </select>{" "}
        </div>{" "}
      </div>{" "}
      <div className="bg-surface rounded-card border border-gray-200 p-6">
        {" "}
        <h3 className="text-lg font-semibold mb-6">
          {metric} Over {range}
        </h3>{" "}
        {renderChart()}{" "}
      </div>{" "}
    </div>
  );
}

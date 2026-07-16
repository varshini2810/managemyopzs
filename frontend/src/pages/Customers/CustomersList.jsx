import { useAuth } from "../../store/AuthContext";
import React, { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import DataTable from "../../components/common/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import useDebounce from "../../hooks/useDebounce";
export default function CustomersList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    api
      .get(
        `/customers?page=${page}&size=20&search=${debouncedSearch}&status=${status}`,
      )
      .then((res) => {
        setCustomers(res.data.data?.content || []);
        setTotalElements(res.data.data?.totalElements || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, status]);
  const columns = [
    {
      header: "Name",
      cell: (row) => (
        <div
          className="font-medium text-ink cursor-pointer hover:text-accent transition-colors"
          onClick={() => navigate(`/customers/${row.id}`)}
        >
          {" "}
          {row.firstName} {row.lastName}{" "}
        </div>
      ),
    },
    { header: "Email", accessor: "email", className: "text-muted" },
    { header: "Company", accessor: "companyName", className: "text-muted" },
    {
      header: "Created At",
      cell: (row) => (
        <span className="text-muted tabular-nums">
          {" "}
          {new Date(row.createdAt).toLocaleDateString()}{" "}
        </span>
      ),
    },
    { header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
  ];
  return (
    <div>
      {" "}
      <div className="module-header">
        {" "}
        <div>
          {" "}
          <h1 className="page-title">Customers</h1>{" "}
          <p className="page-subtitle">Manage your customer base</p>{" "}
        </div>{" "}
        <button
          className="btn-primary btn-sm"
          onClick={() => navigate("/customers/new")}
        >
          {" "}
          <Plus size={14} /> Create Customer{" "}
        </button>{" "}
      </div>{" "}
      <div className="px-8 py-6">
        {" "}
        <div
          className="bg-surface rounded-lg"
          style={{ border: "1px solid #E7E5E2" }}
        >
          {" "}
          <div className="p-4 border-b border-gray-200 flex gap-4">
            {" "}
            <div className="relative flex-1 max-w-sm">
              {" "}
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />{" "}
              <input
                type="text"
                className="input pl-9 w-full"
                placeholder="Search by name, email or ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
              />{" "}
            </div>{" "}
            <select
              className="input w-48"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
            >
              {" "}
              <option value="">All Statuses</option>{" "}
              <option value="ACTIVE">Active</option>{" "}
              <option value="ARCHIVED">Archived</option>{" "}
            </select>{" "}
          </div>{" "}
          <DataTable
            columns={columns}
            data={customers}
            loading={loading}
            totalElements={totalElements}
            page={page}
            size={20}
            onPageChange={setPage}
          />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

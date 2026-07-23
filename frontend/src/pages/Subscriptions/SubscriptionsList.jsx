import { useAuth } from "../../store/AuthContext";
import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import DataTable from "../../components/common/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import MonoId from "../../components/common/MonoId";
import useDebounce from "../../hooks/useDebounce";
export default function SubscriptionsList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
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
        `/subscriptions?page=${page}&size=20&search=${debouncedSearch}&status=${status}`,
      )
      .then((res) => {
        setSubscriptions(res.data.data?.content || []);
        setTotalElements(res.data.data?.totalElements || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, status]);
  const columns = [
    {
      header: "Subscription ID",
      cell: (row) => (
        <div
          className="cursor-pointer hover:text-primary transition-colors"
          onClick={() => navigate(`/subscriptions/${row.id}`)}
        >
          {" "}
          <MonoId id={row.id} />{" "}
        </div>
      ),
    },
    { header: "Customer ID", cell: (row) => <MonoId id={row.customerId} /> },
    { header: "Plan ID", cell: (row) => <MonoId id={row.planId} /> },
    {
      header: "Next Billing",
      cell: (row) => (
        <span className="text-muted tabular-nums">
          {" "}
          {row.nextBillingAt
            ? new Date(row.nextBillingAt).toLocaleDateString()
            : "—"}{" "}
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
          <h1 className="page-title">Subscriptions</h1>{" "}
          <p className="page-subtitle">Manage recurring billing cycles</p>{" "}
        </div>{" "}
        <button
          className="btn-primary btn-sm"
          onClick={() => navigate("/subscriptions/new")}
        >
          {" "}
          <Plus size={14} /> Create Subscription{" "}
        </button>{" "}
      </div>{" "}
      <div className="px-8 py-6">
        {" "}
        <div className="bg-surface rounded-card border border-gray-200">
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
                placeholder="Search by Subscription ID..."
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
              <option value="IN_TRIAL">In Trial</option>{" "}
              <option value="PAUSED">Paused</option>{" "}
              <option value="CANCELLED">Cancelled</option>{" "}
              <option value="NON_RENEWING">Non Renewing</option>{" "}
            </select>{" "}
          </div>{" "}
          <DataTable
            columns={columns}
            data={subscriptions}
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

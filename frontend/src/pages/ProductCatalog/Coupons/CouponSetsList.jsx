import React, { useState, useEffect } from "react";
import { Plus, Tag, Trash2, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../services/api";
import DataTable from "../../../components/common/DataTable";
import MonoId from "../../../components/common/MonoId";
export default function CouponSetsList() {
  const [sets, setSets] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const fetchSets = () => {
    setLoading(true);
    api
      .get(`/coupons/sets?page=${page}&size=20&search=${search}`)
      .then((res) => {
        setSets(res.data.data?.content || []);
        setTotalElements(res.data.data?.totalElements || 0);
      })
      .catch(() => toast.error("Failed to load coupon sets"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchSets();
  }, [page, search]);
  const handleDelete = async (id) => {
    if (window.confirm("Delete this coupon set?")) {
      try {
        await api.delete(`/coupons/sets/${id}`);
        toast.success("Coupon set deleted");
        fetchSets();
      } catch {
        toast.error("Failed to delete coupon set");
      }
    }
  };
  const columns = [
    {
      header: "Set Name",
      cell: (row) => (
        <div>
          {" "}
          <div className="text-sm font-medium text-ink">{row.name}</div>{" "}
          <MonoId value={row.id} label="Set ID" />{" "}
        </div>
      ),
    },
    { header: "Coupon ID", cell: (row) => <MonoId value={row.couponId} /> },
    {
      header: "Codes Generated",
      align: "right",
      cell: (row) => (
        <span className="text-sm font-medium text-ink tabular-nums">
          {row.totalCodes?.toLocaleString() || "0"}
        </span>
      ),
    },
    {
      header: "",
      align: "right",
      width: 60,
      cell: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row.id);
          }}
          className="btn-ghost p-2 btn-xs"
          style={{ color: "#C0292B" }}
          title="Delete"
        >
          {" "}
          <Trash2 size={13} />{" "}
        </button>
      ),
    },
  ];
  return (
    <div>
      {" "}
      <div className="module-header">
        {" "}
        <div className="breadcrumb">
          {" "}
          <span>Product Catalog</span>{" "}
          <ChevronRight size={12} className="breadcrumb-sep" />{" "}
          <span className="breadcrumb-current">Coupon Sets</span>{" "}
        </div>{" "}
        <button className="btn-primary btn-sm" disabled>
          {" "}
          <Plus size={13} /> Generate Set{" "}
        </button>{" "}
      </div>{" "}
      <div className="px-8 py-6 space-y-6">
        {" "}
        <div>
          {" "}
          <h1 className="page-title">Coupon Sets</h1>{" "}
          <p className="page-subtitle">
            Generate bulk unique codes for a specific coupon
          </p>{" "}
        </div>{" "}
        {!loading && sets.length === 0 && search === "" ? (
          <div
            className="bg-surface rounded-lg flex flex-col items-center justify-center py-20"
            style={{ border: "1px solid #E7E5E2" }}
          >
            {" "}
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: "#EEF2FF" }}
            >
              {" "}
              <Tag size={22} style={{ color: "#2D5BFF" }} />{" "}
            </div>{" "}
            <h3 className="text-base font-semibold text-ink mb-1">
              No Coupon Sets
            </h3>{" "}
            <p className="text-sm text-muted mb-6 text-center max-w-xs">
              {" "}
              Coupon sets allow you to generate thousands of unique, single-use
              codes linked to a single master coupon.{" "}
            </p>{" "}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={sets}
            loading={loading}
            totalElements={totalElements}
            page={page}
            size={20}
            onPageChange={setPage}
            onSearch={setSearch}
            searchPlaceholder="Search coupon sets…"
          />
        )}{" "}
      </div>{" "}
    </div>
  );
}

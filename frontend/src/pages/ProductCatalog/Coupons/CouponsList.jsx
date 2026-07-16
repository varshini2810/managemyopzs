import React, { useState, useEffect } from "react";
import { Plus, Ticket, Edit2, Trash2, Copy, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../services/api";
import DataTable from "../../../components/common/DataTable";
import StatusBadge from "../../../components/common/StatusBadge";
import MonoId from "../../../components/common/MonoId";
import CreateCouponModal from "./CreateCouponModal";
export default function CouponsList() {
  const [coupons, setCoupons] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const fetchCoupons = () => {
    setLoading(true);
    api
      .get(`/coupons?page=${page}&size=20&search=${search}`)
      .then((res) => {
        setCoupons(res.data.data?.content || []);
        setTotalElements(res.data.data?.totalElements || 0);
      })
      .catch(() => toast.error("Failed to load coupons"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchCoupons();
  }, [page, search]);
  const handleDelete = async (id) => {
    if (window.confirm("Delete this coupon?")) {
      try {
        await api.delete(`/coupons/${id}`);
        toast.success("Coupon deleted");
        fetchCoupons();
      } catch {
        toast.error("Failed to delete coupon");
      }
    }
  };
  const handleClone = async (id) => {
    try {
      await api.post(`/coupons/${id}/clone`);
      toast.success("Coupon cloned");
      fetchCoupons();
    } catch {
      toast.error("Failed to clone coupon");
    }
  };
  const fmtDiscount = (row) => {
    if (row.discountType === "percentage")
      return `${row.discountPercentage ?? 0}%`;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(row.discountAmount ?? 0);
  };
  const columns = [
    {
      header: "Coupon Name",
      cell: (row) => (
        <div>
          {" "}
          <div className="text-sm font-medium text-ink">{row.name}</div>{" "}
          <MonoId value={row.id} label="Coupon ID" />{" "}
        </div>
      ),
    },
    {
      header: "Discount",
      cell: (row) => (
        <span className="text-sm font-medium text-ink tabular-nums">
          {fmtDiscount(row)}
        </span>
      ),
    },
    {
      header: "Duration",
      cell: (row) => (
        <span className="text-sm text-muted capitalize">
          {row.duration?.replace("_", " ") || "—"}
        </span>
      ),
    },
    { header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: "",
      align: "right",
      width: 100,
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          {" "}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingCoupon(row);
              setIsModalOpen(true);
            }}
            className="btn-ghost p-2 btn-xs"
            title="Edit"
          >
            {" "}
            <Edit2 size={13} />{" "}
          </button>{" "}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClone(row.id);
            }}
            className="btn-ghost p-2 btn-xs"
            title="Clone"
          >
            {" "}
            <Copy size={13} />{" "}
          </button>{" "}
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
          </button>{" "}
        </div>
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
          <span className="breadcrumb-current">Coupons</span>{" "}
        </div>{" "}
        <button
          className="btn-primary btn-sm"
          onClick={() => {
            setEditingCoupon(null);
            setIsModalOpen(true);
          }}
        >
          {" "}
          <Plus size={13} /> Create Coupon{" "}
        </button>{" "}
      </div>{" "}
      <div className="px-8 py-6 space-y-6">
        {" "}
        <div>
          {" "}
          <h1 className="page-title">Coupons</h1>{" "}
          <p className="page-subtitle">
            Create discounts for your plans and add-ons
          </p>{" "}
        </div>{" "}
        {!loading && coupons.length === 0 && search === "" ? (
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
              <Ticket size={22} style={{ color: "#2D5BFF" }} />{" "}
            </div>{" "}
            <h3 className="text-base font-semibold text-ink mb-1">
              No Coupons Created
            </h3>{" "}
            <p className="text-sm text-muted mb-6 text-center max-w-xs">
              {" "}
              Offer special discounts to attract new customers or reward loyal
              ones.{" "}
            </p>{" "}
            <button
              className="btn-primary"
              onClick={() => {
                setEditingCoupon(null);
                setIsModalOpen(true);
              }}
            >
              {" "}
              <Plus size={14} /> Create Coupon{" "}
            </button>{" "}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={coupons}
            loading={loading}
            totalElements={totalElements}
            page={page}
            size={20}
            onPageChange={setPage}
            onSearch={setSearch}
            searchPlaceholder="Search coupons…"
          />
        )}{" "}
      </div>{" "}
      <CreateCouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchCoupons();
          setIsModalOpen(false);
        }}
        initialData={editingCoupon}
      />{" "}
    </div>
  );
}

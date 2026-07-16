import React, { useState, useEffect } from "react";
import { Plus, Blocks, Edit2, Trash2, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../services/api";
import DataTable from "../../../components/common/DataTable";
import MonoId from "../../../components/common/MonoId";
import CreateFamilyModal from "./CreateFamilyModal";
export default function ProductFamiliesList() {
  const [families, setFamilies] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState(null);
  const fetchFamilies = () => {
    setLoading(true);
    api
      .get(`/product-families?page=${page}&size=20&search=${search}`)
      .then((res) => {
        setFamilies(res.data.data?.content || []);
        setTotalElements(res.data.data?.totalElements || 0);
      })
      .catch(() => toast.error("Failed to load product families"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchFamilies();
  }, [page, search]);
  const handleDelete = async (id) => {
    if (window.confirm("Delete this product family?")) {
      try {
        await api.delete(`/product-families/${id}`);
        toast.success("Product family deleted");
        fetchFamilies();
      } catch {
        toast.error("Failed to delete product family");
      }
    }
  };
  const columns = [
    {
      header: "Name",
      cell: (row) => (
        <div>
          {" "}
          <div className="text-sm font-medium text-ink">{row.name}</div>{" "}
          <MonoId value={row.id} label="Family ID" />{" "}
        </div>
      ),
    },
    {
      header: "Description",
      cell: (row) => (
        <span className="text-sm text-muted truncate max-w-xs block">
          {row.description || "—"}
        </span>
      ),
    },
    {
      header: "Created",
      cell: (row) => (
        <span className="text-sm text-muted tabular-nums">
          {" "}
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—"}{" "}
        </span>
      ),
    },
    {
      header: "",
      align: "right",
      width: 80,
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          {" "}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingFamily(row);
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
          <span className="breadcrumb-current">Product Families</span>{" "}
        </div>{" "}
        <button
          className="btn-primary btn-sm"
          onClick={() => {
            setEditingFamily(null);
            setIsModalOpen(true);
          }}
        >
          {" "}
          <Plus size={13} /> Create Family{" "}
        </button>{" "}
      </div>{" "}
      <div className="px-8 py-6 space-y-6">
        {" "}
        <div>
          {" "}
          <h1 className="page-title">Product Families</h1>{" "}
          <p className="page-subtitle">
            Manage your top-level product categories
          </p>{" "}
        </div>{" "}
        {!loading && families.length === 0 && search === "" ? (
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
              <Blocks size={22} style={{ color: "#2D5BFF" }} />{" "}
            </div>{" "}
            <h3 className="text-base font-semibold text-ink mb-1">
              No Product Families Found
            </h3>{" "}
            <p className="text-sm text-muted mb-6 text-center max-w-xs">
              {" "}
              Product families group related plans and add-ons together.{" "}
            </p>{" "}
            <button
              className="btn-primary"
              onClick={() => {
                setEditingFamily(null);
                setIsModalOpen(true);
              }}
            >
              {" "}
              <Plus size={14} /> Create Product Family{" "}
            </button>{" "}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={families}
            loading={loading}
            totalElements={totalElements}
            page={page}
            size={20}
            onPageChange={setPage}
            onSearch={setSearch}
            searchPlaceholder="Search families…"
          />
        )}{" "}
      </div>{" "}
      <CreateFamilyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchFamilies();
          setIsModalOpen(false);
        }}
        initialData={editingFamily}
      />{" "}
    </div>
  );
}

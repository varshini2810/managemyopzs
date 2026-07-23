import { useAuth } from "../../store/AuthContext";
import React, { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, CheckCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import DataTable from "../../components/common/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import MonoId from "../../components/common/MonoId";
import CreateCreditNoteModal from "./CreateCreditNoteModal";
import AllInvoicesReports from "./AllInvoicesReports";
import InvoiceAnalytics from "./InvoiceAnalytics";
import MarkAsPaidModal from "./MarkAsPaidModal";
import toast from "react-hot-toast";
import useDebounce from "../../hooks/useDebounce";
import FinanceSection from "./FinanceSection";
import PaymentStatementWidget from "./PaymentStatementWidget";
export default function InvoicesList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("invoices");
  const [data, setData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [markingPaid, setMarkingPaid] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const fetchData = () => {
    setLoading(true);
    const endpoint = activeTab === "invoices" ? "/invoices" : "/credit-notes";
    api
      .get(
        `${endpoint}?page=${page}&size=20&search=${debouncedSearch}&status=${status}`,
      )
      .then((res) => {
        setData(res.data.data?.content || []);
        setTotalElements(res.data.data?.totalElements || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchData();
  }, [activeTab, page, debouncedSearch, status]);
  const handleMarkPaid = async (data) => {
    try {
      setMarkingPaid(true);
      await api.put(`/invoices/${selectedInvoiceId}/mark-paid`, data);
      toast.success("Marked as Paid");
      setShowMarkPaidModal(false);
      setSelectedInvoiceId(null);
      fetchData();
    } catch {
      toast.error("Failed to mark as paid");
    } finally {
      setMarkingPaid(false);
    }
  };
  const invoiceColumns = [
    {
      header: "Invoice ID",
      cell: (row) => (
        <div
          className="cursor-pointer hover:text-primary transition-colors"
          onClick={() => navigate(`/invoices/${row.id}`)}
        >
          {" "}
          <MonoId id={row.id} />{" "}
        </div>
      ),
    },
    { header: "Customer ID", cell: (row) => <MonoId id={row.customerId} /> },
    {
      header: "Invoice Date",
      cell: (row) => (
        <span className="text-muted tabular-nums">
          {new Date(row.invoiceDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Amount Due",
      cell: (row) => (
        <span className="font-medium">${row.amountDue.toFixed(2)}</span>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <div className="flex gap-2 items-center">
          {" "}
          <StatusBadge status={row.status} />{" "}
          {row.paymentStatus && <StatusBadge status={row.paymentStatus} />}{" "}
        </div>
      ),
    },
    {
      header: "",
      cell: (row) => (
        <div className="relative group text-right flex justify-end">
          {" "}
          <button className="p-1 hover:bg-gray-100 rounded-button text-muted">
            {" "}
            <MoreVertical size={14} />{" "}
          </button>{" "}
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-sm rounded-card py-1 min-w-[140px] hidden group-hover:block z-10 text-left">
            {" "}
            <button
              className="w-full text-left px-4 py-2 text-sm text-ink hover:bg-gray-50 flex items-center gap-2"
              onClick={() => navigate(`/invoices/${row.id}`)}
            >
              {" "}
              <Eye size={14} /> View Details{" "}
            </button>{" "}
            {!["PAID", "VOIDED"].includes(row.status) && (
              <button
                className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedInvoiceId(row.id);
                  setShowMarkPaidModal(true);
                }}
              >
                {" "}
                <CheckCircle size={14} /> Mark as Paid{" "}
              </button>
            )}{" "}
          </div>{" "}
        </div>
      ),
    },
  ];
  const creditNoteColumns = [
    { header: "Credit Note ID", cell: (row) => <MonoId id={row.id} /> },
    { header: "Customer ID", cell: (row) => <MonoId id={row.customerId} /> },
    { header: "Type", cell: (row) => row.type },
    {
      header: "Total",
      cell: (row) => (
        <span className="font-medium">${row.total.toFixed(2)}</span>
      ),
    },
    {
      header: "Available",
      cell: (row) => (
        <span className="text-green-600">
          ${row.availableAmount.toFixed(2)}
        </span>
      ),
    },
    { header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
  ];
  return (
    <div>
      {" "}
      <div className="module-header border-b border-gray-200">
        {" "}
        <div>
          {" "}
          <h1 className="page-title">Invoices & Credit Notes</h1>{" "}
          <p className="page-subtitle">
            Manage billing documents and adjustments
          </p>{" "}
        </div>{" "}
        <div>
          {" "}
          {activeTab === "invoices" && (
            <button
              className="btn-primary btn-sm"
              onClick={() => navigate("/invoices/new")}
            >
              {" "}
              <Plus size={14} /> Create Invoice{" "}
            </button>
          )}{" "}
          {activeTab === "credit-notes" && (
            <button
              className="btn-primary btn-sm"
              onClick={() => setIsCreditModalOpen(true)}
            >
              {" "}
              <Plus size={14} /> Create Credit Note{" "}
            </button>
          )}{" "}
        </div>{" "}
      </div>{" "}
      <div className="px-8 py-6">
        {" "}
        <div className="bg-surface rounded-card border border-gray-200">
          {" "}
          <div className="flex border-b border-gray-200">
            {" "}
            <button
              className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "invoices" ? "border-b-2 border-primary text-ink" : "text-muted hover:text-ink"}`}
              onClick={() => {
                setActiveTab("invoices");
                setPage(0);
                setSearch("");
                setStatus("");
              }}
            >
              {" "}
              Invoices{" "}
            </button>{" "}
            <button
              className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "credit-notes" ? "border-b-2 border-primary text-ink" : "text-muted hover:text-ink"}`}
              onClick={() => {
                setActiveTab("credit-notes");
                setPage(0);
                setSearch("");
                setStatus("");
              }}
            >
              {" "}
              Credit Notes{" "}
            </button>{" "}
            <button
              className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "finance" ? "border-b-2 border-primary text-ink font-semibold" : "text-muted hover:text-ink"}`}
              onClick={() => {
                setActiveTab("finance");
              }}
            >
              {" "}
              Finance{" "}
            </button>{" "}
            <button
              className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "reports" ? "border-b-2 border-primary text-ink" : "text-muted hover:text-ink"}`}
              onClick={() => {
                setActiveTab("reports");
              }}
            >
              {" "}
              All Invoices & Reports{" "}
            </button>{" "}
            <button
              className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "analytics" ? "border-b-2 border-primary text-ink" : "text-muted hover:text-ink"}`}
              onClick={() => {
                setActiveTab("analytics");
              }}
            >
              {" "}
              Analytics{" "}
            </button>{" "}
            <button
              className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "payment-statement" ? "border-b-2 border-primary text-ink" : "text-muted hover:text-ink"}`}
              onClick={() => {
                setActiveTab("payment-statement");
              }}
            >
              {" "}
              Payment &amp; Statement{" "}
            </button>{" "}
          </div>{" "}
          {(activeTab === "invoices" || activeTab === "credit-notes") && (
            <>
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
                    placeholder={`Search by ${activeTab === "invoices" ? "Invoice" : "Credit Note"} ID...`}
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(0);
                    }}
                  />{" "}
                </div>{" "}
                {activeTab === "invoices" && (
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
                    <option value="DRAFT">Draft</option>{" "}
                    <option value="POSTED">Posted</option>{" "}
                    <option value="PAYMENT_DUE">Payment Due</option>{" "}
                    <option value="PAID">Paid</option>{" "}
                    <option value="VOIDED">Voided</option>{" "}
                  </select>
                )}{" "}
                {activeTab === "credit-notes" && (
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
                    <option value="DRAFT">Draft</option>{" "}
                    <option value="OPEN">Open</option>{" "}
                    <option value="CONSUMED">Consumed</option>{" "}
                    <option value="VOIDED">Voided</option>{" "}
                  </select>
                )}{" "}
              </div>{" "}
              <DataTable
                columns={
                  activeTab === "invoices" ? invoiceColumns : creditNoteColumns
                }
                data={data}
                loading={loading}
                totalElements={totalElements}
                page={page}
                size={20}
                onPageChange={setPage}
                onRowClick={(row) => {
                  if (activeTab === "invoices") navigate(`/invoices/${row.id}`);
                }}
              />{" "}
            </>
          )}{" "}
          {activeTab === "finance" && (
            <div className="p-0 border-t-0">
              {" "}
              <FinanceSection />{" "}
            </div>
          )}{" "}
          {activeTab === "reports" && (
            <div className="p-0 border-t-0">
              {" "}
              <AllInvoicesReports />{" "}
            </div>
          )}{" "}
          {activeTab === "analytics" && (
            <div className="p-0 border-t-0">
              {" "}
              <InvoiceAnalytics />{" "}
            </div>
          )}{" "}
          {activeTab === "payment-statement" && (
            <div className="p-6">
              {" "}
              <PaymentStatementWidget fullPage />{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
      <CreateCreditNoteModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        onSuccess={() => {
          setIsCreditModalOpen(false);
          fetchData();
        }}
      />{" "}
      <MarkAsPaidModal
        isOpen={showMarkPaidModal}
        onClose={() => {
          setShowMarkPaidModal(false);
          setSelectedInvoiceId(null);
        }}
        onConfirm={handleMarkPaid}
        loading={markingPaid}
      />{" "}
    </div>
  );
}

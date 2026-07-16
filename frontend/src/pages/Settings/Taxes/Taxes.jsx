import React, { useState, useEffect } from "react";
import {
  Plus,
  Receipt,
  Settings as SettingsIcon,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import api from "../../../services/api";
import DataTable from "../../../components/common/DataTable";
import Toggle from "../../../components/common/Toggle";
export default function Taxes() {
  const [config, setConfig] = useState(null);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const collectTaxId = watch("collectTaxId");
  const fetchData = async () => {
    setLoading(true);
    try {
      const [configRes, regionsRes] = await Promise.all([
        api.get("/settings/tax-config"),
        api.get("/settings/tax-regions"),
      ]);
      setConfig(configRes.data.data);
      reset(configRes.data.data);
      setRegions(regionsRes.data.data || []);
    } catch (err) {
      toast.error("Failed to load tax settings");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const saveConfig = async (data) => {
    try {
      await api.put("/settings/tax-config", data);
      toast.success("Tax configuration updated");
    } catch (err) {
      toast.error("Failed to update tax configuration");
    }
  };
  const handleDeleteRegion = async (id) => {
    try {
      await api.delete(`/settings/tax-regions/${id}`);
      toast.success("Tax region deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete tax region");
    }
  };
  const columns = [
    {
      header: "Country",
      cell: (row) => (
        <span className="font-medium text-ink uppercase">{row.country}</span>
      ),
    },
    {
      header: "State/Province",
      cell: (row) => (
        <span className="text-sm text-muted">{row.state || "All States"}</span>
      ),
    },
    { header: "Tax Name", accessor: "taxName" },
    {
      header: "Tax Rate",
      align: "right",
      cell: (row) => (
        <span className="tabular-nums font-medium text-ink">
          {row.taxRate}%
        </span>
      ),
    },
    {
      header: "",
      align: "right",
      width: 60,
      cell: (row) => (
        <button
          onClick={() => handleDeleteRegion(row.id)}
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
          <span>Settings</span>{" "}
          <ChevronRight size={12} className="breadcrumb-sep" />{" "}
          <span className="breadcrumb-current">Taxes</span>{" "}
        </div>{" "}
      </div>{" "}
      <div className="px-8 py-8 flex max-w-4xl mx-auto">
        {" "}
        <div className="flex-1 min-w-0 space-y-8">
          {" "}
          <div>
            {" "}
            <h1 className="page-title">Taxes</h1>{" "}
            <p className="page-subtitle">
              Configure global tax rules and regional tax rates
            </p>{" "}
          </div>{" "}
          {loading ? (
            <div className="space-y-4">
              {" "}
              <div
                className="skeleton h-32 rounded-lg"
                style={{ background: "#E7E5E2" }}
              />{" "}
              <div
                className="skeleton h-64 rounded-lg"
                style={{ background: "#E7E5E2" }}
              />{" "}
            </div>
          ) : (
            <>
              {" "}
              {/* Global Config */}{" "}
              <div className="card">
                {" "}
                <div className="section-label">Global Settings</div>{" "}
                <form onChange={handleSubmit(saveConfig)} className="space-y-0">
                  {" "}
                  {/* Setting Row 1 */}{" "}
                  <div className="flex justify-between items-center py-4 border-b border-border">
                    {" "}
                    <div>
                      {" "}
                      <div className="text-sm font-medium text-ink">
                        Price Type
                      </div>{" "}
                      <div className="text-xs text-muted mt-0.5">
                        Determine if your catalog prices include or exclude tax
                      </div>{" "}
                    </div>{" "}
                    <select className="select w-64" {...register("priceType")}>
                      {" "}
                      <option value="exclusive">
                        Exclusive (Add tax on checkout)
                      </option>{" "}
                      <option value="inclusive">
                        Inclusive (Prices include tax)
                      </option>{" "}
                    </select>{" "}
                  </div>{" "}
                  {/* Setting Row 2 */}{" "}
                  <div className="flex justify-between items-center py-4">
                    {" "}
                    <div>
                      {" "}
                      <div className="text-sm font-medium text-ink">
                        Collect Tax ID
                      </div>{" "}
                      <div className="text-xs text-muted mt-0.5">
                        Ask business customers for VAT/Tax ID during checkout
                      </div>{" "}
                    </div>{" "}
                    <Toggle
                      checked={collectTaxId}
                      onChange={(val) => {
                        setValue("collectTaxId", val);
                        handleSubmit(saveConfig)();
                      }}
                    />{" "}
                  </div>{" "}
                </form>{" "}
              </div>{" "}
              {/* Tax Regions */}{" "}
              <div>
                {" "}
                <div className="flex items-center justify-between mb-4">
                  {" "}
                  <div className="section-label mb-0">Tax Regions</div>{" "}
                  <button className="btn-secondary btn-sm">
                    {" "}
                    <Plus size={13} /> Add Region{" "}
                  </button>{" "}
                </div>{" "}
                {regions.length === 0 ? (
                  <div
                    className="bg-surface rounded-lg flex flex-col items-center justify-center py-16"
                    style={{ border: "1px solid #E7E5E2" }}
                  >
                    {" "}
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ background: "#EEF2FF" }}
                    >
                      {" "}
                      <Receipt size={22} style={{ color: "#2D5BFF" }} />{" "}
                    </div>{" "}
                    <h3 className="text-base font-semibold text-ink mb-1">
                      No Tax Regions Defined
                    </h3>{" "}
                    <p className="text-sm text-muted mb-6 text-center max-w-xs">
                      {" "}
                      Add tax rates for specific countries or states where you
                      are required to collect tax.{" "}
                    </p>{" "}
                    <button className="btn-primary">
                      {" "}
                      <Plus size={14} /> Add Region{" "}
                    </button>{" "}
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={regions}
                    loading={loading}
                    totalElements={regions.length}
                    page={0}
                    size={100}
                  />
                )}{" "}
              </div>{" "}
            </>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

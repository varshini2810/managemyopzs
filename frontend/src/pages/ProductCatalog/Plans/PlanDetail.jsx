import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Plus, DollarSign, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../services/api";
import StatusBadge from "../../../components/common/StatusBadge";
import MonoId from "../../../components/common/MonoId";
import PricePointModal from "./PricePointModal";
const TABS = ["Overview", "Price Points", "Events"];
export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [pricePoints, setPricePoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const fetchPlanData = async () => {
    try {
      setLoading(true);
      const [planRes, ppRes] = await Promise.all([
        api.get(`/plans/${id}`),
        api.get(`/plans/${id}/price-points`),
      ]);
      setPlan(planRes.data.data);
      setPricePoints(ppRes.data.data || []);
    } catch {
      toast.error("Failed to load plan");
      navigate("/catalog/plans");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPlanData();
  }, [id]);
  if (loading || !plan) {
    return (
      <div className="px-8 py-8 space-y-6 animate-pulse">
        {" "}
        <div
          className="h-5 w-48 rounded-card skeleton"
          style={{ background: "#E7E5E2" }}
        />{" "}
        <div
          className="h-8 w-64 rounded-card skeleton"
          style={{ background: "#E7E5E2" }}
        />{" "}
        <div className="flex gap-6 mt-8">
          {" "}
          <div className="flex-1 space-y-4">
            {" "}
            {[80, 60, 90, 70].map((w, i) => (
              <div
                key={i}
                className="h-4 rounded-card skeleton"
                style={{ width: `${w}%`, background: "#E7E5E2" }}
              />
            ))}{" "}
          </div>{" "}
          <div className="w-72 space-y-3">
            {" "}
            {[100, 80, 90].map((w, i) => (
              <div
                key={i}
                className="h-4 rounded-card skeleton"
                style={{ width: `${w}%`, background: "#E7E5E2" }}
              />
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </div>
    );
  }
  const fmt = (v, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
      v || 0,
    );
  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—"; // Mock audit events const events = [ { id: 'e1', ts: plan.createdAt, actor: 'Sanjay Dev', action: 'Plan created', detail: 'Initial configuration' }, ]; return ( <div> {/* Module sub-header */} <div className="module-header"> <div className="breadcrumb"> <button onClick={() => navigate('/catalog/plans')} className="breadcrumb hover:text-ink transition-colors flex items-center gap-1"> Plans </button> <ChevronRight size={12} className="breadcrumb-sep" /> <span className="breadcrumb-current truncate max-w-xs">{plan.name}</span> </div> <div className="flex items-center gap-2"> <button className="btn-secondary btn-sm">Edit</button> <button className="btn-danger btn-sm">Archive</button> </div> </div> <div className="px-8 py-6"> {/* Page title row */} <div className="flex items-center gap-3 mb-6"> <h1 className="page-title">{plan.name}</h1> <StatusBadge status={plan.active ? 'ACTIVE' : 'INACTIVE'} /> </div> {/* 70/30 two-column layout */} <div className="flex gap-8 items-start"> {/* Left 70% — tabs + main content */} <div className="flex-1 min-w-0"> {/* Tab nav */} <div style={{ borderBottom: '1px solid #E7E5E2' }} className="flex gap-0 mb-6"> {TABS.map(tab => ( <button key={tab} onClick={() => setActiveTab(tab)} className="relative px-4 py-2.5 text-sm font-medium transition-colors" style={{ color: activeTab === tab ? '#1C1B1A' : '#6B6863', borderBottom: activeTab === tab ? '2px solid #2D5BFF' : '2px solid transparent', marginBottom: -1, }} > {tab} {tab === 'Price Points' && pricePoints.length > 0 && ( <span className="ml-1.5 inline-flex items-center justify-center rounded-full text-2xs font-medium tabular-nums" style={{ background: '#EEF2FF', color: '#2D5BFF', width: 18, height: 18, fontSize: 10 }} > {pricePoints.length} </span> )} </button> ))} </div> {/* ── Overview tab ── */} {activeTab === 'Overview' && ( <div className="space-y-6"> <div className="card-sm"> <div className="section-label">Plan Details</div> <dl className="grid grid-cols-2 gap-x-6 gap-y-4"> {[ ['Internal Name', plan.name], ['Description', plan.description || '—'], ['Billing Period', `${plan.billingPeriod} ${plan.billingPeriodUnit?.toLowerCase()}`], ['Trial Period', plan.trialPeriod > 0 ? `${plan.trialPeriod} ${plan.trialPeriodUnit?.toLowerCase()}` : 'No trial'], ['Self-Serve', plan.displaySelfServe ? 'Visible' : 'Hidden'], ['Checkout', plan.displayCheckout ? 'Visible' : 'Hidden'], ].map(([k, v]) => ( <div key={k}> <dt className="text-xs text-muted font-medium mb-0.5">{k}</dt> <dd className="text-sm text-ink">{v}</dd> </div> ))} </dl> </div> </div> )} {/* ── Price Points tab ── */} {activeTab === 'Price Points' && ( <div> <div className="flex items-center justify-between mb-4"> <span className="text-sm font-medium text-ink"> {pricePoints.length} price point{pricePoints.length !== 1 ? 's' : ''} </span> <button className="btn-primary btn-sm" onClick={() => setIsPriceModalOpen(true)}> <Plus size={13} /> Add Price Point </button> </div> {pricePoints.length === 0 ? ( <div className="rounded-button flex flex-col items-center py-14 text-center" style={{ border: '1px solid #E7E5E2', background: '#FAFAF9' }} > <DollarSign size={28} style={{ color: '#A8A49F' }} /> <h4 className="text-sm font-semibold text-ink mt-3 mb-1">No price points</h4> <p className="text-xs text-muted mb-4 max-w-xs"> Add monthly, annual, or custom billing cycles for this plan. </p> <button className="btn-primary btn-sm" onClick={() => setIsPriceModalOpen(true)}> <Plus size={13} /> Add first price point </button> </div> ) : ( <div className="space-y-2"> {pricePoints.map(pp => ( <div key={pp.id} className="flex items-center justify-between px-5 py-4 rounded-button" style={{ border: '1px solid #E7E5E2', background: '#FFFFFF' }} > <div> <div className="text-sm font-medium text-ink">{pp.name}</div> <MonoId value={pp.id} label="Price Point ID" /> </div> <div className="text-right"> <div className="font-display font-semibold tabular-nums" style={{ fontSize: 20, color: '#1C1B1A', letterSpacing: '-0.02em' }} > {fmt(pp.price)} </div> <div className="text-xs text-muted">{pp.pricingScheme}</div> </div> </div> ))} </div> )} </div> )} {/* ── Events tab (audit timeline) ── */} {activeTab === 'Events' && ( <div className="relative"> <div className="absolute left-3.5 top-5 bottom-0 w-px" style={{ background: '#E7E5E2' }} /> <div className="space-y-6"> {events.map(ev => ( <div key={ev.id} className="flex items-start gap-4"> <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center z-10" style={{ background: '#FFFFFF', border: '1px solid #E7E5E2' }} > <div className="w-2 h-2 rounded-full" style={{ background: '#2D5BFF' }} /> </div> <div> <div className="text-sm text-ink font-medium">{ev.action}</div> <div className="text-xs text-muted mt-0.5">{ev.detail}</div> <div className="text-2xs mt-1 font-mono" style={{ color: '#A8A49F' }} > {ev.ts ? new Date(ev.ts).toLocaleString() : '—'} · {ev.actor} </div> </div> </div> ))} </div> </div> )} </div> {/* Right 30% — sticky metadata panel */} <div className="w-72 shrink-0"> <div className="sticky top-20 space-y-3"> <div className="card-sm"> <div className="section-label">Metadata</div> <div className="space-y-3 text-sm"> {[ ['Status', <StatusBadge key="s" status={plan.active ? 'ACTIVE' : 'INACTIVE'} />], ['Plan ID', <MonoId key="id" value={plan.id} label="Plan ID" />], ['Created', fmtDate(plan.createdAt)], ['Last Updated', fmtDate(plan.updatedAt)], ['Price Points', <span key="pp" className="tabular-nums">{pricePoints.length}</span>], ].map(([k, v]) => ( <div key={k} className="flex justify-between items-center"> <span className="text-muted text-xs">{k}</span> <span className="text-ink text-xs font-medium">{v}</span> </div> ))} </div> </div> {/* Quick actions */} <div className="card-sm"> <div className="section-label">Quick Actions</div> <div className="space-y-1"> <button className="w-full text-left text-sm text-primary hover:text-primary-hover px-2 py-1.5 rounded-button hover:bg-primary-light transition-colors"> Copy plan ID </button> <button className="w-full text-left text-sm text-muted hover:text-ink px-2 py-1.5 rounded-button hover:bg-bg-main transition-colors"> Duplicate plan </button> <button className="w-full text-left text-sm text-danger hover:text-red-700 px-2 py-1.5 rounded-button hover:bg-danger-light transition-colors"> Archive plan </button> </div> </div> </div> </div> </div> </div> <PricePointModal isOpen={isPriceModalOpen} onClose={() => setIsPriceModalOpen(false)} planId={id} onSuccess={fetchPlanData} /> </div> );
}

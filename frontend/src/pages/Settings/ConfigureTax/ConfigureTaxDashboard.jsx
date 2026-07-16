import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Globe,
  Trash2,
  ExternalLink,
  Tag,
  FileText,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../services/api";
import Toggle from "../../../components/common/Toggle";
import AddRegionModal from "./AddRegionModal";
import ReviewCatalogPriceTypes from "./ReviewCatalogPriceTypes";
const TOGGLE_KEY = "tax_collect_reg_number";
function loadToggle() {
  try {
    return localStorage.getItem(TOGGLE_KEY) === "true";
  } catch {
    return false;
  }
}
function saveToggle(val) {
  try {
    localStorage.setItem(TOGGLE_KEY, String(val));
  } catch {}
}
const STORAGE_REGIONS_KEY = "tax_configured_regions";
function loadLocalRegions() {
  try {
    const stored = localStorage.getItem(STORAGE_REGIONS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}
function saveLocalRegions(regions) {
  try {
    localStorage.setItem(STORAGE_REGIONS_KEY, JSON.stringify(regions));
  } catch {}
}
export default function ConfigureTaxDashboard({ onBack }) {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [collectToggle, setCollectToggle] = useState(loadToggle);
  const [showPriceTypes, setShowPriceTypes] = useState(false); // Try fetching from API; fall back to localStorage const fetchRegions = useCallback(async () => { setLoading(true); try { const res = await api.get('/settings/tax-regions'); const apiRegions = res.data.data || []; setRegions(apiRegions); // Sync to localStorage as backup saveLocalRegions(apiRegions); } catch { // API unavailable – use localStorage setRegions(loadLocalRegions()); } finally { setLoading(false); } }, []); useEffect(() => { fetchRegions(); }, [fetchRegions]); const handleAddRegion = async (country) => { // Optimistic local add const newRegion = { id: `tax-${country.code.toLowerCase()}-${Date.now()}`, country: country.name, countryCode: country.code, flag: country.flag, taxName: country.code === 'EU' ? 'EU VAT' : 'Standard Tax', taxRate: '0.00', }; try { // Try real API await api.post('/settings/tax-regions', { country: country.code, taxName: newRegion.taxName, taxRate: 0, }); toast.success(`${country.name} added as a tax region`); fetchRegions(); } catch { // Fall back to localStorage persistence const updated = [ ...loadLocalRegions().filter(r => r.countryCode !== country.code), newRegion, ]; saveLocalRegions(updated); setRegions(updated); toast.success(`${country.name} added as a tax region`); } }; const handleDeleteRegion = async (region) => { try { await api.delete(`/settings/tax-regions/${region.id}`); toast.success('Region removed'); fetchRegions(); } catch { // Remove locally const updated = loadLocalRegions().filter(r => r.id !== region.id); saveLocalRegions(updated); setRegions(updated); toast.success('Region removed'); } }; const handleToggleChange = (val) => { setCollectToggle(val); saveToggle(val); toast.success(`Collect Tax Registration Number ${val ? 'enabled' : 'disabled'}`); }; if (showPriceTypes) { return <ReviewCatalogPriceTypes onBack={() => setShowPriceTypes(false)} />; } const existingCodes = regions.map(r => r.countryCode || r.country); return ( <div> {/* Breadcrumb Header */} <div className="module-header"> <div className="breadcrumb"> <span>Settings</span> <ChevronRight size={12} className="breadcrumb-sep" /> <span>Configure Opz</span> <ChevronRight size={12} className="breadcrumb-sep" /> <button onClick={onBack} className="hover:text-ink transition-colors"> Configure Tax </button> <ChevronRight size={12} className="breadcrumb-sep" /> <span className="breadcrumb-current">Tax Dashboard</span> </div> <button id="tax-dashboard-back-btn" onClick={onBack} className="btn-ghost btn-sm flex items-center gap-1.5" > <ChevronLeft size={14} /> Back </button> </div> {/* Body */} <div className="px-8 py-8 flex gap-8 max-w-6xl mx-auto"> {/* ── Left: Regions ── */} <div className="flex-1 min-w-0"> {/* Page title */} <div className="mb-6"> <h1 className="page-title">Configure Tax</h1> <p className="page-subtitle mt-1"> Manage tax regions, price types, and compliance settings for your billing. </p> </div> {/* Regions section */} <div className="card p-0 overflow-hidden"> {/* Section header */} <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-stone-50"> <div> <div className="flex items-center gap-2"> <Globe size={15} style={{ color: '#6B6863' }} /> <h2 className="text-sm font-semibold text-ink"> Regions{' '} <span className="ml-1 px-1.5 py-0.5 rounded bg-stone-200 text-muted text-xs font-medium"> {loading ? '…' : regions.length} </span> </h2> </div> <p className="text-xs text-muted mt-0.5 ml-5"> Select regions where you collect tax for your sales. </p> </div> <button id="add-region-btn" onClick={() => setAddModalOpen(true)} className="btn-secondary btn-sm flex items-center gap-1.5" > <Plus size={13} /> Add Region </button> </div> {/* Region list or empty */} {loading ? ( <div className="space-y-0"> {[1, 2, 3].map(i => ( <div key={i} className="px-5 py-4 border-b border-border last:border-0"> <div className="skeleton h-4 rounded w-48" style={{ background: '#E7E5E2' }} /> </div> ))} </div> ) : regions.length === 0 ? ( <div className="flex flex-col items-center justify-center py-16 px-6"> <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: '#EEF2FF' }} > <Globe size={22} style={{ color: '#2D5BFF' }} /> </div> <h3 className="text-sm font-semibold text-ink mb-1">No Regions Configured</h3> <p className="text-xs text-muted mb-5 text-center max-w-xs"> Add regions where you collect tax. Each region represents a country or territory. </p> <button id="add-first-region-btn" onClick={() => setAddModalOpen(true)} className="btn-primary btn-sm" > <Plus size={13} /> Add Region </button> </div> ) : ( <div> {/* Column headers */} <div className="grid grid-cols-12 px-5 py-2.5 border-b border-border bg-stone-50 text-2xs font-semibold text-muted uppercase tracking-wide"> <span className="col-span-5">Region</span> <span className="col-span-3">Tax Name</span> <span className="col-span-3 text-right">Tax Rate</span> <span className="col-span-1" /> </div> {regions.map((region, idx) => ( <div key={region.id || idx} className={`grid grid-cols-12 items-center px-5 py-3.5 hover:bg-stone-50 transition-colors ${idx !== regions.length - 1 ? 'border-b border-border' : ''} `} > <div className="col-span-5 flex items-center gap-2.5"> <span className="text-lg leading-none">{region.flag || '🌍'}</span> <span className="text-sm font-medium text-ink"> {region.country} {region.state && ( <span className="text-muted font-normal ml-1 text-xs">({region.state})</span> )} </span> </div> <div className="col-span-3 text-sm text-muted">{region.taxName || '—'}</div> <div className="col-span-3 text-right text-sm font-medium text-ink tabular-nums"> {region.taxRate != null ? `${region.taxRate}%` : '—'} </div> <div className="col-span-1 flex justify-end"> <button id={`delete-region-${region.id}`} onClick={() => handleDeleteRegion(region)} className="btn-ghost p-1.5 btn-xs hover:text-red-600" title="Remove region" > <Trash2 size={13} /> </button> </div> </div> ))} </div> )} </div> </div> {/* ── Right: Settings Sidebar ── */} <div className="w-72 shrink-0 space-y-4"> {/* A: Catalog Price Types */} <div className="card space-y-3"> <div className="flex items-center gap-2"> <Tag size={14} style={{ color: '#6B6863' }} /> <div className="section-label mb-0">Catalog Price Types</div> </div> <p className="text-xs text-muted leading-relaxed"> All of your currencies are{' '} <span className="font-medium text-ink">Tax Exclusive</span>. </p> <button id="manage-price-types-link" onClick={() => setShowPriceTypes(true)} className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover transition-colors" > Manage Catalog Price Types <ExternalLink size={11} /> </button> </div> {/* B: Tax Profiles */} <div className="card space-y-3"> <div className="flex items-center gap-2"> <FileText size={14} style={{ color: '#6B6863' }} /> <div className="section-label mb-0">Tax Profiles</div> </div> <p className="text-xs text-muted leading-relaxed"> Tax profiles can be used if you are selling multiple products/services and their tax rates differ. </p> <button id="configure-tax-profiles-link" className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover transition-colors" > Configure Tax Profiles <ExternalLink size={11} /> </button> </div> {/* C: Collect Tax Registration Number */} <div className="card space-y-3"> <div className="flex items-center gap-2"> <Users size={14} style={{ color: '#6B6863' }} /> <div className="section-label mb-0">Collect Tax Registration Number</div> </div> <div className="flex items-start gap-3"> <Toggle checked={collectToggle} onChange={handleToggleChange} /> <p className="text-xs text-muted leading-relaxed flex-1"> Collect Tax Registration Number from customers for countries not configured for tax </p> </div> </div> </div> </div> {/* Add Region Modal */} <AddRegionModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddRegion} existingCodes={existingCodes} /> </div> );
}

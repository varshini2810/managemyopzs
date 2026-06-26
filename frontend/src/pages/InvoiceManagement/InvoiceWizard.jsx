import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, FileText, CheckCircle, Plus, Trash2, Save, Eye, Check, Calendar, User, DollarSign, Download, Printer, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateInvoicePdf } from '../../utils/generateInvoicePdf';

// Dummy list of products for dropdown
const PRODUCT_LIST = [
  { id: 'prod_1', name: 'Premium Support Plan', price: 150.00, tax: 18, hsnCode: '998314' },
  { id: 'prod_2', name: 'Software License (Annual)', price: 1200.00, tax: 18, hsnCode: '851762' },
  { id: 'prod_3', name: 'Consulting Hours', price: 90.00, tax: 10, hsnCode: '998314' },
  { id: 'prod_4', name: 'Server Migration', price: 500.00, tax: 18, hsnCode: '847130' },
  { id: 'prod_5', name: 'Custom Integration', price: 750.00, tax: 18, hsnCode: '998314' },
];

export default function InvoiceWizard({ open, initial, onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState('');

  // ─── STEP 1: CLIENT INFO ──────────────────────────────────────────────────
  const [clientInfo, setClientInfo] = useState({
    name: '', companyName: '', email: '', phone: '',
    billingLine1: '', billingCity: '', billingState: '', billingZip: '',
    shippingLine1: '', shippingCity: '', shippingState: '', shippingZip: '',
    vatNumber: '', paymentTerms: 'Net 30', salesRep: ''
  });

  // ─── STEP 2: INVOICE INFO ─────────────────────────────────────────────────
  const [invoiceInfo, setInvoiceInfo] = useState({
    id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '', currency: 'USD', status: 'draft',
    referenceNo: '', poNumber: '', taxConfig: 'Exclusive',
    discount: 0, billingCycle: 'One-time', paymentMethod: 'Credit Card'
  });

  // ─── STEP 3: LINE ITEMS ───────────────────────────────────────────────────
  const [lineItems, setLineItems] = useState([
    { id: 1, name: '', description: '', hsnCode: '', quantity: 1, price: 0, tax: 18, discount: 0, amount: 0 }
  ]);

  // ─── STEP 4: NOTES & TERMS ────────────────────────────────────────────────
  const [notes, setNotes] = useState({
    customerNotes: 'Thank you for your business.',
    terms: 'Payment is due within the specified terms.',
    internalNotes: ''
  });

  // Keep state when opening/closing
  useEffect(() => {
    if (open) {
      setStep(1); setErrors({}); setShowPreview(false);
      if (initial) {
        setClientInfo({
          name: initial.client || '', companyName: initial.company || '', email: initial.email || '', phone: initial.phone || '',
          billingLine1: initial.billingAddr || '', billingCity: '', billingState: '', billingZip: '',
          shippingLine1: initial.shippingAddr || '', shippingCity: '', shippingState: '', shippingZip: '',
          vatNumber: initial.gst || '', paymentTerms: initial.paymentTerms || 'Net 30', salesRep: initial.salesRep || ''
        });
        setInvoiceInfo({
          id: initial.id || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          issueDate: initial.issueDate || new Date().toISOString().split('T')[0],
          dueDate: initial.dueDate || '', currency: initial.currency || 'USD', status: initial.status || 'draft',
          referenceNo: initial.refNum || '', poNumber: initial.poNum || '', taxConfig: 'Exclusive',
          discount: initial.disc || 0, billingCycle: 'One-time', paymentMethod: initial.payMethod || 'Credit Card'
        });
        if (initial.items && initial.items.length > 0) {
          setLineItems(initial.items.map((it, idx) => ({
            id: idx + 1, name: it.desc || '', description: it.desc || '',
            quantity: it.qty || 1, price: it.price || 0, tax: it.tax || 0, discount: it.disc || 0, amount: it.amount || 0
          })));
        }
        setNotes({
          customerNotes: initial.notes || 'Thank you for your business.',
          terms: initial.terms || 'Payment is due within the specified terms.',
          internalNotes: initial.internalNotes || ''
        });
      } else {
        // Reset defaults
        setClientInfo({
          name: '', companyName: '', email: '', phone: '',
          billingLine1: '', billingCity: '', billingState: '', billingZip: '',
          shippingLine1: '', shippingCity: '', shippingState: '', shippingZip: '',
          vatNumber: '', paymentTerms: 'Net 30', salesRep: ''
        });
        setLineItems([{ id: 1, name: '', description: '', quantity: 1, price: 0, tax: 18, discount: 0, amount: 0 }]);
        const d = new Date();
        d.setDate(d.getDate() + 30);
        setInvoiceInfo({
          id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: d.toISOString().split('T')[0], currency: 'USD', status: 'draft',
          referenceNo: '', poNumber: '', taxConfig: 'Exclusive',
          discount: 0, billingCycle: 'One-time', paymentMethod: 'Credit Card'
        });
        setNotes({
          customerNotes: 'Thank you for your business.',
          terms: 'Payment is due within the specified terms.',
          internalNotes: ''
        });
      }
    }
  }, [open, initial]);

  // Close preview modal on unmount to release blob URL
  useEffect(() => {
    return () => { if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl); };
  }, [pdfBlobUrl]);

  if (!open) return null;

  // ─── VALIDATION ───────────────────────────────────────────────────────────
  const validateStep1 = () => {
    const err = {};
    if (!clientInfo.name.trim()) err.name = 'Client Name is required';
    if (clientInfo.email && !/^\S+@\S+\.\S+$/.test(clientInfo.email)) err.email = 'Valid email is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep2 = () => {
    const err = {};
    if (!invoiceInfo.id.trim()) err.id = 'Invoice Number is required';
    if (!invoiceInfo.issueDate) err.issueDate = 'Invoice Date is required';
    if (!invoiceInfo.dueDate) err.dueDate = 'Due Date is required';
    if (invoiceInfo.issueDate && invoiceInfo.dueDate && invoiceInfo.dueDate < invoiceInfo.issueDate) {
      err.dueDate = 'Due Date cannot be earlier than Invoice Date';
    }
    if (!invoiceInfo.currency) err.currency = 'Currency is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep3 = () => {
    const err = {};
    if (lineItems.length === 0) err.items = 'Must contain at least one line item';
    
    const itemErrs = [];
    let hasError = false;
    lineItems.forEach((item, i) => {
      const e = {};
      if (!item.name && !item.description) e.name = 'Product/Description required';
      if (item.hsnCode && item.hsnCode.length > 8) e.hsnCode = 'Max 8 digits';
      if (item.quantity <= 0) e.quantity = 'Quantity > 0 required';
      if (item.price < 0) e.price = 'Price cannot be negative';
      itemErrs[i] = e;
      if (Object.keys(e).length > 0) hasError = true;
    });

    if (hasError) err.lineItems = itemErrs;
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  // ─── AUTO-CALCULATION ─────────────────────────────────────────────────────
  const calcTotals = () => {
    let subtotal = 0;
    let taxTotal = 0;
    let discountTotal = 0;
    
    const items = lineItems.map(item => {
      const qty = parseFloat(item.quantity) || 0;
      const prc = parseFloat(item.price) || 0;
      const tRate = parseFloat(item.tax) || 0;
      const dAmt = parseFloat(item.discount) || 0;
      
      const lineGross = qty * prc;
      const lineDisc = dAmt;
      const lineNet = lineGross - lineDisc;
      const lineTax = invoiceInfo.taxConfig === 'Exclusive' ? lineNet * (tRate / 100) : 0;
      const amt = lineNet + lineTax;
      
      subtotal += lineNet;
      taxTotal += lineTax;
      discountTotal += lineDisc;
      
      return { ...item, amount: amt };
    });

    // Invoice level discount
    const invDisc = parseFloat(invoiceInfo.discount) || 0;
    const finalSub = subtotal - invDisc;
    const finalTax = invoiceInfo.taxConfig === 'Exclusive' ? taxTotal : (finalSub * 0.18); // Default 18% if inclusive/overall
    const grandTotal = finalSub + finalTax;

    return { items, subtotal: finalSub, taxTotal: finalTax, discountTotal: discountTotal + invDisc, grandTotal };
  };

  // ─── ACTIONS ──────────────────────────────────────────────────────────────
  const buildInvoicePayload = () => {
    const totals = calcTotals();
    return {
      ...invoiceInfo,
      id: invoiceInfo.id,
      client: clientInfo.name,
      company: clientInfo.company,
      email: clientInfo.email,
      phone: clientInfo.phone,
      subtotal: totals.subtotal,
      tax: totals.taxTotal,
      disc: totals.discountTotal,
      total: totals.grandTotal,
      paidAmt: 0,
      customer: clientInfo,
      lineItems: totals.items,
      notes: notes.customerNotes,
      terms: notes.terms
    };
  };

  const handleSaveDraft = () => {
    const payload = buildInvoicePayload();
    payload.status = 'draft';
    onSave(payload);
    toast.success('Invoice saved as draft');
    onClose();
  };

  const handleCreate = () => {
    if (validateStep1() && validateStep2() && validateStep3()) {
      const payload = buildInvoicePayload();
      payload.status = 'pending'; // Created invoices are usually pending payment
      onSave(payload);
      toast.success('Invoice created successfully.');
      onClose();
    } else {
      toast.error('Please fix validation errors before creating');
    }
  };

  const handlePreview = async () => {
    if (validateStep1() && validateStep2() && validateStep3()) {
      setLoading(true);
      try {
        const payload = buildInvoicePayload();
        // Use our utility in preview mode
        const url = await generateInvoicePdf(payload, clientInfo, { preview: true });
        setPdfBlobUrl(url);
        setShowPreview(true);
      } catch (err) {
        toast.error('Failed to generate PDF preview');
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please complete all required fields to preview PDF');
    }
  };

  // ─── RENDERERS ────────────────────────────────────────────────────────────
  const renderField = (label, value, key, obj, setObj, type = 'text', placeholder = '', width = 'w-full') => {
    const isError = errors[key];
    return (
      <div className={`flex flex-col gap-1.5 ${width}`}>
        <label className="text-xs font-semibold text-gray-600">{label} {['name', 'id', 'issueDate', 'dueDate', 'currency'].includes(key) && <span className="text-red-500">*</span>}</label>
        <input type={type} value={value} onChange={e => setObj({ ...obj, [key]: e.target.value })}
          placeholder={placeholder}
          className={`px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${isError ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'}`} />
        {isError && <span className="text-[10px] text-red-500 font-medium">{isError}</span>}
      </div>
    );
  };

  const renderStepIndicators = () => {
    const steps = ['Client Info', 'Invoice Info', 'Line Items', 'Notes & Terms'];
    return (
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full z-0 transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }} />
        
        {steps.map((s, i) => {
          const sNum = i + 1;
          const isPast = sNum < step;
          const isActive = sNum === step;
          return (
            <div key={s} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${isPast ? 'bg-indigo-600 text-white' : isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-4 ring-white' : 'bg-white text-gray-400 border-2 border-gray-200'}`}>
                {isPast ? <Check size={16} /> : sNum}
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider absolute -bottom-5 w-24 text-center ${isActive ? 'text-indigo-600' : isPast ? 'text-gray-800' : 'text-gray-400'}`}>
                {s}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* ── MAIN MODAL ── */}
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-5xl h-[85vh] overflow-hidden"
        style={{ transform: showPreview ? 'scale(0.95)' : 'scale(1)', transition: 'transform 0.3s ease', opacity: showPreview ? 0 : 1, pointerEvents: showPreview ? 'none' : 'auto' }}>
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Create Invoice</h2>
              <p className="text-xs text-gray-500 font-medium">{invoiceInfo.id} • Step {step} of 4</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
          {renderStepIndicators()}

          <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mt-8">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4 border-b pb-2"><User size={16} className="text-indigo-600"/> Primary Details</div>
                <div className="flex gap-4">
                  {renderField('Client Name', clientInfo.name, 'name', clientInfo, setClientInfo, 'text', 'Acme Corp')}
                  {renderField('Company Name', clientInfo.companyName, 'companyName', clientInfo, setClientInfo)}
                </div>
                <div className="flex gap-4">
                  {renderField('Email Address', clientInfo.email, 'email', clientInfo, setClientInfo, 'email', 'billing@acme.com')}
                  {renderField('Phone Number', clientInfo.phone, 'phone', clientInfo, setClientInfo)}
                </div>
                
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mt-6 mb-4 border-b pb-2">Billing Address</div>
                {renderField('Address Line 1', clientInfo.billingLine1, 'billingLine1', clientInfo, setClientInfo)}
                <div className="flex gap-4 mt-4">
                  {renderField('City', clientInfo.billingCity, 'billingCity', clientInfo, setClientInfo)}
                  {renderField('State / Province', clientInfo.billingState, 'billingState', clientInfo, setClientInfo)}
                  {renderField('ZIP / Postal', clientInfo.billingZip, 'billingZip', clientInfo, setClientInfo)}
                </div>

                <div className="flex gap-4 mt-6">
                  {renderField('GST/VAT Number', clientInfo.vatNumber, 'vatNumber', clientInfo, setClientInfo)}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-semibold text-gray-600">Payment Terms</label>
                    <select value={clientInfo.paymentTerms} onChange={e => setClientInfo({...clientInfo, paymentTerms: e.target.value})}
                      className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white">
                      <option>Due on Receipt</option><option>Net 15</option><option>Net 30</option><option>Net 45</option><option>Net 60</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4 border-b pb-2"><Calendar size={16} className="text-indigo-600"/> Invoice Details</div>
                <div className="flex gap-4">
                  {renderField('Invoice Number', invoiceInfo.id, 'id', invoiceInfo, setInvoiceInfo)}
                  {renderField('Reference / PO Number', invoiceInfo.poNumber, 'poNumber', invoiceInfo, setInvoiceInfo)}
                </div>
                <div className="flex gap-4">
                  {renderField('Invoice Date', invoiceInfo.issueDate, 'issueDate', invoiceInfo, setInvoiceInfo, 'date')}
                  {renderField('Due Date', invoiceInfo.dueDate, 'dueDate', invoiceInfo, setInvoiceInfo, 'date')}
                </div>
                
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mt-6 mb-4 border-b pb-2"><DollarSign size={16} className="text-indigo-600"/> Financial Settings</div>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-semibold text-gray-600">Currency <span className="text-red-500">*</span></label>
                    <select value={invoiceInfo.currency} onChange={e => setInvoiceInfo({...invoiceInfo, currency: e.target.value})}
                      className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white">
                      <option>USD</option><option>EUR</option><option>GBP</option><option>INR</option><option>CAD</option><option>AUD</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-semibold text-gray-600">Tax Configuration</label>
                    <select value={invoiceInfo.taxConfig} onChange={e => setInvoiceInfo({...invoiceInfo, taxConfig: e.target.value})}
                      className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white">
                      <option>Exclusive</option><option>Inclusive</option><option>Out of scope</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  {renderField('Overall Discount Amount', invoiceInfo.discount, 'discount', invoiceInfo, setInvoiceInfo, 'number')}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-semibold text-gray-600">Billing Cycle</label>
                    <select value={invoiceInfo.billingCycle} onChange={e => setInvoiceInfo({...invoiceInfo, billingCycle: e.target.value})}
                      className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white">
                      <option>One-time</option><option>Monthly Recurring</option><option>Annual Recurring</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                  <div className="text-sm font-bold text-gray-900">Line Items</div>
                  {errors.items && <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded-lg">{errors.items}</span>}
                </div>
                
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                        <th className="px-4 py-3 text-left">Product / Description</th>
                        <th className="px-4 py-3 text-left w-28">HSN Code</th>
                        <th className="px-4 py-3 text-right w-20">Qty</th>
                        <th className="px-4 py-3 text-right w-28">Price</th>
                        <th className="px-4 py-3 text-right w-24">Tax %</th>
                        <th className="px-4 py-3 text-right w-32">Amount</th>
                        <th className="px-4 py-3 text-center w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {lineItems.map((item, idx) => {
                        const err = errors.lineItems?.[idx] || {};
                        return (
                          <tr key={item.id} className="group hover:bg-indigo-50/30 transition-colors">
                            <td className="p-2">
                              <div className="flex flex-col gap-1">
                                <select 
                                  className="w-full px-2 py-1.5 text-sm rounded bg-transparent border-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                  value={PRODUCT_LIST.find(p => p.name === item.name)?.id || ''}
                                  onChange={e => {
                                    const prod = PRODUCT_LIST.find(p => p.id === e.target.value);
                                    if(prod) {
                                      const newItems = [...lineItems];
                                      newItems[idx] = { ...item, name: prod.name, price: prod.price, tax: prod.tax, hsnCode: prod.hsnCode || '' };
                                      setLineItems(newItems);
                                    }
                                  }}>
                                  <option value="">Select a product...</option>
                                  {PRODUCT_LIST.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <input type="text" placeholder="Or type custom description..."
                                  className={`w-full px-2 py-1 text-xs rounded bg-transparent border-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-indigo-500 outline-none ${err.name ? 'border-red-400 bg-red-50' : ''}`}
                                  value={item.description}
                                  onChange={e => {
                                    const newItems = [...lineItems];
                                    newItems[idx].description = e.target.value;
                                    setLineItems(newItems);
                                  }} />
                              </div>
                            </td>
                            <td className="p-2 align-top pt-3">
                              <input type="text" placeholder="Enter HSN Code" maxLength="8"
                                className={`w-full text-left px-2 py-1.5 text-sm rounded bg-transparent border-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-indigo-500 outline-none ${err.hsnCode ? 'border-red-400 bg-red-50 text-red-500' : ''}`}
                                value={item.hsnCode || ''}
                                onChange={e => {
                                  const val = e.target.value.replace(/\D/g, ''); // only numeric
                                  const newItems = [...lineItems];
                                  newItems[idx].hsnCode = val;
                                  setLineItems(newItems);
                                }} />
                                {err.hsnCode && <p className="text-[10px] text-red-500 px-2 mt-0.5 leading-tight">{err.hsnCode}</p>}
                            </td>
                            <td className="p-2 align-top pt-3">
                              <input type="number" min="1"
                                className={`w-full text-right px-2 py-1.5 text-sm rounded bg-transparent border-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-indigo-500 outline-none ${err.quantity ? 'text-red-500' : ''}`}
                                value={item.quantity}
                                onChange={e => {
                                  const newItems = [...lineItems];
                                  newItems[idx].quantity = e.target.value;
                                  setLineItems(newItems);
                                }} />
                            </td>
                            <td className="p-2 align-top pt-3">
                              <input type="number" min="0" step="0.01"
                                className={`w-full text-right px-2 py-1.5 text-sm rounded bg-transparent border-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-indigo-500 outline-none ${err.price ? 'text-red-500' : ''}`}
                                value={item.price}
                                onChange={e => {
                                  const newItems = [...lineItems];
                                  newItems[idx].price = e.target.value;
                                  setLineItems(newItems);
                                }} />
                            </td>
                            <td className="p-2 align-top pt-3">
                              <input type="number" min="0" max="100"
                                className="w-full text-right px-2 py-1.5 text-sm rounded bg-transparent border-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-indigo-500 outline-none"
                                value={item.tax}
                                onChange={e => {
                                  const newItems = [...lineItems];
                                  newItems[idx].tax = e.target.value;
                                  setLineItems(newItems);
                                }} />
                            </td>
                            <td className="p-2 align-top pt-3 text-right">
                              <div className="px-2 py-1.5 font-bold text-gray-900 bg-gray-50 rounded tabular-nums border border-transparent">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoiceInfo.currency }).format((item.quantity || 0) * (item.price || 0))}
                              </div>
                            </td>
                            <td className="p-2 align-top pt-3 text-center">
                              <button onClick={() => setLineItems(lineItems.filter((_, i) => i !== idx))}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                    <button onClick={() => setLineItems([...lineItems, { id: Date.now(), name: '', description: '', hsnCode: '', quantity: 1, price: 0, tax: 18, discount: 0, amount: 0 }])}
                      className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                      <Plus size={16} /> Add Line Item
                    </button>
                  </div>
                </div>

                {/* Subtotals Box */}
                <div className="flex justify-end mt-6">
                  <div className="w-72 bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2">
                    {(() => {
                      const { subtotal, taxTotal, discountTotal, grandTotal } = calcTotals();
                      const fmt = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: invoiceInfo.currency }).format(v);
                      return (
                        <>
                          <div className="flex justify-between text-sm text-gray-600"><span>Subtotal:</span> <span className="font-medium">{fmt(subtotal)}</span></div>
                          {discountTotal > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount:</span> <span className="font-medium">-{fmt(discountTotal)}</span></div>}
                          <div className="flex justify-between text-sm text-gray-600"><span>Tax ({invoiceInfo.taxConfig}):</span> <span className="font-medium">{fmt(taxTotal)}</span></div>
                          <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-lg">
                            <span>Total:</span> <span>{fmt(grandTotal)}</span>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Customer Notes (Visible on Invoice)</label>
                  <textarea rows="3" value={notes.customerNotes} onChange={e => setNotes({...notes, customerNotes: e.target.value})}
                    placeholder="E.g., Thank you for your business."
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Terms & Conditions</label>
                  <textarea rows="3" value={notes.terms} onChange={e => setNotes({...notes, terms: e.target.value})}
                    placeholder="E.g., Payment is due within 30 days."
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Internal Notes (Not visible to customer)</label>
                  <textarea rows="2" value={notes.internalNotes} onChange={e => setNotes({...notes, internalNotes: e.target.value})}
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none bg-yellow-50/30" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STICKY FOOTER NAVIGATION */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white z-20 shrink-0 flex items-center justify-between">
          <button onClick={() => step > 1 ? setStep(step - 1) : onClose()} 
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
            {step > 1 ? <><ChevronLeft size={16} /> Previous</> : 'Cancel'}
          </button>
          
          <div className="flex items-center gap-3">
            <button onClick={handleSaveDraft}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all shadow-sm">
              <Save size={16} className="text-gray-400" /> Save Draft
            </button>
            
            {step < 4 ? (
              <button onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-200">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <>
                <button onClick={handlePreview} disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 rounded-xl transition-all">
                  <Eye size={16} /> {loading ? 'Generating...' : 'Preview PDF'}
                </button>
                <button onClick={handleCreate}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-md shadow-green-200">
                  <CheckCircle size={16} /> Create Invoice
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── PDF PREVIEW MODAL OVERLAY ── */}
      {showPreview && pdfBlobUrl && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setShowPreview(false)} />
          <div className="bg-gray-100 rounded-2xl shadow-2xl flex flex-col w-full max-w-4xl h-[90vh] relative z-10 overflow-hidden border border-gray-300">
            {/* Header */}
            <div className="px-5 py-3 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <FileText size={18} className="text-indigo-600" /> PDF Preview
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all">
                  <Mail size={14} /> Email
                </button>
                <a href={pdfBlobUrl} download={`Invoice_${invoiceInfo.id}.pdf`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-sm">
                  <Download size={14} /> Download PDF
                </a>
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <button onClick={() => setShowPreview(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>
            {/* PDF Viewer */}
            <div className="flex-1 w-full bg-gray-50 p-4">
              <iframe src={pdfBlobUrl} className="w-full h-full rounded-xl shadow-sm border border-gray-200 bg-white" title="PDF Preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

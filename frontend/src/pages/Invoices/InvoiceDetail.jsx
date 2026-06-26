import { useAuth } from '../../store/AuthContext';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, XCircle, Download, CheckCircle, Loader } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import MonoId from '../../components/common/MonoId';
import toast from 'react-hot-toast';
import MarkAsPaidModal from './MarkAsPaidModal';
import DocumentViewerModal from './DocumentViewerModal';
import { Eye, Paperclip, FileText } from 'lucide-react';
import { generateInvoicePdf } from '../../utils/generateInvoicePdf';

export default function InvoiceDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [viewDocument, setViewDocument] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/invoices/${id}`);
      setInvoice(res.data.data);
      
      const notifsRes = await api.get(`/invoices/${id}/notifications`);
      setNotifications(notifsRes.data.data);
    } catch (e) {
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const handleRecordPayment = async () => {
    const amt = prompt('Enter payment amount:');
    if (!amt) return;
    try {
      await api.post(`/invoices/${id}/record-payment`, { amount: parseFloat(amt) });
      toast.success('Payment recorded');
      fetchInvoice();
    } catch {
      toast.error('Failed to record payment');
    }
  };

  const handleVoid = async () => {
    if (!window.confirm('Are you sure you want to void this invoice?')) return;
    try {
      await api.post(`/invoices/${id}/void`);
      toast.success('Invoice voided');
      fetchInvoice();
    } catch {
      toast.error('Failed to void invoice');
    }
  };

  const handleMarkPaid = async (data) => {
    try {
      setMarkingPaid(true);
      await api.put(`/invoices/${id}/mark-paid`, data);
      toast.success('Marked as Paid');
      setShowMarkPaidModal(false);
      fetchInvoice();
    } catch {
      toast.error('Failed to mark as paid');
    } finally {
      setMarkingPaid(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setPdfLoading(true);
      // Try to enrich with full customer data for the PDF
      let customer = null;
      if (invoice.customerId) {
        try {
          const custRes = await api.get(`/customers/${invoice.customerId}`);
          customer = custRes.data.data || custRes.data;
        } catch {
          // non-fatal — PDF still generates with whatever is in invoice
        }
      }
      const filename = await generateInvoicePdf(invoice, customer);
      toast.success(`Downloaded ${filename}`);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDownloadAttachment = () => {
    // Simulated attachment download
    const blob = new Blob(['Simulated attachment content'], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PO_Document_4590.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Downloaded Attachment');
  };

  const handleResendNotification = async (notifId) => {
    try {
      await api.post(`/invoices/${id}/notifications/resend`, { notificationId: notifId });
      toast.success('Notification queued for resend');
      fetchInvoice();
    } catch {
      toast.error('Failed to resend notification');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!invoice) return <div className="p-8">Invoice not found</div>;

  return (
    <div>
      {/* Header */}
      <div className="bg-surface px-8 py-6 border-b border-gray-200 flex items-start justify-between">
        <div>
          <button 
            onClick={() => navigate('/invoices')}
            className="flex items-center gap-1 text-sm text-muted hover:text-ink mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Invoices
          </button>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-display font-semibold text-ink flex items-center gap-2">
              <MonoId id={invoice.id} />
            </h1>
            <StatusBadge status={invoice.status} />
            {invoice.paymentStatus && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                invoice.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                invoice.paymentStatus === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {invoice.paymentStatus}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span>Customer: <MonoId id={invoice.customerId} /></span>
            <span>Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="btn-ghost" 
            onClick={handleDownloadPDF}
            disabled={pdfLoading}
            title="Download Invoice as PDF"
          >
            {pdfLoading 
              ? <Loader size={14} className="animate-spin" />
              : <Download size={14} />}
            {pdfLoading ? 'Generating…' : 'Download PDF'}
          </button>
          {['POSTED', 'PAYMENT_DUE'].includes(invoice.status) && (
            <>
              <button className="btn-secondary text-green-600 hover:bg-green-50 hover:border-green-200" onClick={() => setShowMarkPaidModal(true)}>
                <CheckCircle size={14} /> Mark as Paid
              </button>
              <button className="btn-primary" onClick={handleRecordPayment}>
                <DollarSign size={14} /> Record Payment
              </button>
              <button className="btn-ghost text-red-600 hover:bg-red-50" onClick={handleVoid}>
                <XCircle size={14} /> Void
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 max-w-5xl">
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-base font-semibold text-ink">Line Items</h3>
          </div>
          
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-muted border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium text-right">Qty</th>
                <th className="px-6 py-3 font-medium text-right">Unit Price</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.lineItems?.length > 0 ? invoice.lineItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{item.description}</td>
                  <td className="px-6 py-4 text-right tabular-nums">{item.quantity}</td>
                  <td className="px-6 py-4 text-right tabular-nums">${(item.unitAmount || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right tabular-nums font-medium">${((item.amount) ?? (item.quantity * item.unitAmount) || 0).toFixed(2)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-muted">No line items found.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end">
            <div className="w-64 space-y-3 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="tabular-nums">${(invoice.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Tax</span>
                <span className="tabular-nums">${(invoice.taxTotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-ink pt-3 border-t border-gray-200">
                <span>Total</span>
                <span className="tabular-nums">${(invoice.total || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Amount Paid</span>
                <span className="tabular-nums">-${(invoice.amountPaid || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-ink pt-3 border-t border-gray-200">
                <span>Amount Due</span>
                <span className="tabular-nums">${(invoice.amountDue || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attached Documents */}
        <div className="card mt-8">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-base font-semibold text-ink flex items-center gap-2">
              <Paperclip size={16} /> Attached Documents
            </h3>
            <button className="text-sm text-accent hover:underline font-medium">Upload File</button>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">PO_Document_4590.pdf</p>
                  <p className="text-xs text-muted">2.4 MB • Uploaded yesterday</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="p-2 text-slate-500 hover:text-accent hover:bg-blue-50 rounded transition-colors"
                  onClick={() => setViewDocument({ name: 'PO_Document_4590.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'application/pdf' })}
                  title="View"
                >
                  <Eye size={16} />
                </button>
                <button 
                  className="p-2 text-slate-500 hover:text-ink hover:bg-gray-100 rounded transition-colors"
                  title="Download"
                  onClick={handleDownloadAttachment}
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Timeline */}
        <div className="card mt-8">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-base font-semibold text-ink">Notification Timeline</h3>
          </div>
          <div className="p-6">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted">No notifications scheduled.</p>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {notifications.map((notif, idx) => (
                  <div key={notif.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {notif.status === 'SENT' ? <CheckCircle size={14} className="text-green-500" /> : <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-slate-900 text-sm">{notif.type.replace(/_/g, ' ')}</div>
                        <time className="font-mono text-xs text-amber-500">
                          {new Date(notif.scheduledFor).toLocaleDateString()}
                        </time>
                      </div>
                      <div className="text-slate-500 text-xs flex justify-between items-end mt-2">
                        <span>Status: <span className="font-medium text-ink">{notif.status}</span></span>
                        {notif.status === 'FAILED' && (
                          <button onClick={() => handleResendNotification(notif.id)} className="text-accent hover:underline">Resend</button>
                        )}
                        {notif.status === 'SENT' && (
                          <span className="text-green-600">Sent at {new Date(notif.sentAt).toLocaleTimeString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <MarkAsPaidModal 
        isOpen={showMarkPaidModal} 
        onClose={() => setShowMarkPaidModal(false)} 
        onConfirm={handleMarkPaid} 
        loading={markingPaid} 
      />
      <DocumentViewerModal
        isOpen={!!viewDocument}
        onClose={() => setViewDocument(null)}
        document={viewDocument}
      />
    </div>
  );
}

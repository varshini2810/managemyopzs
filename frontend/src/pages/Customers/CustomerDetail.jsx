import { useAuth } from "../../store/AuthContext";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CreditCard,
  History,
  UserPlus,
  MessageSquare,
  Shield,
  ArrowLeft,
} from "lucide-react";
import api from "../../services/api";
import StatusBadge from "../../components/common/StatusBadge";
import toast from "react-hot-toast";
export default function CustomerDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const [cusRes, pmRes, ctRes] = await Promise.all([
        api.get(`/customers/${id}`),
        api.get(`/customers/${id}/payment-methods`),
        api.get(`/customers/${id}/contacts`),
      ]);
      setCustomer(cusRes.data.data);
      setPaymentMethods(pmRes.data.data || []);
      setContacts(ctRes.data.data || []);
    } catch (e) {
      toast.error("Failed to load customer details");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCustomerData();
  }, [id]);
  const handleSetPrimary = async (pmId) => {
    try {
      await api.put(`/customers/${id}/payment-methods/${pmId}/set-primary`);
      toast.success("Primary payment method updated");
      fetchCustomerData();
    } catch {
      toast.error("Failed to update payment method");
    }
  };
  if (loading) return <div className="p-8">Loading customer details...</div>;
  if (!customer) return <div className="p-8">Customer not found.</div>;
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "payment-methods", label: "Payment Methods" },
    { id: "subscriptions", label: "Subscriptions" },
    { id: "invoices", label: "Invoices & Credit Notes" },
    { id: "contacts", label: "Additional Contacts" },
    { id: "activity", label: "Activity Log" },
  ];
  return (
    <div>
      {" "}
      {/* Header */}{" "}
      <div className="bg-surface px-8 py-6 border-b border-gray-200">
        {" "}
        <button
          onClick={() => navigate("/customers")}
          className="flex items-center gap-1 text-sm text-muted hover:text-ink mb-4 transition-colors"
        >
          {" "}
          <ArrowLeft size={14} /> Back to Customers{" "}
        </button>{" "}
        <div className="flex items-start justify-between">
          {" "}
          <div>
            {" "}
            <div className="flex items-center gap-3 mb-2">
              {" "}
              <h1 className="text-2xl font-display font-semibold text-ink">
                {" "}
                {customer.firstName} {customer.lastName}{" "}
              </h1>{" "}
              <StatusBadge status={customer.status} />{" "}
            </div>{" "}
            <div className="flex items-center gap-4 text-sm text-muted">
              {" "}
              <span>
                ID: <span className="font-mono">{customer.id}</span>
              </span>{" "}
              <span>{customer.email}</span>{" "}
              {customer.companyName && <span>{customer.companyName}</span>}{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex items-center gap-2">
            {" "}
            <button
              className="btn-ghost"
              onClick={() => navigate(`/customers/${customer.id}/edit`)}
            >
              Edit Customer
            </button>{" "}
            <button className="btn-primary">Create Subscription</button>{" "}
          </div>{" "}
        </div>{" "}
        {/* Tabs */}{" "}
        <div className="flex items-center gap-6 mt-8">
          {" "}
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === t.id ? "border-primary text-ink" : "border-transparent text-muted hover:text-ink"}`}
            >
              {" "}
              {t.label}{" "}
            </button>
          ))}{" "}
        </div>{" "}
      </div>{" "}
      {/* Content */}{" "}
      <div className="px-8 py-8 max-w-5xl">
        {" "}
        {activeTab === "overview" && (
          <div className="grid grid-cols-2 gap-8">
            {" "}
            <div className="card p-6">
              {" "}
              <h3 className="text-base font-semibold text-ink mb-4">
                Basic Information
              </h3>{" "}
              <dl className="space-y-3 text-sm">
                {" "}
                <div className="flex justify-between">
                  <dt className="text-muted">First Name</dt>
                  <dd className="font-medium">{customer.firstName}</dd>
                </div>{" "}
                <div className="flex justify-between">
                  <dt className="text-muted">Last Name</dt>
                  <dd className="font-medium">{customer.lastName}</dd>
                </div>{" "}
                <div className="flex justify-between">
                  <dt className="text-muted">Email</dt>
                  <dd className="font-medium">{customer.email}</dd>
                </div>{" "}
                <div className="flex justify-between">
                  <dt className="text-muted">Phone</dt>
                  <dd className="font-medium">{customer.phone || "—"}</dd>
                </div>{" "}
                <div className="flex justify-between">
                  <dt className="text-muted">Company</dt>
                  <dd className="font-medium">{customer.companyName || "—"}</dd>
                </div>{" "}
              </dl>{" "}
            </div>{" "}
            <div className="card p-6">
              {" "}
              <h3 className="text-base font-semibold text-ink mb-4">
                Billing Address
              </h3>{" "}
              {customer.billingLine1 ? (
                <div className="text-sm text-ink space-y-1">
                  {" "}
                  <div>{customer.billingLine1}</div>{" "}
                  {customer.billingLine2 && <div>{customer.billingLine2}</div>}{" "}
                  <div>
                    {customer.billingCity}, {customer.billingState}{" "}
                    {customer.billingZip}
                  </div>{" "}
                  <div>{customer.billingCountry}</div>{" "}
                </div>
              ) : (
                <div className="text-sm text-muted">
                  No billing address on file
                </div>
              )}{" "}
            </div>{" "}
            <div className="card p-6">
              {" "}
              <h3 className="text-base font-semibold text-ink mb-4">
                Tax & Locale
              </h3>{" "}
              <dl className="space-y-3 text-sm">
                {" "}
                <div className="flex justify-between">
                  <dt className="text-muted">VAT Number</dt>
                  <dd className="font-medium">{customer.vatNumber || "—"}</dd>
                </div>{" "}
                <div className="flex justify-between">
                  <dt className="text-muted">Tax Exempt</dt>
                  <dd className="font-medium">
                    {customer.taxExempt ? "Yes" : "No"}
                  </dd>
                </div>{" "}
                <div className="flex justify-between">
                  <dt className="text-muted">Currency</dt>
                  <dd className="font-medium">{customer.preferredCurrency}</dd>
                </div>{" "}
                <div className="flex justify-between">
                  <dt className="text-muted">Language</dt>
                  <dd className="font-medium">
                    {customer.preferredLanguage || "English"}
                  </dd>
                </div>{" "}
              </dl>{" "}
            </div>{" "}
          </div>
        )}{" "}
        {activeTab === "payment-methods" && (
          <div className="space-y-4">
            {" "}
            <div className="flex justify-between items-center mb-4">
              {" "}
              <h3 className="text-lg font-semibold text-ink">
                Payment Methods
              </h3>{" "}
              {user?.role !== "USER" && (
                <button className="btn-primary btn-sm">
                  Add Payment Method
                </button>
              )}{" "}
            </div>{" "}
            {paymentMethods.length === 0 ? (
              <div className="card p-12 flex flex-col items-center justify-center text-center">
                {" "}
                <CreditCard size={32} className="text-muted mb-4" />{" "}
                <p className="text-sm text-ink font-medium">
                  No payment methods added
                </p>{" "}
                <p className="text-xs text-muted mt-1">
                  Add a primary card or bank account to process recurring
                  charges.
                </p>{" "}
              </div>
            ) : (
              paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="card p-4 flex items-center justify-between"
                >
                  {" "}
                  <div className="flex items-center gap-4">
                    {" "}
                    <div className="w-10 h-10 rounded-card bg-gray-100 flex items-center justify-center">
                      {" "}
                      <CreditCard size={18} className="text-gray-600" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div className="font-medium text-ink flex items-center gap-2">
                        {" "}
                        {pm.type} ••••{" "}
                        {pm.details ? JSON.parse(pm.details).last4 : "XXXX"}{" "}
                        {pm.primary && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-card font-semibold">
                            Primary
                          </span>
                        )}{" "}
                        {pm.backup && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-card font-semibold">
                            Backup
                          </span>
                        )}{" "}
                      </div>{" "}
                      <div className="text-xs text-muted mt-0.5">
                        Expires{" "}
                        {pm.details ? JSON.parse(pm.details).expMonth : "XX"}/
                        {pm.details ? JSON.parse(pm.details).expYear : "XX"}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                  {!pm.primary && user?.role !== "USER" && (
                    <button
                      className="btn-ghost btn-sm"
                      onClick={() => handleSetPrimary(pm.id)}
                    >
                      Make Primary
                    </button>
                  )}{" "}
                </div>
              ))
            )}{" "}
          </div>
        )}{" "}
        {activeTab === "contacts" && (
          <div className="space-y-4">
            {" "}
            <div className="flex justify-between items-center mb-4">
              {" "}
              <h3 className="text-lg font-semibold text-ink">
                Additional Contacts
              </h3>{" "}
              {user?.role !== "USER" && (
                <button className="btn-primary btn-sm">Add Contact</button>
              )}{" "}
            </div>{" "}
            {contacts.length === 0 ? (
              <div className="card p-12 flex flex-col items-center justify-center text-center">
                {" "}
                <UserPlus size={32} className="text-muted mb-4" />{" "}
                <p className="text-sm text-ink font-medium">
                  No additional contacts
                </p>{" "}
                <p className="text-xs text-muted mt-1">
                  Add billing or technical contacts to receive specific emails.
                </p>{" "}
              </div>
            ) : (
              contacts.map((ct) => (
                <div
                  key={ct.id}
                  className="card p-4 flex items-center justify-between"
                >
                  {" "}
                  <div>
                    {" "}
                    <div className="font-medium text-ink">
                      {ct.firstName} {ct.lastName}
                    </div>{" "}
                    <div className="text-sm text-muted">
                      {ct.email} • {ct.phone || "No phone"}
                    </div>{" "}
                    <div className="text-xs mt-1 space-x-2">
                      {" "}
                      {ct.sendAccountEmails && (
                        <span className="text-success font-medium">
                          Account Emails
                        </span>
                      )}{" "}
                      {ct.sendBillingEmails && (
                        <span className="text-success font-medium">
                          Billing Emails
                        </span>
                      )}{" "}
                    </div>{" "}
                  </div>{" "}
                  {ct.tag && (
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-card font-semibold">
                      {ct.tag}
                    </span>
                  )}{" "}
                </div>
              ))
            )}{" "}
          </div>
        )}{" "}
        {/* Placeholders for Subscriptions, Invoices, Activity */}{" "}
        {(activeTab === "subscriptions" ||
          activeTab === "invoices" ||
          activeTab === "activity") && (
          <div className="card p-12 flex flex-col items-center justify-center text-center">
            {" "}
            <Shield size={32} className="text-muted mb-4" />{" "}
            <p className="text-sm text-ink font-medium">Coming soon in phase</p>{" "}
            <p className="text-xs text-muted mt-1">
              This module relies on the implementation of {activeTab}.
            </p>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}

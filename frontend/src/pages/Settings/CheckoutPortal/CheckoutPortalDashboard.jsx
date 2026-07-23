import React, { useState } from "react";
import toast from "react-hot-toast";
import { ChevronRight, Image as ImageIcon, Code2 } from "lucide-react";
import IntegrationModal from "./IntegrationModal";
export default function CheckoutPortalDashboard() {
  const [activeTab, setActiveTab] = useState("Configuration");
  const [activeMenu, setActiveMenu] = useState("Checkout");
  const [isLoading, setIsLoading] = useState(true);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const tabs = [
    "Configuration",
    "Fields",
    "Labels",
    "Integrate with Chargebee",
  ];
  const menuItems = [
    "Checkout",
    "Portal",
    "Portal for Contract Terms",
    "Advanced Settings",
    "Gift Subscription",
  ];
  const [settings, setSettings] = useState({
    accessCheckout: "Via Login",
    showLegalInfo: false,
    showDescription: false,
    allowEditQuantity: true,
    allowChangeAddonQuantity: true,
    allowRemoveAddons: true,
    showRecommendedAddons: false,
    allowCoupons: false,
  });
  React.useEffect(() => {
    /*  Simulate loading state  */ const timer = setTimeout(
      () => setIsLoading(false),
      800,
    );
    return () => clearTimeout(timer);
  }, []);
  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };
  if (isLoading) {
    return (
      <div className="h-full w-full bg-white flex items-center justify-center">
        {" "}
        <div className="flex flex-col items-center">
          {" "}
          <div className="w-8 h-8 border-4 border-[#6D28D9]/30 border-t-[#6D28D9] rounded-card animate-spin mb-4"></div>{" "}
          <p className="text-gray-500 text-sm font-medium">
            {" "}
            Loading Checkout Settings...{" "}
          </p>{" "}
        </div>{" "}
      </div>
    );
  }
  return (
    <div className="h-full w-full bg-white flex flex-col font-sans animate-fade-in relative">
      {" "}
      {/* Top Header */}{" "}
      <div className="px-8 pt-8 pb-4 border-b border-gray-200 shrink-0">
        {" "}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          {" "}
          <span>Configure Chargebee</span>{" "}
          <ChevronRight size={16} className="mx-2" />{" "}
          <span className="font-semibold text-gray-900">
            {" "}
            Checkout & Self-Serve Portal{" "}
          </span>{" "}
        </div>{" "}
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          {" "}
          Checkout & Self-Serve Portal{" "}
        </h1>{" "}
        <p className="text-sm text-gray-500">
          {" "}
          Customize checkout and customer self-service portal settings.{" "}
        </p>{" "}
        {/* Top Navigation Tabs */}{" "}
        <div className="flex space-x-8 mt-6">
          {" "}
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab ? "border-[#6D28D9] text-[#6D28D9]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              {" "}
              {tab}{" "}
            </button>
          ))}{" "}
        </div>{" "}
      </div>{" "}
      {/* Main Content Area */}{" "}
      <div className="flex flex-1 overflow-hidden">
        {" "}
        {/* Left Sidebar Navigation */}{" "}
        <div className="w-64 border-r border-gray-200 bg-[#FAFAFA] flex flex-col shrink-0">
          {" "}
          <nav className="flex-1 py-4">
            {" "}
            <ul className="space-y-1 px-3">
              {" "}
              {menuItems.map((item) => (
                <li key={item}>
                  {" "}
                  <button
                    onClick={() => setActiveMenu(item)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-card transition-colors ${activeMenu === item ? "bg-[#F3E8FF] text-[#6D28D9] font-medium" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
                  >
                    {" "}
                    {item}{" "}
                  </button>{" "}
                </li>
              ))}{" "}
            </ul>{" "}
          </nav>{" "}
          {/* Preview Card */}{" "}
          <div className="p-4 border-t border-gray-200 bg-white m-3 rounded-card shadow-sm">
            {" "}
            <p className="text-xs text-gray-600 mb-4 text-center">
              {" "}
              Preview the changes you make to your Checkout and Portal here{" "}
            </p>{" "}
            <div className="space-y-2">
              {" "}
              <button className="w-full text-[#6D28D9] bg-white border border-[#6D28D9] hover:bg-[#F3E8FF] py-1.5 px-3 rounded-button text-sm font-medium transition-colors">
                {" "}
                Preview Checkout/Portal{" "}
              </button>{" "}
              <button className="w-full text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 py-1.5 px-3 rounded-button text-sm font-medium transition-colors">
                {" "}
                Preview Action Pages{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Right Content Area */}{" "}
        <div className="flex-1 overflow-y-auto p-8 relative pb-24">
          {" "}
          <div className="max-w-3xl mx-auto space-y-8">
            {" "}
            {activeTab === "Integrate with Chargebee" ? (
              <div className="bg-white border border-gray-200 rounded-card p-8 shadow-sm text-center">
                {" "}
                <div className="mx-auto w-16 h-16 bg-[#F3E8FF] rounded-2xl flex items-center justify-center mb-4">
                  {" "}
                  <Code2 size={32} className="text-[#6D28D9]" />{" "}
                </div>{" "}
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {" "}
                  Integrate OPZ Checkout{" "}
                </h2>{" "}
                <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                  {" "}
                  Generate drop-in scripts or explore our REST API to seamlessly
                  integrate OPZ checkout flows into your application.{" "}
                </p>{" "}
                <button
                  onClick={() => setIsIntegrationModalOpen(true)}
                  className="bg-[#6D28D9] hover:bg-[#5b21b6] text-white px-6 py-2.5 rounded-card text-sm font-medium shadow-md transition-colors"
                >
                  {" "}
                  Configure Integration{" "}
                </button>{" "}
              </div>
            ) : (
              <>
                {" "}
                {/* Branding Banner */}{" "}
                <div className="bg-slate-900 rounded-card p-6 text-white flex items-center justify-between shadow-sm">
                  {" "}
                  <div className="flex items-center gap-4">
                    {" "}
                    <div className="bg-white/20 p-3 rounded-card">
                      {" "}
                      <ImageIcon size={24} className="text-white" />{" "}
                    </div>{" "}
                    <p className="font-medium text-lg">
                      {" "}
                      Kick things off by customizing how your portal will look
                      to customers{" "}
                    </p>{" "}
                  </div>{" "}
                  <button className="bg-white text-[#6D28D9] px-4 py-2 rounded-button text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                    {" "}
                    Add Logo & Color{" "}
                  </button>{" "}
                </div>{" "}
                {/* Checkout Settings Section */}{" "}
                <div>
                  {" "}
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {" "}
                    Checkout{" "}
                  </h2>{" "}
                  <p className="text-sm text-gray-500 mb-4">
                    {" "}
                    Onboard new customers and help existing customers manage
                    subscriptions through the checkout experience.{" "}
                  </p>{" "}
                  {/* Material Design Settings Card */}{" "}
                  <div className="bg-white border border-gray-200 rounded-card shadow-sm overflow-hidden">
                    {" "}
                    {/* Dropdown Row */}{" "}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      {" "}
                      <div className="text-sm font-medium text-gray-800">
                        {" "}
                        Customers can access the checkout{" "}
                      </div>{" "}
                      <select
                        className="border border-gray-300 rounded-input text-sm py-1.5 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] focus:border-[#6D28D9] bg-white cursor-pointer"
                        value={settings.accessCheckout}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            accessCheckout: e.target.value,
                          })
                        }
                      >
                        {" "}
                        <option>Via Login</option>{" "}
                        <option>Without Login</option>{" "}
                      </select>{" "}
                    </div>{" "}
                    {/* Toggle Rows */}{" "}
                    <ToggleRow
                      label="Show legal information"
                      checked={settings.showLegalInfo}
                      onChange={() => handleToggle("showLegalInfo")}
                    />{" "}
                    <ToggleRow
                      label="Show description for all items"
                      checked={settings.showDescription}
                      onChange={() => handleToggle("showDescription")}
                    />{" "}
                    <ToggleRow
                      label="Allow customers to edit quantity for plans"
                      checked={settings.allowEditQuantity}
                      onChange={() => handleToggle("allowEditQuantity")}
                    />{" "}
                    <ToggleRow
                      label="Allow customers to change addon and charge quantity"
                      checked={settings.allowChangeAddonQuantity}
                      onChange={() => handleToggle("allowChangeAddonQuantity")}
                    />{" "}
                    <ToggleRow
                      label="Allow customers to remove addons and charges"
                      checked={settings.allowRemoveAddons}
                      onChange={() => handleToggle("allowRemoveAddons")}
                    />{" "}
                    <ToggleRow
                      label="Show recommended addons in checkout"
                      checked={settings.showRecommendedAddons}
                      onChange={() => handleToggle("showRecommendedAddons")}
                    />{" "}
                    <ToggleRow
                      label="Allow customers to add/remove coupons"
                      checked={settings.allowCoupons}
                      onChange={() => handleToggle("allowCoupons")}
                      last
                    />{" "}
                  </div>{" "}
                </div>{" "}
              </>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Save Changes Button Fixed Bottom Right */}{" "}
      <div className="absolute bottom-6 right-8">
        {" "}
        <button
          onClick={handleSave}
          className="bg-[#6D28D9] hover:bg-[#5b21b6] text-white px-6 py-2.5 rounded-button text-sm font-medium shadow-md transition-colors"
        >
          {" "}
          Save Changes{" "}
        </button>{" "}
      </div>{" "}
      {/* Integration Modal */}{" "}
      <IntegrationModal
        isOpen={isIntegrationModalOpen}
        onClose={() => setIsIntegrationModalOpen(false)}
      />{" "}
    </div>
  );
}
/*  Reusable Toggle Row Component  */ function ToggleRow({
  label,
  checked,
  onChange,
  last,
}) {
  return (
    <div
      className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${!last ? "border-b border-gray-100" : ""}`}
    >
      {" "}
      <div className="text-sm font-medium text-gray-800">{label}</div>{" "}
      <label className="relative inline-flex items-center cursor-pointer">
        {" "}
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />{" "}
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6D28D9]"></div>{" "}
      </label>{" "}
    </div>
  );
}

import React, { useState, useRef } from "react";
import { ArrowLeft, Save, Play, Send, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
const VARIABLES = [
  "{{CustomerName}}",
  "{{CompanyName}}",
  "{{InvoiceNumber}}",
  "{{SubscriptionName}}",
  "{{PlanName}}",
  "{{Amount}}",
  "{{DueDate}}",
  "{{PaymentDate}}",
];
export default function EmailTemplateEditor({
  notification,
  categoryName,
  onBack,
}) {
  const [formData, setFormData] = useState({
    name: notification?.name || "",
    subject: notification?.subject || "",
    senderName: notification?.senderName || "ManageMyOPZ Team",
    senderEmail: notification?.senderEmail || "hello@managemyopz.com",
    body:
      notification?.body ||
      "Hi {{CustomerName}},\n\nWelcome to ManageMyOPZ!\n\nThanks,\nManageMyOPZ Team",
  });
  const textareaRef = useRef(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const insertVariable = (variable) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.body;
    const newBody = text.substring(0, start) + variable + text.substring(end);
    setFormData((prev) => ({ ...prev, body: newBody }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + variable.length,
        start + variable.length,
      );
    }, 0);
  };
  const handlePublish = () => {
    toast.success("Email template published successfully!");
    onBack();
  };
  return (
    <div className="p-8 max-w-5xl mx-auto font-sans pb-24">
      {" "}
      <div className="flex items-center gap-4 mb-8 pb-4 border-b border-stone-200">
        {" "}
        <button
          onClick={onBack}
          className="p-2 hover:bg-stone-200 rounded-md transition-colors text-stone-600"
        >
          {" "}
          <ArrowLeft size={20} />{" "}
        </button>{" "}
        <div>
          {" "}
          <div className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold">
            {" "}
            {categoryName} / Edit Template{" "}
          </div>{" "}
          <h1 className="text-2xl font-bold text-stone-900">
            {formData.name || "New Template"}
          </h1>{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {" "}
        <div className="lg:col-span-2 space-y-6">
          {" "}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
            {" "}
            <h2 className="text-lg font-semibold text-stone-900 mb-4">
              Template Settings
            </h2>{" "}
            <div className="space-y-4">
              {" "}
              <div>
                {" "}
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Notification Name
                </label>{" "}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Email Subject
                </label>{" "}
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />{" "}
              </div>{" "}
              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div>
                  {" "}
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Sender Name
                  </label>{" "}
                  <input
                    type="text"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Sender Email
                  </label>{" "}
                  <input
                    type="email"
                    name="senderEmail"
                    value={formData.senderEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 flex flex-col">
            {" "}
            <div className="flex justify-between items-center mb-4">
              {" "}
              <h2 className="text-lg font-semibold text-stone-900">
                Email Body
              </h2>{" "}
            </div>{" "}
            <div className="border border-stone-300 rounded-md overflow-hidden flex flex-col min-h-[300px]">
              {" "}
              <div className="bg-stone-50 border-b border-stone-300 p-2 flex gap-2">
                {" "}
                <button className="px-2 py-1 text-sm font-bold text-stone-700 hover:bg-stone-200 rounded">
                  B
                </button>{" "}
                <button className="px-2 py-1 text-sm italic text-stone-700 hover:bg-stone-200 rounded">
                  I
                </button>{" "}
                <button className="px-2 py-1 text-sm underline text-stone-700 hover:bg-stone-200 rounded">
                  U
                </button>{" "}
                <div className="w-px bg-stone-300 mx-1"></div>{" "}
                <button className="px-2 py-1 text-sm text-stone-700 hover:bg-stone-200 rounded">
                  &lt;/&gt;
                </button>{" "}
              </div>{" "}
              <textarea
                ref={textareaRef}
                name="body"
                value={formData.body}
                onChange={handleChange}
                className="w-full flex-1 p-4 outline-none resize-y font-mono text-sm leading-relaxed text-stone-800"
                placeholder="Write your email content here..."
              />{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="space-y-6">
          {" "}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
            {" "}
            <h3 className="text-sm font-bold text-stone-900 mb-3 uppercase tracking-wide">
              Dynamic Variables
            </h3>{" "}
            <p className="text-xs text-stone-500 mb-4">
              Click to insert into the email body.
            </p>{" "}
            <div className="flex flex-wrap gap-2">
              {" "}
              {VARIABLES.map((v) => (
                <button
                  key={v}
                  onClick={() => insertVariable(v)}
                  className="px-2.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-mono hover:bg-blue-100 transition-colors"
                >
                  {" "}
                  {v}{" "}
                </button>
              ))}{" "}
            </div>{" "}
          </div>{" "}
          <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 flex flex-col gap-3">
            {" "}
            <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-stone-300 rounded-md text-stone-700 font-medium hover:bg-stone-50 transition-colors shadow-sm">
              {" "}
              <Save size={18} /> Save Draft{" "}
            </button>{" "}
            <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-stone-300 rounded-md text-stone-700 font-medium hover:bg-stone-50 transition-colors shadow-sm">
              {" "}
              <Play size={18} /> Preview Email{" "}
            </button>{" "}
            <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-stone-300 rounded-md text-stone-700 font-medium hover:bg-stone-50 transition-colors shadow-sm">
              {" "}
              <Send size={18} /> Send Test Email{" "}
            </button>{" "}
            <hr className="my-2 border-stone-200" />{" "}
            <button
              onClick={handlePublish}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-sm"
            >
              {" "}
              <CheckCircle size={18} /> Publish{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

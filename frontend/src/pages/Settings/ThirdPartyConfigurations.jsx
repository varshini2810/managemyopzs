import React from "react";
import { Blocks, CheckCircle2 } from "lucide-react";
export default function ThirdPartyConfigurations() {
  const integrations = [
    {
      name: "Salesforce CRM",
      desc: "Sync customers and subscriptions.",
      connected: true,
    },
    {
      name: "QuickBooks",
      desc: "Sync invoices, payments, and credit notes.",
      connected: false,
    },
    {
      name: "Zendesk",
      desc: "Show subscription info in tickets.",
      connected: false,
    },
    { name: "Avalara", desc: "Automate tax calculations.", connected: true },
    {
      name: "Google Analytics",
      desc: "Track checkout conversion events.",
      connected: false,
    },
    {
      name: "Mailchimp",
      desc: "Sync customer emails for marketing.",
      connected: false,
    },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      {" "}
      <div className="mb-2">
        {" "}
        <h2 className="text-base font-bold text-ink">
          Third Party Configurations
        </h2>{" "}
        <p className="text-sm text-muted mt-0.5">
          Connect Opz with your existing tech stack.
        </p>{" "}
      </div>{" "}
      <div className="grid grid-cols-3 gap-6">
        {" "}
        {integrations.map((int) => (
          <div
            key={int.name}
            className="card flex flex-col items-start gap-4 hover:shadow-md transition-shadow"
          >
            {" "}
            <div className="w-12 h-12 rounded bg-stone-100 flex items-center justify-center text-muted">
              {" "}
              <Blocks size={24} />{" "}
            </div>{" "}
            <div>
              {" "}
              <div className="font-semibold text-ink text-base">
                {int.name}
              </div>{" "}
              <div className="text-sm text-muted mt-1">{int.desc}</div>{" "}
            </div>{" "}
            <div className="mt-auto pt-4 w-full">
              {" "}
              {int.connected ? (
                <div className="flex items-center justify-between w-full">
                  {" "}
                  <span className="text-sm font-medium text-success flex items-center gap-1">
                    {" "}
                    <CheckCircle2 size={16} /> Connected{" "}
                  </span>{" "}
                  <button className="btn-ghost btn-sm text-danger hover:text-danger hover:bg-red-50">
                    Disconnect
                  </button>{" "}
                </div>
              ) : (
                <button className="btn-secondary w-full">Connect</button>
              )}{" "}
            </div>{" "}
          </div>
        ))}{" "}
      </div>{" "}
    </div>
  );
}

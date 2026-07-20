import React from "react";
export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  actionColor = "accent",
}) {
  const btnClass =
    actionColor === "success"
      ? "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-card bg-success text-white hover:bg-green-700 transition-colors shadow-sm"
      : "btn-primary rounded-button"; // Using btn-primary from our css return ( <div className="bg-surface rounded-button p-6 shadow-sm border border-border flex items-center justify-between mb-6"> <div className="flex items-center gap-4"> {Icon && ( <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0"> <Icon size={24} /> </div> )} <div> <h1 className="text-2xl font-display font-bold text-ink tracking-tight">{title}</h1> {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>} </div> </div> {actionLabel && ( <button onClick={onAction} className={btnClass} > {ActionIcon && <ActionIcon size={16} />} {actionLabel} </button> )} </div> );
}

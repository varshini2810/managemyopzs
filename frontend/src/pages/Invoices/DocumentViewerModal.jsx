import React from "react";
import { X, ExternalLink } from "lucide-react";
import Modal from "../../components/common/Modal";
export default function DocumentViewerModal({ isOpen, onClose, document }) {
  if (!document) return null;
  const isImage =
    document.type?.startsWith("image/") ||
    document.url?.match(/\.(jpeg|jpg|gif|png)$/i);
  const isPdf =
    document.type === "application/pdf" || document.url?.match(/\.pdf$/i);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`View Document: ${document.name}`}
    >
      {" "}
      <div className="flex flex-col h-[70vh]">
        {" "}
        <div className="flex-1 bg-gray-100 rounded-card border border-gray-200 overflow-hidden flex items-center justify-center relative">
          {" "}
          {isImage ? (
            <img
              src={document.url}
              alt={document.name}
              className="max-w-full max-h-full object-contain"
            />
          ) : isPdf ? (
            <iframe
              src={document.url}
              title={document.name}
              className="w-full h-full border-0"
            />
          ) : (
            <div className="text-muted flex flex-col items-center">
              {" "}
              <p>Preview not available for this file type.</p>{" "}
              <a
                href={document.url}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary mt-4"
              >
                {" "}
                <ExternalLink size={14} /> Open in New Tab{" "}
              </a>{" "}
            </div>
          )}{" "}
        </div>{" "}
        <div className="mt-4 flex justify-between items-center">
          {" "}
          <p className="text-sm text-muted">{document.name}</p>{" "}
          <a href={document.url} download className="btn-primary">
            Download
          </a>{" "}
        </div>{" "}
      </div>{" "}
    </Modal>
  );
}

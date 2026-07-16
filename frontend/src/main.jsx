import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
import "./index.css";
import App from "./App.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", height: "100vh", fontFamily: "sans-serif",
          background: "#f8fafc", padding: "2rem", textAlign: "center"
        }}>
          <h1 style={{ color: "#1e293b", fontSize: "1.5rem", marginBottom: "1rem" }}>
            Something went wrong
          </h1>
          <pre style={{
            background: "#fee2e2", color: "#991b1b", padding: "1rem",
            borderRadius: "8px", fontSize: "0.8rem", maxWidth: "600px",
            overflowX: "auto", textAlign: "left"
          }}>
            {this.state.error?.message || "Unknown error"}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1.5rem", padding: "0.5rem 1.5rem",
              background: "#0f172a", color: "#fff", border: "none",
              borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem"
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

import React from "react"; // Auth removed — pass-through, renders children unconditionally
export default function RequirePermission({ children }) {
  return <>{children}</>;
}

# End-to-End Live Testing: Client Onboarding
**Date**: 2026-06-19
**Tester Role**: Ultrasuperadmin (`admin@billingplatform.com`)

## Environment Setup
1. **Frontend**: Ensure Vite is running (`npm run dev`).
2. **Backend**: Ensure Spring Boot is running.
3. **Database**: Ensure Flyway migrations up to `V17__add_tenant_id_to_phase34.sql` are applied successfully.

---

## Phase 1: Security & Multi-Tenancy Validation
1. **Log in** as `admin@billingplatform.com` (Ultrasuperadmin).
2. **Verify Workspace**: Confirm that you are operating within a valid tenant workspace.
3. **Navigate to Customers**: Ensure the Customers list is visible and only shows records for the current tenant.

---

## Phase 2: Form Validation (Bug 2 Fix)
1. Navigate to **Invoices > Create Invoice**.
2. **Empty Submission Test**: 
   - Without filling any fields, click "Continue" or "Next".
   - **Expected**: Progression is blocked. Zod schema validation kicks in and displays inline red error messages (e.g., "Name is required", "Valid email is required").
3. **Partial Submission Test**:
   - Fill out "Name" but leave "Company Name" and "GST Number" blank.
   - Click "Continue".
   - **Expected**: Progression is blocked. The missing fields are highlighted.
4. **Valid Submission**: Fill all mandatory fields correctly and proceed to Step 2.
5. **Line Item Validation**:
   - Attempt to proceed with a $0 price or 0 quantity.
   - **Expected**: Progression is blocked.

---

## Phase 3: Invoice Generation (Bug 1 Fix)
1. Complete the wizard steps and reach Step 3 (Review).
2. Select a valid Due Date.
3. Click **"Generate Invoice"**.
4. **Expected Backend Behavior**:
   - The system executes an `UPSERT` to atomically generate the sequence number (e.g., `INV-TEN-2026-000001`).
   - The invoice and line items are saved to the database.
   - The frontend displays a success toast and redirects to the Invoices list.
5. **Verification**: 
   - Check the backend logs. You should see SLF4J outputs: `Starting invoice creation flow`, `Successfully generated invoice number`, and `Successfully committed invoice`.

---

## Phase 4: Search Standardization (Bug 4 Fix)
1. Navigate to the **Customers** tab.
2. In the search bar, type a part of a customer's `companyName` or `vatNumber`.
3. **Expected**: The search is debounced (300ms delay) and filters the table correctly by hitting the backend with `search={term}`.
4. Navigate to the **Invoices** tab.
5. In the search bar, type a part of the newly created customer's name.
6. **Expected**: The table filters and displays the invoice belonging to that customer (via the new JPQL cross-table search logic).

---

## Phase 5: UI Alignment (Bug 3 Fix)
1. On the **Invoices** list, observe the "Status" column.
2. **Expected**: The invoice status (`POSTED`) and payment status (`SENT` or `PENDING`) are displayed using the standardized `<StatusBadge>` component with a colored dot and text, properly inline-flex aligned (no overlapping or absolute positioning).
3. Navigate to **Logs > Webhook Logs**.
4. **Expected**: The status column displays the success/failure state using the standardized `<StatusBadge>` component.

---

## Conclusion
If all steps pass, the critical blocking bugs for the MVP onboarding flow are resolved, data isolation is guaranteed, and the system is ready for client onboarding.

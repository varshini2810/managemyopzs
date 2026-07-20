const fs = require('fs');
const file = 'd:\\managemyfinance\\frontend\\src\\pages\\Expenses\\Expenses.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import api')) {
    content = content.replace('import toast', 'import api from "../../services/api";\nimport GlobalTenantGuard from "../../components/GlobalTenantGuard";\nimport toast');
}

// 1. Change useState(SEED_EXPENSES) to [] and add useEffect to fetch
content = content.replace('const [expenses, setExpenses] = useState(SEED_EXPENSES);', \const [expenses, setExpenses] = useState([]);
  
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get("/expenses");
        setExpenses(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load expenses");
      }
    };
    fetchExpenses();
  }, []);\);

// 2. Update handleSave
const handleSaveRegex = /const handleSave = \\(exp\\) => \\{[\\s\\S]*?toast\\.success\\([\\s\\S]*?\\);[\\s\\n]*\\};/;
const newHandleSave = \const handleSave = async (exp) => {
    try {
      if (exp.id && expenses.find(e => e.id === exp.id)) {
        const res = await api.put(\\\/expenses/\\\\, exp);
        setExpenses((prev) => prev.map(e => e.id === exp.id ? res.data : e));
      } else {
        const res = await api.post("/expenses", exp);
        setExpenses((prev) => [res.data, ...prev]);
      }
      setAddOpen(false);
      setEditExp(null);
      toast.success(exp.status === "draft" ? "Draft saved" : "Expense recorded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save expense");
    }
  };\;
content = content.replace(handleSaveRegex, newHandleSave);

// 3. Update handleSaveAndAdd
const handleSaveAndAddRegex = /const handleSaveAndAdd = \\(exp\\) => \\{[\\s\\S]*?setTimeout\\(\(\) => setAddOpen\\(true\\), 50\\);[\\s\\n]*\\};/;
const newHandleSaveAndAdd = \const handleSaveAndAdd = async (exp) => {
    try {
      const res = await api.post("/expenses", exp);
      setExpenses((prev) => [res.data, ...prev]);
      toast.success("Saved! Add another expense.");
      setTimeout(() => setAddOpen(true), 50);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save expense");
    }
  };\;
content = content.replace(handleSaveAndAddRegex, newHandleSaveAndAdd);

// 4. Update handleDelete
const handleDeleteRegex = /const handleDelete = \\(\\) => \\{[\\s\\S]*?toast\\("Undo\\?", \\{[\\s\\S]*?onClick: \\(\\) => \\{[\\s\\S]*?clearTimeout\\(undoTimer\\);[\\s\\S]*?\\},[\\s\\S]*?\\}\\);[\\s\\n]*\\};/;
const newHandleDelete = \const handleDelete = async () => {
    try {
      const id = deleteExp.id;
      await api.delete(\\\/expenses/\\\\);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast.success("Expense deleted");
      setDeleteExp(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete expense");
    }
  };\;
content = content.replace(handleDeleteRegex, newHandleDelete);

// 5. Update handleApprove
const handleApproveRegex = /const handleApprove = \\(exp\\) => \\{[\\s\\S]*?toast\\.success\\("Expense approved"\\);[\\s\\n]*\\};/;
const newHandleApprove = \const handleApprove = async (exp) => {
    try {
      const res = await api.put(\\\/expenses/\\\\, { ...exp, status: "approved" });
      setExpenses((prev) => prev.map((e) => (e.id === exp.id ? res.data : e)));
      toast.success("Expense approved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve expense");
    }
  };\;
content = content.replace(handleApproveRegex, newHandleApprove);

// 6. Update handleReject
const handleRejectRegex = /const handleReject = \\(exp\\) => \\{[\\s\\S]*?toast\\.error\\("Expense rejected"\\);[\\s\\n]*\\};/;
const newHandleReject = \const handleReject = async (exp) => {
    try {
      const res = await api.put(\\\/expenses/\\\\, { ...exp, status: "rejected" });
      setExpenses((prev) => prev.map((e) => (e.id === exp.id ? res.data : e)));
      toast.success("Expense rejected");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject expense");
    }
  };\;
content = content.replace(handleRejectRegex, newHandleReject);

// 7. Update export
if (content.includes('export default function Expenses')) {
  content = content.replace('export default function Expenses', 'function Expenses');
  content = content + '\\nexport default function ExpensesWithGuard() { return <GlobalTenantGuard><Expenses /></GlobalTenantGuard>; }\\n';
}

fs.writeFileSync(file, content, 'utf8');
console.log('Expenses.jsx updated successfully');

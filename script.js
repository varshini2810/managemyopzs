const fs = require('fs');
const file = 'd:\\managemyfinance\\frontend\\src\\pages\\Expenses\\Expenses.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add imports
if (!content.includes('import api from "../../services/api";')) {
    content = content.replace('import toast from "react-hot-toast";', 
        'import api from "../../services/api";\nimport GlobalTenantGuard from "../../components/GlobalTenantGuard";\nimport toast from "react-hot-toast";');
}

// Replace state
content = content.replace('const [expenses, setExpenses] = useState(SEED);',
\const [expenses, setExpenses] = useState([]);
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get('/expenses');
        setExpenses(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load expenses');
      }
    };
    fetchExpenses();
  }, []);\);

// Replace handleSave
content = content.replace(
/const handleSave = \\(exp\\) => \\{[\\s\\S]*?toast\\.success\\([\\s\\S]*?\\);\\s*\\};/,
\const handleSave = async (exp) => {
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
  };\);

// Replace handleSaveAndAdd
content = content.replace(
/const handleSaveAndAdd = \\(exp\\) => \\{[\\s\\S]*?setTimeout\\(\(\) => setAddOpen\\(true\\), 50\\);\\s*\\};/,
\const handleSaveAndAdd = async (exp) => {
    try {
      const res = await api.post("/expenses", exp);
      setExpenses((prev) => [res.data, ...prev]);
      toast.success("Saved! Add another expense.");
      setTimeout(() => setAddOpen(true), 50);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save expense");
    }
  };\);

// Replace handleDelete
content = content.replace(
/const handleDelete = \\(\\) => \\{[\\s\\S]*?toast\\("Undo\\?", \\{[\\s\\S]*?onClick: \\(\\) => \\{[\\s\\S]*?clearTimeout\\(undoTimer\\);\\s*\\},\\s*\\}\\);\\s*\\};/,
\const handleDelete = async () => {
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
  };\);

// Replace handleApprove
content = content.replace(
/const handleApprove = \\(exp\\) => \\{[\\s\\S]*?toast\\.success\\("Expense approved"\\);\\s*\\};/,
\const handleApprove = async (exp) => {
    try {
      const res = await api.put(\\\/expenses/\\\\, { ...exp, status: "approved" });
      setExpenses((prev) => prev.map((e) => (e.id === exp.id ? res.data : e)));
      toast.success("Expense approved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve expense");
    }
  };\);

// Export Guard
if (content.includes('export default function ExpenseManagement() {')) {
    content = content.replace('export default function ExpenseManagement() {', 'function ExpenseManagement() {');
    content += '\\nexport default function ExpenseManagementWithGuard() { return <GlobalTenantGuard><ExpenseManagement /></GlobalTenantGuard>; }\\n';
}

fs.writeFileSync(file, content, 'utf8');
console.log('done');

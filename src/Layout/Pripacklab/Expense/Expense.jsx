import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { base_url } from '../../../Config/config';
import '../../../styles/productview.css';

const CATEGORIES = [
  '1️⃣ Cost of Goods Sold (COGS)',
  '2️⃣ Shipping & Fulfillment',
  '3️⃣ Marketing & Advertising',
  '4️⃣ Technology & Software',
  '5️⃣ Payroll & Contractors',
  '6️⃣ Office & Administrative',
  '7️⃣ Payment Processing Fees',
  '8️⃣ Financial & Legal',
  '9️⃣ Communication & Support',
  '🔟 Miscellaneous',
];

const emptyForm = {
  category: '',
  title: '',
  description: '',
  date: '',
  amount: '',
  note: '',
  spender: '',
};

const PExpense = () => {
  const [salesData, setSalesData]   = useState([]);
  const [form, setForm]             = useState(emptyForm);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [isEditing, setIsEditing]   = useState(false);
  const [editId, setEditId]         = useState(null);
  const [search, setSearch]         = useState('');

  // ── Fetch ──────────────────────────────────────────────
  const fetchExpenses = () => {
    fetch(`${base_url}/getexpenses`)
      .then(res => res.json())
      .then(data => setSalesData(data))
      .catch(err => console.error('Fetch error:', err));
  };

  useEffect(() => { fetchExpenses(); }, []);

  // ── Handlers ───────────────────────────────────────────
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use FormData so we can send the invoice file
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (invoiceFile) formData.append('invoice', invoiceFile);

    const url    = isEditing ? `${base_url}/updateexpense/${editId}` : `${base_url}/addexpense`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res  = await fetch(url, { method, body: formData });
      const data = await res.json();

      const success = isEditing ? data.modifiedCount > 0 : !!data.insertedId;
      if (success) {
        Swal.fire(
          isEditing ? 'Updated!' : 'Added!',
          isEditing ? 'Expense updated successfully.' : 'Expense added successfully.',
          'success'
        );
        setForm(emptyForm);
        setInvoiceFile(null);
        setIsEditing(false);
        setEditId(null);
        fetchExpenses();
      } else {
        Swal.fire('No Changes', 'No changes were detected.', 'info');
      }
    } catch {
      Swal.fire('Error!', 'An unexpected error occurred.', 'error');
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setInvoiceFile(null); // reset file picker; existing invoice kept unless replaced
    setForm({
      category:    item.category,
      title:       item.title,
      description: item.description,
      date:        item.date,
      amount:      item.amount,
      note:        item.note,
      spender:     item.spender,
    });
    // Scroll form into view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?', text: "You won't be able to revert this!",
      icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!',
    });
    if (!confirm.isConfirmed) return;

    try {
      const res  = await fetch(`${base_url}/delxpense/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.deletedCount > 0) {
        Swal.fire('Deleted!', 'Expense deleted.', 'success');
        fetchExpenses();
      } else {
        Swal.fire('Error', 'Failed to delete expense.', 'error');
      }
    } catch {
      Swal.fire('Error', 'An error occurred.', 'error');
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setInvoiceFile(null);
    setForm(emptyForm);
  };

  // ── Derived ────────────────────────────────────────────
  const filtered = salesData.filter(item =>
    [item.title, item.category, item.spender, item.description]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalAmount = salesData.reduce((sum, i) => sum + Number(i.amount || 0), 0);

  // ── Export ─────────────────────────────────────────────
  const exportToExcel = () => {
    const data = salesData.map(item => ({
      Category:    item.category,
      Title:       item.title,
      Description: item.description,
      Date:        item.date,
      Amount:      item.amount,
      Spender:     item.spender,
      Note:        item.note,
      Invoice:     item.invoice ? `${base_url}${item.invoice}` : 'N/A',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    XLSX.writeFile(wb, 'expenses.xlsx');
  };

  // ── UI ─────────────────────────────────────────────────
  return (
    <div className="w-full">
      <h1 className="text-[40px] bg-[#010103] text-white pl-4">Expense</h1>

      <div className="flex flex-row p-2 w-full gap-4">

        {/* ── Form ── */}
        <div className="flex flex-col gap-2 p-2  shrink-0">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">

            {/* Category dropdown */}
            <label className="lbl">
              <span>Category</span>
              <select name="category" className="grow" value={form.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>

            {/* Text fields */}
            {[
              { label: 'Title',       name: 'title',       type: 'text' },
              { label: 'Description', name: 'description', type: 'text' },
              { label: 'Date',        name: 'date',        type: 'date' },
              { label: 'Amount',      name: 'amount',      type: 'number' },
              { label: 'Spender',     name: 'spender',     type: 'text' },
            ].map(({ label, name, type }) => (
              <label key={name} className="lbl">
                <span>{label}</span>
                <input
                  type={type} name={name} className="grow"
                  placeholder={label} value={form[name]}
                  onChange={handleChange} required
                />
              </label>
            ))}

            {/* Note (textarea, optional) */}
            <label className="lbl">
              <span>Note</span>
              <textarea
                name="note" className="grow" placeholder="Optional note..."
                value={form.note} onChange={handleChange} rows={2}
              />
            </label>

            {/* Invoice uploader (optional) */}
            <label className="lbl flex-col items-start">
              <span>Invoice <span className="text-gray-400 text-xs">(optional)</span></span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="file-input file-input-bordered file-input-sm w-full mt-1"
                onChange={e => setInvoiceFile(e.target.files[0] || null)}
              />
              {/* Show existing invoice link when editing */}
              {isEditing && !invoiceFile && (() => {
                const existing = salesData.find(i => i._id === editId)?.invoice;
                return existing ? (
                  <a href={`${base_url}${existing}`} target="_blank" rel="noreferrer"
                    className="text-xs text-blue-500 underline mt-1">
                    View current invoice
                  </a>
                ) : null;
              })()}
            </label>

            <button type="submit" className="btn mt-10 btn-sm w-[200px]">
              {isEditing ? 'Update Expense' : 'Add Expense'}
            </button>

            {isEditing && (
              <button type="button" onClick={cancelEdit}
                className="btn btn-sm w-full bg-red-500 text-white">
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* ── Table ── */}
        <div className="w-full p-2 overflow-x-auto">

          {/* Toolbar */}
          <div className="bg-white pl-2 mb-2 flex flex-row justify-between items-center">
            <div>
              <button className="smbut mr-2">Import</button>
              <button className="smbut" onClick={exportToExcel}>Export</button>
            </div>
            <div className="w-[300px]">
              <label className="input input-bordered flex input-sm items-center gap-2">
                <input type="text" className="grow" placeholder="Search"
                  value={search} onChange={e => setSearch(e.target.value)} />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                  fill="currentColor" className="h-4 w-4 opacity-70">
                  <path fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd" />
                </svg>
              </label>
            </div>
          </div>

          {/* Header */}
          <div className="tabst">
            <div>Category</div>
            <div>Title</div>
            <div>Description</div>
            <div>Date</div>
            <div>Amount</div>
            <div>Note & Invoice</div>
            <div>Actions</div>
          </div>

          {/* Rows */}
          <div className="flex flex-col">
            {filtered.map((item, index) => (
              <div className="tabc" key={index}>
                <div>{item.category}</div>
                <div>{item.title}</div>
                <div>{item.description}</div>
                <div>{item.date}</div>
                <div>${Number(item.amount || 0).toLocaleString()}-{item.spender}</div>
               
                <div>{item.note}
                  {item.invoice
                    ? <a href={`${base_url}${item.invoice}`} target="_blank"
                        rel="noreferrer" className="text-blue-500 underline text-sm">
                        View
                      </a>
                    : <span className="text-gray-400 text-sm">—</span>
                  }
                </div>
                <div className="flex gap-1">
                  <button className="smbut" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="smbut" onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="total-income mt-4">
            <p><strong>Total Expenses: ${totalAmount.toLocaleString()}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PExpense;
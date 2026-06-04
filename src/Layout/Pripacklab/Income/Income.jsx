import { useState, useEffect } from 'react';
import '../../../styles/productview.css';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { base_url } from '../../../Config/config';

const INCOME_CATEGORIES = [
  'Product Sales', 'Service Revenue', 'Subscription',
  'Wholesale', 'Custom Order',
];

const emptyForm = {
  category: '', title: '', description: '',
  date: '', amount: '', note: '', source: '',
};

const PIncome = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [form, setForm]             = useState(emptyForm);
  const [isEditing, setIsEditing]   = useState(false);
  const [editId, setEditId]         = useState(null);
  const [search, setSearch]         = useState('');
  const [modalOpen, setModalOpen]   = useState(false);

  const fetchIncomes = () => {
    fetch(`${base_url}/getincomes`)
      .then(res => res.json())
      .then(data => setIncomeData(data))
      .catch(err => console.error('Fetch error:', err));
  };

  useEffect(() => { fetchIncomes(); }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setForm({
      category: item.category, title: item.title,
      description: item.description, date: item.date,
      amount: item.amount, note: item.note, source: item.source,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setIsEditing(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url    = isEditing ? `${base_url}/updateincome/${editId}` : `${base_url}/addincome`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      const success = isEditing ? data.modifiedCount > 0 : !!data.insertedId;
      if (success) {
        Swal.fire(isEditing ? 'Updated!' : 'Added!',
          isEditing ? 'Income entry updated.' : 'Income entry added.', 'success');
        closeModal();
        fetchIncomes();
      } else {
        Swal.fire('No Changes', 'No changes were detected.', 'info');
      }
    } catch {
      Swal.fire('Error!', 'An unexpected error occurred.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete entry?', text: "This can't be undone.",
      icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!',
    });
    if (!confirm.isConfirmed) return;

    try {
      const res  = await fetch(`${base_url}/delincome/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.deletedCount > 0) {
        Swal.fire('Deleted!', 'Income entry deleted.', 'success');
        fetchIncomes();
      } else {
        Swal.fire('Error', 'Failed to delete.', 'error');
      }
    } catch {
      Swal.fire('Error', 'An error occurred.', 'error');
    }
  };

  const filtered = incomeData.filter(item =>
    [item.title, item.category, item.source, item.description]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalIncome = incomeData.reduce((sum, i) => sum + Number(i.amount || 0), 0);

  const exportToExcel = () => {
    const data = incomeData.map(item => ({
      Category: item.category, Title: item.title,
      Description: item.description, Date: item.date,
      Amount: item.amount, Source: item.source, Note: item.note,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Income Data');
    XLSX.writeFile(wb, 'income_data.xlsx');
  };

  return (
    <div className="w-full">
      <h1 className="text-[40px] bg-[#010103] text-white pl-4">Income</h1>

      <div className="w-full p-2">

        {/* Toolbar */}
        <div className="bg-white pl-2 mb-2 flex flex-row justify-between items-center">
          <div className="flex gap-2">
            <button className="smbut" onClick={openAddModal}>+ Add Income</button>
            <button className="smbut">Import</button>
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

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="tabst">
            <div>Category</div>
            <div>Title</div>
            <div>Description</div>
            <div>Date</div>
            <div>Amount</div>
            <div>Source</div>
            <div>Note</div>
            <div>Actions</div>
          </div>

          <div className="flex flex-col">
            {filtered.length === 0 && (
              <div className="text-center text-gray-400 py-8">No income entries found.</div>
            )}
            {filtered.map((item, index) => (
              <div className="tabc" key={index}>
                <div>{item.category}</div>
                <div>{item.title}</div>
                <div>{item.description}</div>
                <div>{item.date}</div>
                <div>${Number(item.amount || 0).toLocaleString()}</div>
                <div>{item.source}</div>
                <div>{item.note}</div>
                <div className="flex gap-1">
                  <button className="smbut" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="smbut" onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pl-2">
            <p><strong>Total Income: ${totalIncome.toLocaleString()}</strong></p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {isEditing ? 'Edit Income' : 'Add Income'}
              </h2>
              <button onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">

              <label className="lbl">
                <span>Category</span>
                <select name="category" className="pridrop" value={form.category} onChange={handleChange} required>
                  <option value="">Select category</option>
                  {INCOME_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>

              {[
                { label: 'Title',  name: 'title',  type: 'text'   },
                { label: 'Date',   name: 'date',   type: 'date'   },
                { label: 'Amount', name: 'amount', type: 'number' },
                { label: 'Source', name: 'source', type: 'text'   },
              ].map(({ label, name, type }) => (
                <label key={name} className="lbl">
                  <span>{label}</span>
                  <input
                    type={type} name={name} className="priinput"
                    placeholder={label} value={form[name]}
                    onChange={handleChange} required
                  />
                </label>
              ))}

              <label className="lbl">
                <span>Description</span>
                <textarea name="description" className="pritextarea"
                  placeholder="Optional description..." value={form.description}
                  onChange={handleChange} rows={2} />
              </label>

              <label className="lbl">
                <span>Note</span>
                <textarea name="note" className="pritextarea"
                  placeholder="Optional note..." value={form.note}
                  onChange={handleChange} rows={2} />
              </label>

              <div className="flex gap-2 mt-2">
                <button type="submit" className="pributton flex-1">
                  {isEditing ? 'Update Income' : 'Add Income'}
                </button>
                <button type="button" onClick={closeModal}
                  className="btn flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 border-0">
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PIncome;
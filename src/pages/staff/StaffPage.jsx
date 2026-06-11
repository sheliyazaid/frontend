import { useState, useEffect, useCallback } from 'react';
import { Plus, Shield, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersApi } from '../../api/users';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';

export default function StaffPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [createdCreds, setCreatedCreds] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', mobile: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.listWatchmen({ page, limit: 20 });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await usersApi.createWatchman(form);
      setCreatedCreds({ email: form.email, password: form.password, name: form.name });
      toast.success('Watchman account created');
      setModalOpen(false);
      setForm({ name: '', email: '', password: '', mobile: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create account');
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this watchman account?')) return;
    try {
      await usersApi.deactivate(id);
      toast.success('Account deactivated');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const generatePassword = () => {
    const pwd = `wm${Math.random().toString(36).slice(2, 8)}`;
    setForm((f) => ({ ...f, password: pwd }));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Watchman Accounts</h1>
          <p className="mt-1 text-sm text-slate-500">Create login credentials for gate watchmen</p>
        </div>
        <button type="button" onClick={() => { setCreatedCreds(null); setModalOpen(true); }} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Watchman
        </button>
      </div>

      {createdCreds && (
        <div className="card mb-6 border-emerald-200 bg-emerald-50">
          <p className="font-semibold text-emerald-800">Account created — share these credentials with watchman:</p>
          <div className="mt-2 space-y-1 text-sm text-emerald-900">
            <p><strong>Name:</strong> {createdCreds.name}</p>
            <p><strong>Email:</strong> {createdCreds.email}</p>
            <p><strong>Password:</strong> {createdCreds.password}</p>
          </div>
        </div>
      )}

      <div className="card !p-0 overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <>
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50/80">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email (Login)</th>
                  <th className="px-4 py-3 font-semibold">Mobile</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-brand-500" />
                        {row.name}
                      </div>
                    </td>
                    <td className="px-4 py-3">{row.email}</td>
                    <td className="px-4 py-3">{row.mobile || '—'}</td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => handleDeactivate(row._id)} className="rounded p-1 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length === 0 && (
              <p className="p-8 text-center text-sm text-slate-400">No watchman accounts yet. Create one for gate access.</p>
            )}
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Watchman Account">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label-text">Full Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="label-text">Email (used for login) *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="watchman1@society.com" required />
          </div>
          <div>
            <label className="label-text">Mobile</label>
            <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="input-field" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="label-text">Password *</label>
              <button type="button" onClick={generatePassword} className="text-xs text-brand-600 hover:underline">Generate</button>
            </div>
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" minLength={6} required />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Account</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

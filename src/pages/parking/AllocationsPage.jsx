import { useState, useEffect, useCallback } from 'react';
import { Key, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { allocationsApi, slotsApi } from '../../api/parking';
import { flatsApi, ownersApi } from '../../api/members';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';

export default function AllocationsPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [slots, setSlots] = useState([]);
  const [flats, setFlats] = useState([]);
  const [form, setForm] = useState({ slotId: '', flatId: '', vehicleNumber: '', holderName: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await allocationsApi.list({ page, limit: 20 });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
    slotsApi.available().then((r) => setSlots(r.data.data));
    flatsApi.list({ limit: 500 }).then((r) => setFlats(r.data.data));
  }, [fetchData]);

  const onFlatChange = async (flatId) => {
    setForm((f) => ({ ...f, flatId, holderName: '' }));
    if (!flatId) return;
    try {
      const res = await ownersApi.list({ flatId, limit: 10 });
      const owners = res.data.data || [];
      const primary = owners.find((o) => o.isPrimary) || owners[0];
      if (primary) {
        setForm((f) => ({ ...f, flatId, holderName: primary.fullName }));
      }
    } catch {
      /* flat may have no owner yet */
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await allocationsApi.create(form);
      toast.success('Parking assigned successfully');
      setModalOpen(false);
      setForm({ slotId: '', flatId: '', vehicleNumber: '', holderName: '' });
      fetchData();
      slotsApi.available().then((r) => setSlots(r.data.data));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleRelease = async (id) => {
    if (!window.confirm('Release this parking assignment?')) return;
    try {
      await allocationsApi.release(id, 'Released by secretary');
      toast.success('Parking released');
      fetchData();
      slotsApi.available().then((r) => setSlots(r.data.data));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assign Parking</h1>
          <p className="mt-1 text-sm text-slate-500">Assign parking slot to resident vehicle</p>
        </div>
        <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> Assign Parking
        </button>
      </div>

      <div className="card !p-0 overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <>
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50/80">
                <tr>
                  <th className="px-4 py-3 font-semibold">Vehicle</th>
                  <th className="px-4 py-3 font-semibold">Owner</th>
                  <th className="px-4 py-3 font-semibold">Flat</th>
                  <th className="px-4 py-3 font-semibold">Parking Slot</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium">{row.vehicleNumber || row.vehicleId?.vehicleNumber}</td>
                    <td className="px-4 py-3">{row.holderName || '-'}</td>
                    <td className="px-4 py-3">{row.flatId?.flatNumber || '-'}</td>
                    <td className="px-4 py-3">{row.slotId?.slotNumber || '-'}</td>
                    <td className="px-4 py-3"><StatusBadge status={row.allocationStatus} /></td>
                    <td className="px-4 py-3">
                      {row.allocationStatus === 'Active' && (
                        <button type="button" onClick={() => handleRelease(row._id)} className="text-xs font-medium text-amber-600 hover:underline">Release</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Assign Parking">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label-text">Flat *</label>
            <select value={form.flatId} onChange={(e) => onFlatChange(e.target.value)} className="input-field" required>
              <option value="">Select flat</option>
              {flats.map((f) => <option key={f._id} value={f._id}>{f.flatNumber}</option>)}
            </select>
          </div>
          <div>
            <label className="label-text">Vehicle Number *</label>
            <input value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value.toUpperCase() })} className="input-field" placeholder="MH01AB1234" required />
          </div>
          <div>
            <label className="label-text">Owner / Resident Name *</label>
            <input value={form.holderName} onChange={(e) => setForm({ ...form, holderName: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="label-text">Parking Slot *</label>
            <select value={form.slotId} onChange={(e) => setForm({ ...form, slotId: e.target.value })} className="input-field" required>
              <option value="">Select available slot</option>
              {slots.map((s) => <option key={s._id} value={s._id}>{s.slotNumber} ({s.floor})</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary"><Key className="h-4 w-4" /> Assign</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

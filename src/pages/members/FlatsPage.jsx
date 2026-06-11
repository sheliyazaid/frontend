import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2, Search, Eye, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { flatsApi } from '../../api/members';
import { flatSchema } from '../../lib/schemas';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';

export default function FlatsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [flatStatus, setFlatStatus] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(flatSchema),
    defaultValues: {
      flatNumber: '',
      wing: '',
      floor: 0,
      flatStatus: 'Vacant',
      notes: '',
    },
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await flatsApi.list({ page, limit: 20, search, flatStatus: flatStatus || undefined });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load flats');
    } finally {
      setLoading(false);
    }
  }, [page, search, flatStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setEditing(null);
    reset({ flatNumber: '', wing: '', floor: 0, flatStatus: 'Vacant', notes: '' });
    setModalOpen(true);
  };

  const openEdit = (flat) => {
    setEditing(flat);
    reset({
      flatNumber: flat.flatNumber,
      wing: flat.wing,
      floor: flat.floor,
      flatStatus: flat.flatStatus,
      notes: flat.notes,
    });
    setModalOpen(true);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await flatsApi.update(editing._id, formData);
        toast.success('Flat updated');
      } else {
        await flatsApi.create(formData);
        toast.success('Flat created');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this flat?')) return;
    try {
      await flatsApi.remove(id);
      toast.success('Flat deleted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Flats</h1>
          <p className="mt-1 text-sm text-slate-500">Manage all society flats</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Flat
        </button>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="flex flex-wrap gap-3 border-b border-surface-border p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search flats..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-10"
            />
          </div>
          <select
            value={flatStatus}
            onChange={(e) => { setFlatStatus(e.target.value); setPage(1); }}
            className="input-field w-auto"
          >
            <option value="">All Status</option>
            <option value="Occupied">Occupied</option>
            <option value="Vacant">Vacant</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : data.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No flats yet"
            description="Add your first flat to get started."
            action={<button type="button" onClick={openCreate} className="btn-primary"><Plus className="h-4 w-4" />Add Flat</button>}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-surface-border bg-slate-50/80">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-600">Flat Number</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Wing</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Floor</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {data.map((flat) => (
                    <tr key={flat._id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">{flat.flatNumber}</td>
                      <td className="px-4 py-3 text-slate-700">{flat.wing || '-'}</td>
                      <td className="px-4 py-3 text-slate-700">{flat.floor}</td>
                      <td className="px-4 py-3"><StatusBadge status={flat.flatStatus} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button type="button" onClick={() => navigate(`/members/flat360/${flat._id}`)} className="rounded-lg p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-600" title="Flat 360">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => openEdit(flat)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => handleDelete(flat._id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Flat' : 'Add Flat'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text">Flat Number *</label>
              <input {...register('flatNumber')} className="input-field" />
              {errors.flatNumber && <p className="mt-1 text-xs text-red-500">{errors.flatNumber.message}</p>}
            </div>
            <div>
              <label className="label-text">Wing</label>
              <input {...register('wing')} className="input-field" />
            </div>
            <div>
              <label className="label-text">Floor</label>
              <input type="number" {...register('floor')} className="input-field" />
            </div>
            <div>
              <label className="label-text">Status</label>
              <select {...register('flatStatus')} className="input-field">
                <option value="Occupied">Occupied</option>
                <option value="Vacant">Vacant</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-text">Notes</label>
            <textarea {...register('notes')} rows={3} className="input-field" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

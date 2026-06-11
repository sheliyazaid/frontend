import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import Pagination from '../ui/Pagination';
import { flatsApi } from '../../api/members';

export default function MemberCrudPage({
  title,
  description,
  columns,
  api,
  schema,
  defaultValues,
  renderForm,
  emptyIcon,
  filters,
  getFlatLink,
}) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [flats, setFlats] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.list({ page, limit: 20, search, ...filterValues });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [api, page, search, filterValues]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    flatsApi.list({ limit: 500 }).then((res) => setFlats(res.data.data));
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset(defaultValues);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    const values = { ...defaultValues };
    Object.keys(defaultValues).forEach((key) => {
      if (item[key] !== undefined) {
        values[key] = item[key]?._id || item[key];
      }
    });
    reset(values);
    setModalOpen(true);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await api.update(editing._id, formData);
        toast.success('Updated successfully');
      } else {
        await api.create(formData);
        toast.success('Created successfully');
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
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.remove(id);
      toast.success('Deleted successfully');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add New
        </button>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-surface-border p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input-field pl-10"
            />
          </div>
          {filters?.map((filter) => (
            <select
              key={filter.key}
              value={filterValues[filter.key] || ''}
              onChange={(e) => {
                setFilterValues((prev) => ({
                  ...prev,
                  [filter.key]: e.target.value || undefined,
                }));
                setPage(1);
              }}
              className="input-field w-auto min-w-[140px]"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : data.length === 0 ? (
          <EmptyState
            icon={emptyIcon}
            title={`No ${title.toLowerCase()} yet`}
            description="Get started by adding your first record."
            action={
              <button type="button" onClick={openCreate} className="btn-primary">
                <Plus className="h-4 w-4" />
                Add New
              </button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-surface-border bg-slate-50/80">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600"
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {data.map((row) => (
                    <tr key={row._id} className="hover:bg-slate-50/50">
                      {columns.map((col) => (
                        <td key={col.key} className="whitespace-nowrap px-4 py-3 text-slate-700">
                          {col.render ? col.render(row) : row[col.key]}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {getFlatLink && row.flatId && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/members/flat360/${row.flatId._id || row.flatId}`
                                )
                              }
                              className="rounded-lg p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-600"
                              title="Flat 360"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openEdit(row)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(row._id)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {renderForm({ register, errors, flats, setValue, watch, editing })}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

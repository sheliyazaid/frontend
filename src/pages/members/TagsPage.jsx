import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tag, Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { tagsApi, flatsApi } from '../../api/members';
import { tagSchema } from '../../lib/schemas';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedFlat, setSelectedFlat] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: '', color: '#6366f1' },
  });

  const load = async () => {
    setLoading(true);
    try {
      const [tagsRes, flatsRes] = await Promise.all([
        tagsApi.list(),
        flatsApi.list({ limit: 500 }),
      ]);
      setTags(tagsRes.data.data);
      setFlats(flatsRes.data.data);
    } catch {
      toast.error('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await tagsApi.update(editing._id, data);
        toast.success('Tag updated');
      } else {
        await tagsApi.create(data);
        toast.success('Tag created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (tag) => {
    if (tag.isDefault) {
      toast.error('Cannot delete default tags');
      return;
    }
    if (!window.confirm('Delete this tag?')) return;
    try {
      await tagsApi.remove(tag._id);
      toast.success('Tag deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const openAssign = (flat) => {
    setSelectedFlat(flat._id);
    setSelectedTags(flat.tagIds?.map((t) => (t._id || t)) || []);
    setAssignModal(true);
  };

  const saveAssignment = async () => {
    try {
      await tagsApi.assignToFlat(selectedFlat, selectedTags);
      toast.success('Tags assigned');
      setAssignModal(false);
      load();
    } catch {
      toast.error('Assignment failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tags</h1>
          <p className="mt-1 text-sm text-slate-500">Organize flats with custom tags</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditing(null); reset({ name: '', color: '#6366f1' }); setModalOpen(true); }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Create Tag
        </button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tags.map((tag) => (
          <div key={tag._id} className="card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              <div>
                <p className="font-medium text-slate-900">{tag.name}</p>
                {tag.isDefault && (
                  <p className="text-xs text-slate-400">Default tag</p>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => { setEditing(tag); reset({ name: tag.name, color: tag.color }); setModalOpen(true); }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <Pencil className="h-4 w-4" />
              </button>
              {!tag.isDefault && (
                <button
                  type="button"
                  onClick={() => handleDelete(tag)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold text-slate-900">Assign Tags to Flats</h2>
        <div className="space-y-2">
          {flats.map((flat) => (
            <div
              key={flat._id}
              className="flex items-center justify-between rounded-lg border border-surface-border p-3"
            >
              <div>
                <p className="font-medium">{flat.flatNumber}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {flat.tagIds?.length ? (
                    flat.tagIds.map((t) => (
                      <span
                        key={t._id || t}
                        className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: t.color || '#6366f1' }}
                      >
                        {t.name || 'Tag'}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No tags</span>
                  )}
                </div>
              </div>
              <button type="button" onClick={() => openAssign(flat)} className="btn-secondary text-xs">
                <Tag className="h-3 w-3" />
                Assign
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Tag' : 'Create Tag'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label-text">Name *</label>
            <input {...register('name')} className="input-field" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label-text">Color</label>
            <input type="color" {...register('color')} className="h-10 w-full" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </Modal>

      <Modal open={assignModal} onClose={() => setAssignModal(false)} title="Assign Tags">
        <div className="space-y-2">
          {tags.map((tag) => (
            <label key={tag._id} className="flex items-center gap-3 rounded-lg border border-surface-border p-3">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTags([...selectedTags, tag._id]);
                  } else {
                    setSelectedTags(selectedTags.filter((id) => id !== tag._id));
                  }
                }}
              />
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
              <span className="text-sm font-medium">{tag.name}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <button type="button" onClick={() => setAssignModal(false)} className="btn-secondary">Cancel</button>
          <button type="button" onClick={saveAssignment} className="btn-primary">Save</button>
        </div>
      </Modal>
    </div>
  );
}

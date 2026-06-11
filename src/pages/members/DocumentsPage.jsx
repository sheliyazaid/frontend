import { useState, useEffect, useCallback } from 'react';
import { FileText, Upload, Download, Eye, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { documentsApi, flatsApi } from '../../api/members';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';

export default function DocumentsPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [flats, setFlats] = useState([]);
  const [form, setForm] = useState({
    flatId: '',
    documentType: 'Other Documents',
    title: '',
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await documentsApi.list({ page, limit: 20, search });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
    flatsApi.list({ limit: 500 }).then((res) => setFlats(res.data.data));
  }, [fetchData]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.file || !form.flatId) {
      toast.error('Flat and file are required');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('flatId', form.flatId);
      fd.append('documentType', form.documentType);
      fd.append('title', form.title);
      fd.append('file', form.file);
      await documentsApi.upload(fd);
      toast.success('Document uploaded');
      setModalOpen(false);
      setForm({ flatId: '', documentType: 'Other Documents', title: '', file: null });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const res = await documentsApi.download(id);
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Download failed');
    }
  };

  const handlePreview = async (id) => {
    try {
      const res = await documentsApi.download(id);
      const url = window.URL.createObjectURL(res.data);
      window.open(url, '_blank');
    } catch {
      toast.error('Preview failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await documentsApi.remove(id);
      toast.success('Document deleted');
      fetchData();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
          <p className="mt-1 text-sm text-slate-500">Upload and manage flat documents</p>
        </div>
        <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
          <Upload className="h-4 w-4" />
          Upload Document
        </button>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="border-b border-surface-border p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-10"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : data.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Upload sale deeds, agreements, and ID proofs."
            action={
              <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
                <Upload className="h-4 w-4" />
                Upload Document
              </button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-surface-border bg-slate-50/80">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-600">Document</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Type</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Flat</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Uploaded</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {data.map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {doc.title || doc.originalName}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{doc.documentType}</td>
                      <td className="px-4 py-3 text-slate-700">{doc.flatId?.flatNumber || '-'}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handlePreview(doc._id)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(doc._id, doc.originalName)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(doc._id)}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload Document">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="label-text">Flat *</label>
            <select
              value={form.flatId}
              onChange={(e) => setForm({ ...form, flatId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select flat</option>
              {flats.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.wing ? `${f.wing}-` : ''}{f.flatNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">Document Type</label>
            <select
              value={form.documentType}
              onChange={(e) => setForm({ ...form, documentType: e.target.value })}
              className="input-field"
            >
              {['Sale Deed', 'Rent Agreement', 'Aadhaar', 'PAN', 'NOC', 'Other Documents'].map(
                (t) => (
                  <option key={t} value={t}>{t}</option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="label-text">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-text">File *</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
              className="input-field"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

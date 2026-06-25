import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Users, Plus, QrCode, ExternalLink } from 'lucide-react';
import { guestApi } from '../../api/visitors';
import { guestRequestSchema } from '../../lib/schemas';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { assetUrl, flatLabel, formatDate } from '../../lib/visitorUtils';

export default function GuestRequestsPage() {
  const [guests, setGuests] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [qrView, setQrView] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(guestRequestSchema),
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await guestApi.list({ limit: 50 });
      const all = res.data.data || [];
      setGuests(all);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setUpcoming(all.filter((g) => new Date(g.visitingDate) >= today && ['Pending Approval', 'Approved'].includes(g.status)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await guestApi.create(data);
      toast.success('Guest request submitted for admin approval');
      reset();
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Guest Requests</h1>
          <p className="mt-1 text-sm text-slate-500">Pre-approve guests with QR passes</p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> New Guest
        </button>
      </div>

      {upcoming.length > 0 && (
        <div className="card mb-6">
          <h2 className="mb-4 font-semibold">Upcoming Guests</h2>
          <div className="space-y-3">
            {upcoming.map((g) => (
              <div key={g._id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{g.guestName}</p>
                  <p className="text-sm text-slate-500">{g.relation} · {formatDate(g.visitingDate)}</p>
                </div>
                <StatusBadge status={g.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="card mb-6 space-y-4">
          <h2 className="font-semibold">New Guest Request</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text">Guest Name *</label>
              <input {...register('guestName')} className="input-field" />
              {errors.guestName && <p className="mt-1 text-xs text-red-500">{errors.guestName.message}</p>}
            </div>
            <div>
              <label className="label-text">Mobile Number *</label>
              <input {...register('mobile')} className="input-field" />
              {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text">Relation</label>
              <input {...register('relation')} className="input-field" placeholder="Friend, Relative..." />
            </div>
            <div>
              <label className="label-text">Visiting Date *</label>
              <input type="date" {...register('visitingDate')} className="input-field" />
              {errors.visitingDate && <p className="mt-1 text-xs text-red-500">{errors.visitingDate.message}</p>}
            </div>
          </div>
          <div>
            <label className="label-text">Expected Arrival Time</label>
            <input {...register('expectedArrivalTime')} className="input-field" placeholder="e.g. 6:00 PM" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="btn-primary">Submit Request</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="card !p-0 overflow-hidden">
        <div className="border-b p-4">
          <h2 className="font-semibold">All Guest Requests</h2>
        </div>
        {guests.length === 0 ? (
          <EmptyState icon={Users} title="No guest requests" description="Create a guest request for pre-approved QR access." />
        ) : (
          <div className="divide-y">
            {guests.map((g) => (
              <div key={g._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">{g.guestName}</p>
                  <p className="text-sm text-slate-500">{g.relation} · {g.mobile}</p>
                  <p className="text-xs text-slate-400">Flat {flatLabel(g.flatId)} · {formatDate(g.visitingDate)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={g.status} />
                  {g.qrCodePath && (
                    <>
                      <button type="button" onClick={() => setQrView(g)} className="btn-secondary text-xs">
                        <QrCode className="h-3.5 w-3.5" /> Pass
                      </button>
                      {g.whatsappShareUrl && (
                        <a href={g.whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs">
                          <ExternalLink className="h-3.5 w-3.5" /> WhatsApp
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!qrView} onClose={() => setQrView(null)} title="Guest Visitor Pass">
        {qrView && (
          <div className="text-center">
            <div className="mb-4 rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
              <p className="text-xs font-medium uppercase text-purple-600">Visitor Pass</p>
              <p className="text-xl font-bold">{qrView.guestName}</p>
              <p className="text-sm text-slate-500">Flat {flatLabel(qrView.flatId)} · {formatDate(qrView.visitingDate)}</p>
            </div>
            {qrView.qrCodePath && <img src={assetUrl(qrView.qrCodePath)} alt="QR" className="mx-auto h-48 w-48" />}
            <p className="mt-2 text-xs text-slate-400">Show this QR at the gate</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

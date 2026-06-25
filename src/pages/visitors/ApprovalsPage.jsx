import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserCheck, Users, Check, X, QrCode, ExternalLink } from 'lucide-react';
import { dailyStaffApi, guestApi } from '../../api/visitors';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { assetUrl, flatLabel, formatDate } from '../../lib/visitorUtils';

export default function ApprovalsPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'staff');
  const [staff, setStaff] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [qrModal, setQrModal] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [staffRes, guestRes] = await Promise.all([
        dailyStaffApi.list({ approvalStatus: 'Pending Approval', limit: 50 }),
        guestApi.list({ status: 'Pending Approval', limit: 50 }),
      ]);
      setStaff(staffRes.data.data);
      setGuests(guestRes.data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleApproveStaff = async (id) => {
    setProcessing(id);
    try {
      const res = await dailyStaffApi.approve(id);
      toast.success('Daily staff approved — QR generated');
      setQrModal({ type: 'staff', data: res.data.data });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed');
    } finally {
      setProcessing(null);
    }
  };

  const handleApproveGuest = async (id) => {
    setProcessing(id);
    try {
      const res = await guestApi.approve(id);
      toast.success('Guest approved — QR generated');
      setQrModal({ type: 'guest', data: res.data.data });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setProcessing(rejectModal.id);
    try {
      if (rejectModal.type === 'staff') {
        await dailyStaffApi.reject(rejectModal.id, rejectReason);
      } else {
        await guestApi.reject(rejectModal.id, rejectReason);
      }
      toast.success('Request rejected');
      setRejectModal(null);
      setRejectReason('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Pending Approvals</h1>
        <p className="mt-1 text-sm text-slate-500">Review daily staff registrations and guest requests</p>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setTab('staff')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === 'staff' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          Daily Staff ({staff.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('guests')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === 'guests' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          Guest Requests ({guests.length})
        </button>
      </div>

      {tab === 'staff' && (
        staff.length === 0 ? (
          <EmptyState icon={UserCheck} title="No pending staff requests" description="Watchman registrations will appear here." />
        ) : (
          <div className="space-y-4">
            {staff.map((s) => (
              <div key={s._id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4">
                    {s.photo && (
                      <img src={assetUrl(s.photo)} alt={s.fullName} className="h-16 w-16 rounded-lg object-cover" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{s.fullName}</h3>
                      <p className="text-sm text-slate-500">{s.staffType} · {s.mobile}</p>
                      <p className="text-sm text-slate-500">Flats: {s.flatIds?.map(flatLabel).join(', ')}</p>
                      <p className="text-sm text-slate-500">{s.workDescription} · {s.workingTimeSlot}</p>
                      <p className="mt-1 text-xs text-slate-400">Registered by {s.registeredBy?.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" disabled={processing === s._id} onClick={() => handleApproveStaff(s._id)} className="btn-primary bg-emerald-600 hover:bg-emerald-700">
                      <Check className="h-4 w-4" /> Approve
                    </button>
                    <button type="button" disabled={processing === s._id} onClick={() => setRejectModal({ type: 'staff', id: s._id })} className="btn-danger">
                      <X className="h-4 w-4" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'guests' && (
        guests.length === 0 ? (
          <EmptyState icon={Users} title="No pending guest requests" description="Resident guest requests will appear here." />
        ) : (
          <div className="space-y-4">
            {guests.map((g) => (
              <div key={g._id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{g.guestName}</h3>
                    <p className="text-sm text-slate-500">{g.relation} · {g.mobile}</p>
                    <p className="text-sm text-slate-500">Flat {flatLabel(g.flatId)} · Visit: {formatDate(g.visitingDate)}</p>
                    <p className="text-sm text-slate-500">Expected: {g.expectedArrivalTime || '—'}</p>
                    <p className="mt-1 text-xs text-slate-400">Requested by {g.residentId?.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" disabled={processing === g._id} onClick={() => handleApproveGuest(g._id)} className="btn-primary bg-emerald-600 hover:bg-emerald-700">
                      <Check className="h-4 w-4" /> Approve & Generate QR
                    </button>
                    <button type="button" disabled={processing === g._id} onClick={() => setRejectModal({ type: 'guest', id: g._id })} className="btn-danger">
                      <X className="h-4 w-4" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <Modal open={!!rejectModal} onClose={() => setRejectModal(null)} title="Reject Request">
        <div className="space-y-4">
          <div>
            <label className="label-text">Reason (optional)</label>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="input-field" rows={3} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setRejectModal(null)} className="btn-secondary">Cancel</button>
            <button type="button" onClick={handleReject} disabled={processing} className="btn-danger">Reject</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!qrModal} onClose={() => setQrModal(null)} title="QR Code Generated">
        {qrModal && (
          <div className="space-y-4 text-center">
            {qrModal.data.qrCodePath && (
              <img src={assetUrl(qrModal.data.qrCodePath)} alt="QR Code" className="mx-auto h-48 w-48 rounded-lg border" />
            )}
            <p className="font-medium">{qrModal.type === 'staff' ? qrModal.data.fullName : qrModal.data.guestName}</p>
            {qrModal.type === 'guest' && qrModal.data.whatsappShareUrl && (
              <a href={qrModal.data.whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex bg-emerald-600 hover:bg-emerald-700">
                <ExternalLink className="h-4 w-4" /> Share via WhatsApp
              </a>
            )}
            {qrModal.type === 'staff' && (
              <p className="text-sm text-slate-500">Digital ID card available in Daily Staff list</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

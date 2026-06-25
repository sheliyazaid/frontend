import { useState, useEffect, useCallback } from 'react';
import { Search, UserCheck, QrCode, CreditCard } from 'lucide-react';
import { dailyStaffApi } from '../../api/visitors';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { assetUrl, flatLabel } from '../../lib/visitorUtils';

function StaffIdCard({ staff }) {
  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white shadow-lg">
      <div className="bg-brand-600 px-4 py-3 text-center text-white">
        <p className="text-xs font-medium uppercase tracking-wider">Society Staff ID</p>
        <p className="text-lg font-bold">{staff.staffType}</p>
      </div>
      <div className="p-4">
        <div className="mb-4 flex items-center gap-4">
          {staff.photo ? (
            <img src={assetUrl(staff.photo)} alt={staff.fullName} className="h-20 w-20 rounded-xl object-cover ring-2 ring-brand-200" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100 text-2xl font-bold text-slate-400">
              {staff.fullName?.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-xl font-bold text-slate-900">{staff.fullName}</p>
            <p className="text-sm text-slate-500">{staff.mobile}</p>
            <StatusBadge status={staff.approvalStatus} />
          </div>
        </div>
        <div className="mb-4 space-y-1 text-sm">
          <p><span className="text-slate-500">Flats:</span> {staff.flatIds?.map(flatLabel).join(', ')}</p>
          <p><span className="text-slate-500">Work:</span> {staff.workDescription || '—'}</p>
          <p><span className="text-slate-500">Timing:</span> {staff.workingTimeSlot || '—'}</p>
        </div>
        {staff.qrCodePath && (
          <div className="text-center">
            <img src={assetUrl(staff.qrCodePath)} alt="QR" className="mx-auto h-32 w-32" />
            <p className="mt-1 text-xs text-slate-400">Scan at gate for entry/exit</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DailyStaffPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [page, setPage] = useState(1);
  const [idCard, setIdCard] = useState(null);
  const [qrView, setQrView] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await dailyStaffApi.list({
        page,
        limit: 20,
        search: search || undefined,
        approvalStatus: approvalStatus || undefined,
      });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  }, [page, search, approvalStatus]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Daily Staff</h1>
        <p className="mt-1 text-sm text-slate-500">All registered daily staff with QR codes and ID cards</p>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search name, mobile..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
          </div>
          <select value={approvalStatus} onChange={(e) => { setApprovalStatus(e.target.value); setPage(1); }} className="input-field w-auto">
            <option value="">All Status</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : data.length === 0 ? (
          <EmptyState icon={UserCheck} title="No daily staff" description="Staff registrations will appear here." />
        ) : (
          <>
            <div className="divide-y">
              {data.map((row) => (
                <div key={row._id} className="flex flex-wrap items-center gap-4 p-4">
                  {row.photo && <img src={assetUrl(row.photo)} alt="" className="h-12 w-12 rounded-lg object-cover" />}
                  <div className="min-w-[160px] flex-1">
                    <p className="font-semibold">{row.fullName}</p>
                    <p className="text-sm text-slate-500">{row.staffType} · {row.mobile}</p>
                    <p className="text-xs text-slate-400">Flats: {row.flatIds?.map(flatLabel).join(', ')}</p>
                  </div>
                  <StatusBadge status={row.approvalStatus} />
                  {row.approvalStatus === 'Approved' && <StatusBadge status={row.currentStatus} />}
                  <div className="flex gap-2">
                    {row.qrCodePath && (
                      <button type="button" onClick={() => setQrView(row)} className="btn-secondary text-xs">
                        <QrCode className="h-3.5 w-3.5" /> QR
                      </button>
                    )}
                    {row.approvalStatus === 'Approved' && (
                      <button type="button" onClick={() => setIdCard(row)} className="btn-secondary text-xs">
                        <CreditCard className="h-3.5 w-3.5" /> ID Card
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal open={!!idCard} onClose={() => setIdCard(null)} title="Digital Staff ID Card">
        {idCard && <StaffIdCard staff={idCard} />}
      </Modal>

      <Modal open={!!qrView} onClose={() => setQrView(null)} title="Staff QR Code">
        {qrView?.qrCodePath && (
          <div className="text-center">
            <img src={assetUrl(qrView.qrCodePath)} alt="QR" className="mx-auto h-56 w-56" />
            <p className="mt-2 font-medium">{qrView.fullName}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

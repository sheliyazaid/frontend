import { useState, useEffect, useCallback } from 'react';
import { Search, ClipboardList } from 'lucide-react';
import { entryLogsApi } from '../../api/parking';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';

function formatDateTime(date) {
  return new Date(date).toLocaleString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function EntryLogsPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [recordType, setRecordType] = useState('');
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await entryLogsApi.list({ page, limit: 25, search, recordType: recordType || undefined });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  }, [page, search, recordType]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Entry / Exit Logs</h1>
        <p className="mt-1 text-sm text-slate-500">Complete record of all vehicle IN and OUT with date & time</p>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search vehicle, name, mobile..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-10"
            />
          </div>
          <select
            value={recordType}
            onChange={(e) => { setRecordType(e.target.value); setPage(1); }}
            className="input-field w-auto"
          >
            <option value="">All (IN & OUT)</option>
            <option value="Entry">Vehicle IN only</option>
            <option value="Exit">Vehicle OUT only</option>
          </select>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : data.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No logs yet" description="Gate IN/OUT records will appear here." />
        ) : (
          <>
            <div className="divide-y">
              {data.map((row) => (
                <div key={row._id} className="flex flex-wrap items-center gap-4 p-4 hover:bg-slate-50/50">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${row.recordType === 'Entry' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {row.recordType === 'Entry' ? 'IN' : 'OUT'}
                  </div>
                  <div className="min-w-[140px] flex-1">
                    <p className="font-semibold text-slate-900">{row.vehicleNumber}</p>
                    <p className="text-sm text-slate-500">{row.holderName || '—'}</p>
                    {row.mobile && <p className="text-xs text-slate-400">{row.mobile}</p>}
                  </div>
                  <div className="text-sm">
                    {row.flatId?.flatNumber && <p>Flat: <strong>{row.flatId.flatNumber}</strong></p>}
                    {row.allocationId?.slotId?.slotNumber && <p>Slot: <strong>{row.allocationId.slotId.slotNumber}</strong></p>}
                  </div>
                  <div className="text-sm">
                    <StatusBadge status={row.entryType === 'Registered' ? 'Verified' : 'Pending'} />
                    <p className="mt-1 text-xs text-slate-400">{row.entryType === 'Registered' ? 'Assigned Parking' : 'No Parking'}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium text-slate-700">{formatDateTime(row.scannedAt)}</p>
                    <p className="text-xs text-slate-400">{row.gate} · {row.securityGuardId?.name || 'Guard'}</p>
                  </div>
                </div>
              ))}
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}

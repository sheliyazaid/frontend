import { useState, useEffect, useCallback } from 'react';
import { Search, ClipboardList } from 'lucide-react';
import { visitorLogsApi } from '../../api/visitors';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDateTime } from '../../lib/visitorUtils';

const CATEGORIES = ['', 'Daily Staff', 'Delivery', 'Guest'];
const ACTIONS = ['', 'Entry', 'Exit', 'Registration', 'Approval', 'Rejection'];

export default function VisitorLogsPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [visitorCategory, setVisitorCategory] = useState('');
  const [action, setAction] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await visitorLogsApi.search({
        page,
        limit: 25,
        search: search || undefined,
        visitorType: visitorCategory || undefined,
        action: action || undefined,
        flatNumber: flatNumber || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  }, [page, search, visitorCategory, action, flatNumber, dateFrom, dateTo]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Visitor Logs</h1>
        <p className="mt-1 text-sm text-slate-500">Complete entry-exit history with search and filters</p>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, mobile..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-10"
            />
          </div>
          <input
            type="text"
            placeholder="Flat number"
            value={flatNumber}
            onChange={(e) => { setFlatNumber(e.target.value); setPage(1); }}
            className="input-field w-32"
          />
          <select value={visitorCategory} onChange={(e) => { setVisitorCategory(e.target.value); setPage(1); }} className="input-field w-auto">
            {CATEGORIES.map((c) => <option key={c || 'all'} value={c}>{c || 'All Categories'}</option>)}
          </select>
          <select value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} className="input-field w-auto">
            {ACTIONS.map((a) => <option key={a || 'all'} value={a}>{a || 'All Actions'}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="input-field w-auto" />
          <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="input-field w-auto" />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : data.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No logs found" description="Visitor activity will appear here." />
        ) : (
          <>
            <div className="divide-y">
              {data.map((row) => (
                <div key={row._id} className="flex flex-wrap items-center gap-4 p-4 hover:bg-slate-50/50">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${row.action === 'Entry' ? 'bg-emerald-100 text-emerald-700' : row.action === 'Exit' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                    {row.action?.slice(0, 3).toUpperCase()}
                  </div>
                  <div className="min-w-[140px] flex-1">
                    <p className="font-semibold text-slate-900">{row.visitorName}</p>
                    <p className="text-sm text-slate-500">{row.mobile || '—'}</p>
                  </div>
                  <div className="text-sm">
                    <StatusBadge status={row.visitorCategory} />
                    <p className="mt-1 text-xs text-slate-400">{row.action}</p>
                  </div>
                  <div className="text-sm">
                    {row.flatNumbers?.length > 0 && <p>Flat: <strong>{row.flatNumbers.join(', ')}</strong></p>}
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium text-slate-700">{formatDateTime(row.timestamp)}</p>
                    <p className="text-xs text-slate-400">{row.watchmanId?.name || 'System'}</p>
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

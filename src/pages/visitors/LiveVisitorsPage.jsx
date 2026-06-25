import { useEffect, useState } from 'react';
import { Users, UserCheck, Truck } from 'lucide-react';
import { visitorApi } from '../../api/visitors';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusBadge from '../../components/ui/StatusBadge';
import { flatLabel, formatDateTime } from '../../lib/visitorUtils';

export default function LiveVisitorsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    visitorApi.liveVisitors()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const total = (data?.staff?.length || 0) + (data?.guests?.length || 0) + (data?.deliveries?.length || 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Live Visitors Inside</h1>
        <p className="mt-1 text-sm text-slate-500">{total} visitors currently on premises</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card">
          <div className="mb-4 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="font-semibold">Daily Staff ({data?.staff?.length || 0})</h2>
          </div>
          {data?.staff?.length === 0 ? (
            <p className="text-sm text-slate-400">None inside</p>
          ) : (
            <div className="space-y-3">
              {data?.staff?.map((s) => (
                <div key={s._id} className="rounded-lg border p-3">
                  <p className="font-medium">{s.fullName}</p>
                  <p className="text-sm text-slate-500">{s.staffType} · {s.mobile}</p>
                  <p className="text-xs text-slate-400">Flats: {s.flatIds?.map(flatLabel).join(', ')}</p>
                  {s.lastEntryAt && <p className="text-xs text-slate-400">Entry: {formatDateTime(s.lastEntryAt)}</p>}
                  <StatusBadge status="Inside" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            <h2 className="font-semibold">Guests ({data?.guests?.length || 0})</h2>
          </div>
          {data?.guests?.length === 0 ? (
            <p className="text-sm text-slate-400">None inside</p>
          ) : (
            <div className="space-y-3">
              {data?.guests?.map((g) => (
                <div key={g._id} className="rounded-lg border p-3">
                  <p className="font-medium">{g.guestName}</p>
                  <p className="text-sm text-slate-500">{g.relation} · Flat {flatLabel(g.flatId)}</p>
                  <p className="text-xs text-slate-400">Host: {g.residentId?.name}</p>
                  {g.entryTime && <p className="text-xs text-slate-400">Entry: {formatDateTime(g.entryTime)}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-amber-600" />
            <h2 className="font-semibold">Delivery ({data?.deliveries?.length || 0})</h2>
          </div>
          {data?.deliveries?.length === 0 ? (
            <p className="text-sm text-slate-400">None inside</p>
          ) : (
            <div className="space-y-3">
              {data?.deliveries?.map((d) => (
                <div key={d._id} className="rounded-lg border p-3">
                  <p className="font-medium">{d.deliveryPersonName}</p>
                  <p className="text-sm text-slate-500">{d.companyName} · Flat {flatLabel(d.flatId)}</p>
                  {d.entryTime && <p className="text-xs text-slate-400">Entry: {formatDateTime(d.entryTime)}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

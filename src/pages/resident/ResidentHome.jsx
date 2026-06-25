import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Users, Plus, Clock } from 'lucide-react';
import { visitorApi } from '../../api/visitors';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusBadge from '../../components/ui/StatusBadge';
import { flatLabel, formatDate } from '../../lib/visitorUtils';

export default function ResidentHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    visitorApi.residentOverview()
      .then((res) => setData(res.data.data))
      .catch(() => setData({ upcoming: [], pending: 0, history: [] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name}</h1>
          <p className="mt-1 text-sm text-slate-500">Manage guest visits with QR-based passes</p>
        </div>
        <button type="button" onClick={() => navigate('/resident/guests')} className="btn-primary">
          <Plus className="h-4 w-4" /> Request Guest
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Your Portal</p>
            <p className="text-lg font-bold">Resident</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Pending Requests</p>
            <p className="text-2xl font-bold">{data?.pending || 0}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Upcoming Guests</p>
            <p className="text-2xl font-bold">{data?.upcoming?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <h2 className="font-semibold">Upcoming Guests</h2>
            </div>
            <button type="button" onClick={() => navigate('/resident/guests')} className="text-sm text-brand-600">Manage</button>
          </div>
          {data?.upcoming?.length === 0 ? (
            <p className="text-sm text-slate-400">No upcoming guest visits</p>
          ) : (
            <div className="space-y-3">
              {data.upcoming.map((g) => (
                <div key={g._id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{g.guestName}</p>
                    <p className="text-xs text-slate-500">{g.relation} · {formatDate(g.visitingDate)}</p>
                  </div>
                  <StatusBadge status={g.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <h2 className="font-semibold">Guest Visit History</h2>
          </div>
          {data?.history?.length === 0 ? (
            <p className="text-sm text-slate-400">No visit history yet</p>
          ) : (
            <div className="space-y-3">
              {data.history.map((g) => (
                <div key={g._id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{g.guestName}</p>
                    <p className="text-xs text-slate-500">Flat {flatLabel(g.flatId)} · {formatDate(g.visitingDate)}</p>
                  </div>
                  <StatusBadge status={g.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

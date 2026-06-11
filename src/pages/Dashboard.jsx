import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Car, Bell, ArrowRight } from 'lucide-react';
import { flatsApi, ownersApi, vehiclesApi, remindersApi, tenantsApi } from '../api/members';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatusBadge from '../components/ui/StatusBadge';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentFlats, setRecentFlats] = useState([]);
  const [expiringTenants, setExpiringTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      flatsApi.list({ limit: 1 }),
      ownersApi.list({ limit: 1 }),
      vehiclesApi.list({ limit: 1 }),
      remindersApi.list({ reminderStatus: 'Pending', limit: 1 }),
      flatsApi.list({ limit: 5 }),
      tenantsApi.expiring(30),
    ])
      .then(([flats, owners, vehicles, reminders, recent, expiring]) => {
        setStats({
          flats: flats.data.pagination?.total || 0,
          owners: owners.data.pagination?.total || 0,
          vehicles: vehicles.data.pagination?.total || 0,
          reminders: reminders.data.pagination?.total || 0,
        });
        const flatsList = recent.data.data;
        setRecentFlats(Array.isArray(flatsList) ? flatsList : []);
        const tenantsList = expiring.data.data;
        setExpiringTenants(Array.isArray(tenantsList) ? tenantsList.slice(0, 5) : []);
      })
      .catch(() => {
        setStats({ flats: 0, owners: 0, vehicles: 0, reminders: 0 });
        setRecentFlats([]);
        setExpiringTenants([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { label: 'Total Flats', value: stats.flats, icon: Building2, color: 'bg-brand-50 text-brand-600' },
    { label: 'Owners', value: stats.owners, icon: Users, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Vehicles', value: stats.vehicles, icon: Car, color: 'bg-amber-50 text-amber-600' },
    { label: 'Pending Reminders', value: stats.reminders, icon: Bell, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your society management</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="card flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Flats</h2>
            <button
              type="button"
              onClick={() => navigate('/members/flats')}
              className="text-sm text-brand-600 hover:text-brand-700"
            >
              View all
            </button>
          </div>
          <div className="space-y-2">
            {recentFlats.map((flat) => (
              <button
                key={flat._id}
                type="button"
                onClick={() => navigate(`/members/flat360/${flat._id}`)}
                className="flex w-full items-center justify-between rounded-lg border border-surface-border p-3 text-left transition hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium text-slate-900">{flat.flatNumber}</p>
                  <p className="text-xs text-slate-500">
                    Wing {flat.wing} · Floor {flat.floor}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={flat.flatStatus} />
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4 font-semibold text-slate-900">Tenant Agreements Expiring Soon</h2>
          {expiringTenants.length === 0 ? (
            <p className="text-sm text-slate-500">No agreements expiring in the next 30 days</p>
          ) : (
            <div className="space-y-2">
              {expiringTenants.map((tenant) => (
                <div
                  key={tenant._id}
                  className="flex items-center justify-between rounded-lg border border-surface-border p-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{tenant.tenantName}</p>
                    <p className="text-xs text-slate-500">
                      Flat {tenant.flatId?.flatNumber} · Ends{' '}
                      {new Date(tenant.agreementEndDate).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status="Pending" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

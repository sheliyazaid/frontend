import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine, UserCheck, Truck, Users } from 'lucide-react';
import { visitorApi } from '../../api/visitors';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function WatchmanDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    visitorApi.watchmanOverview()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { label: 'Staff Entries Today', value: data?.staffEntries || 0, icon: UserCheck, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Delivery Entries Today', value: data?.deliveryEntries || 0, icon: Truck, color: 'bg-amber-50 text-amber-600' },
    { label: 'Guest Entries Today', value: data?.guestEntries || 0, icon: Users, color: 'bg-purple-50 text-purple-600' },
  ];

  const actions = [
    { label: 'QR Scanner', to: '/visitors/scan', icon: ScanLine, primary: true },
    { label: 'Delivery Entry', to: '/visitors/delivery', icon: Truck },
    { label: 'Register Daily Staff', to: '/visitors/register-staff', icon: UserCheck },
    { label: 'Vehicle Gate', to: '/parking/gate', icon: ScanLine },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Gate Panel</h1>
        <p className="mt-1 text-sm text-slate-500">Visitor management for watchmen</p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/visitors/scan')}
        className="btn-primary mb-8 w-full py-4 text-lg"
      >
        <ScanLine className="h-6 w-6" /> Quick QR Scanner
      </button>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="card flex flex-col items-center text-center">
            <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}>
              <card.icon className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.to}
            type="button"
            onClick={() => navigate(action.to)}
            className={action.primary ? 'btn-primary' : 'btn-secondary'}
          >
            <action.icon className="h-4 w-4" /> {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

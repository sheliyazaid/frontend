import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParkingCircle, Car, Key, ScanLine } from 'lucide-react';
import { parkingApi } from '../../api/parking';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function formatDateTime(date) {
  return new Date(date).toLocaleString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ParkingDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    parkingApi.overview()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  const cards = [
    { label: 'Total Slots', value: data.totalSlots, icon: ParkingCircle, color: 'bg-brand-50 text-brand-600' },
    { label: 'Available Slots', value: data.availableSlots, icon: Car, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Assigned Vehicles', value: data.activeAllocations, icon: Key, color: 'bg-amber-50 text-amber-600' },
    { label: 'Today IN/OUT', value: data.todayLogs, icon: ScanLine, color: 'bg-blue-50 text-blue-600' },
  ];

  const quickLinks = [
    { label: 'Create Slot', to: '/parking/slots' },
    { label: 'Assign Parking', to: '/parking/allocations' },
    { label: 'Gate IN/OUT', to: '/parking/gate' },
    { label: 'View Logs', to: '/parking/logs' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Parking</h1>
        <p className="mt-1 text-sm text-slate-500">Slots, assignments, and gate entry tracking</p>
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

      <div className="mb-8 flex flex-wrap gap-3">
        {quickLinks.map((link) => (
          <button key={link.to} type="button" onClick={() => navigate(link.to)} className="btn-secondary">
            {link.label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent IN / OUT</h2>
          <button type="button" onClick={() => navigate('/parking/logs')} className="text-sm text-brand-600">View all logs</button>
        </div>
        {data.recentLogs?.length === 0 ? (
          <p className="text-sm text-slate-400">No gate activity yet</p>
        ) : (
          <div className="space-y-3">
            {data.recentLogs?.map((log) => (
              <div key={log._id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <span className={`rounded px-2 py-0.5 text-xs font-bold ${log.recordType === 'Entry' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {log.recordType === 'Entry' ? 'IN' : 'OUT'}
                  </span>
                  <div>
                    <p className="font-medium">{log.vehicleNumber}</p>
                    <p className="text-xs text-slate-500">
                      {log.holderName || 'Unregistered'}
                      {log.flatId?.flatNumber && ` · Flat ${log.flatId.flatNumber}`}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{formatDateTime(log.scannedAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useAuth } from '../../context/AuthContext';
import { Home, Car, Bell, IndianRupee, Users, ParkingCircle } from 'lucide-react';

const DEMO = {
  flatNumber: 'A-101',
  wing: 'A',
  ownerName: 'Rajesh Kumar',
  parkingSlot: 'B1-001',
  vehicleNumber: 'MH01AB1234',
  maintenanceDue: 2500,
  lastPayment: 'May 2026',
  notices: [
    { title: 'Society AGM on 15 June', date: '2 days ago' },
    { title: 'Water supply maintenance Sunday 8–12 AM', date: '1 week ago' },
  ],
  visitors: [
    { name: 'Amit Sharma', date: 'Yesterday', vehicle: 'MH12XY5678' },
    { name: 'Priya Mehta', date: '3 days ago', vehicle: 'GJ01CD9012' },
  ],
  vehicleLogs: [
    { type: 'IN', time: 'Today, 8:42 AM' },
    { type: 'OUT', time: 'Yesterday, 6:15 PM' },
  ],
};

export default function ResidentHome() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name}</h1>
        <p className="mt-1 text-sm text-slate-500">Your society overview — demo data (will connect to live data later)</p>
      </div>

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        This is a preview screen for residents. Data shown below is sample only.
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Your Flat</p>
            <p className="text-xl font-bold">{DEMO.flatNumber} · Wing {DEMO.wing}</p>
            <p className="text-sm text-slate-500">{DEMO.ownerName}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ParkingCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Parking</p>
            <p className="text-xl font-bold">{DEMO.parkingSlot}</p>
            <p className="text-sm text-slate-500">{DEMO.vehicleNumber}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="card">
          <div className="mb-3 flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-amber-600" />
            <h2 className="font-semibold">Maintenance</h2>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{DEMO.maintenanceDue.toLocaleString('en-IN')}</p>
          <p className="text-sm text-slate-500">Due for June 2026 · Last paid {DEMO.lastPayment}</p>
        </div>
        <div className="card">
          <div className="mb-3 flex items-center gap-2">
            <Car className="h-4 w-4 text-blue-600" />
            <h2 className="font-semibold">Vehicle Activity</h2>
          </div>
          <div className="space-y-2">
            {DEMO.vehicleLogs.map((log) => (
              <div key={log.time} className="flex items-center justify-between text-sm">
                <span className={`rounded px-2 py-0.5 text-xs font-bold ${log.type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{log.type}</span>
                <span className="text-slate-500">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand-600" />
            <h2 className="font-semibold">Notices</h2>
          </div>
          <div className="space-y-3">
            {DEMO.notices.map((n) => (
              <div key={n.title} className="rounded-lg border p-3">
                <p className="font-medium text-slate-900">{n.title}</p>
                <p className="text-xs text-slate-400">{n.date}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            <h2 className="font-semibold">Recent Visitors</h2>
          </div>
          <div className="space-y-3">
            {DEMO.visitors.map((v) => (
              <div key={v.name + v.date} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{v.name}</p>
                  <p className="text-xs text-slate-500">{v.vehicle}</p>
                </div>
                <span className="text-xs text-slate-400">{v.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

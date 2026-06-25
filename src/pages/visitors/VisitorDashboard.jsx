import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, Truck, Clock, LogIn, LogOut, AlertCircle, ScanLine, ClipboardList,
} from 'lucide-react';
import { visitorApi } from '../../api/visitors';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDateTime } from '../../lib/visitorUtils';

export default function VisitorDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    visitorApi.adminOverview()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  const cards = [
    { label: 'Visitors Today', value: data.totalVisitorsToday, icon: Users, color: 'bg-brand-50 text-brand-600' },
    { label: 'Daily Staff Inside', value: data.dailyStaffInside, icon: UserCheck, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Guests Inside', value: data.guestsInside, icon: Users, color: 'bg-purple-50 text-purple-600' },
    { label: 'Delivery Inside', value: data.deliveryInside, icon: Truck, color: 'bg-amber-50 text-amber-600' },
    { label: 'Pending Approvals', value: data.pendingApprovals, icon: AlertCircle, color: 'bg-red-50 text-red-600' },
    { label: 'Total Entries', value: data.totalEntries, icon: LogIn, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Exits', value: data.totalExits, icon: LogOut, color: 'bg-slate-100 text-slate-600' },
  ];

  const quickLinks = [
    { label: 'Pending Approvals', to: '/visitors/approvals' },
    { label: 'Live Visitors', to: '/visitors/live' },
    { label: 'All Logs', to: '/visitors/logs' },
    { label: 'Daily Staff', to: '/visitors/daily-staff' },
    { label: 'QR Scanner', to: '/visitors/scan' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Visitor Management</h1>
        <p className="mt-1 text-sm text-slate-500">QR-based entry tracking, approvals, and analytics</p>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Activity</h2>
            <button type="button" onClick={() => navigate('/visitors/logs')} className="text-sm text-brand-600">View all</button>
          </div>
          {data.recentLogs?.length === 0 ? (
            <p className="text-sm text-slate-400">No visitor activity yet</p>
          ) : (
            <div className="space-y-3">
              {data.recentLogs?.map((log) => (
                <div key={log._id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <span className={`rounded px-2 py-0.5 text-xs font-bold ${log.action === 'Entry' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {log.action}
                    </span>
                    <div>
                      <p className="font-medium">{log.visitorName}</p>
                      <p className="text-xs text-slate-500">{log.visitorCategory}{log.flatNumbers?.length ? ` · Flat ${log.flatNumbers.join(', ')}` : ''}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">{formatDateTime(log.timestamp)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <h2 className="font-semibold text-slate-900">Pending Approvals</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Daily Staff Requests</p>
                <p className="text-xs text-slate-500">Awaiting admin review</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{data.pendingStaff}</span>
                <button type="button" onClick={() => navigate('/visitors/approvals?tab=staff')} className="text-sm text-brand-600">Review</button>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Guest Requests</p>
                <p className="text-xs text-slate-500">From residents</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{data.pendingGuests}</span>
                <button type="button" onClick={() => navigate('/visitors/approvals?tab=guests')} className="text-sm text-brand-600">Review</button>
              </div>
            </div>
          </div>
          <button type="button" onClick={() => navigate('/visitors/scan')} className="btn-primary mt-4 w-full">
            <ScanLine className="h-4 w-4" /> Open QR Scanner
          </button>
        </div>
      </div>
    </div>
  );
}

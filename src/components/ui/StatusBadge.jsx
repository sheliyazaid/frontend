const colors = {
  Occupied: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Vacant: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  Available: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Reserved: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'Under Maintenance': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Released: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  Expired: 'bg-red-50 text-red-700 ring-red-600/20',
  Inactive: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  Open: 'bg-red-50 text-red-700 ring-red-600/20',
  Resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Waived: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  Verified: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Rejected: 'bg-red-50 text-red-700 ring-red-600/20',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
        colors[status] || 'bg-slate-100 text-slate-600 ring-slate-500/20'
      }`}
    >
      {status}
    </span>
  );
}

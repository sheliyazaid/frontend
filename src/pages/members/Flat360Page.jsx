import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Car,
  FileText,
  Bell,
  StickyNote,
  Tag,
  Home,
  Key,
  Heart,
  Clock,
} from 'lucide-react';
import { flatsApi } from '../../api/members';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusBadge from '../../components/ui/StatusBadge';

const Section = ({ title, icon: Icon, count, children }) => (
  <div className="card">
    <div className="mb-4 flex items-center gap-2">
      <Icon className="h-5 w-5 text-brand-600" />
      <h3 className="font-semibold text-slate-900">{title}</h3>
      {count !== undefined && (
        <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {count}
        </span>
      )}
    </div>
    {children}
  </div>
);

export default function Flat360Page() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    flatsApi
      .flat360(id)
      .then((res) => setData(res.data.data))
      .catch(() => navigate('/members/flats'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  const { flat, overview, owners, occupants, familyMembers, tenants, vehicles, documents, notes, tags, reminders, activities } = data;

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate('/members/flats')}
        className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Flats
      </button>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Flat {flat.flatNumber}</h1>
          <p className="mt-1 text-slate-500">
            Wing {flat.wing || '-'} · Floor {flat.floor}
          </p>
        </div>
        <StatusBadge status={flat.flatStatus} />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Owners', value: overview.ownerCount, icon: Users },
          { label: 'Occupants', value: overview.occupantCount, icon: Home },
          { label: 'Vehicles', value: overview.vehicleCount, icon: Car },
          { label: 'Documents', value: overview.documentCount, icon: FileText },
          { label: 'Active Reminders', value: overview.activeReminders, icon: Bell },
        ].map((stat) => (
          <div key={stat.label} className="card flex items-center gap-3 !p-4">
            <stat.icon className="h-5 w-5 text-brand-600" />
            <div>
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {tags?.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag._id}
              className="rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Owners" icon={Users} count={owners.length}>
          {owners.length === 0 ? (
            <p className="text-sm text-slate-400">No owners</p>
          ) : (
            <div className="space-y-2">
              {owners.map((o) => (
                <div key={o._id} className="rounded-lg border border-surface-border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{o.fullName}</p>
                    {o.isPrimary && <StatusBadge status="Verified" />}
                  </div>
                  <p className="text-sm text-slate-500">{o.mobile} · {o.email || 'No email'}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Occupants" icon={Home} count={occupants.length}>
          {occupants.length === 0 ? (
            <p className="text-sm text-slate-400">No occupants</p>
          ) : (
            <div className="space-y-2">
              {occupants.map((o) => (
                <div key={o._id} className="rounded-lg border border-surface-border p-3">
                  <p className="font-medium">{o.name}</p>
                  <p className="text-sm text-slate-500">{o.type} · {o.relation || '-'}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Family Members" icon={Heart} count={familyMembers.length}>
          {familyMembers.length === 0 ? (
            <p className="text-sm text-slate-400">No family members</p>
          ) : (
            <div className="space-y-2">
              {familyMembers.map((m) => (
                <div key={m._id} className="rounded-lg border border-surface-border p-3">
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-slate-500">{m.relation} · {m.mobile || '-'}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Tenants" icon={Key} count={tenants.length}>
          {tenants.length === 0 ? (
            <p className="text-sm text-slate-400">No tenants</p>
          ) : (
            <div className="space-y-2">
              {tenants.map((t) => (
                <div key={t._id} className="rounded-lg border border-surface-border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{t.tenantName}</p>
                    {t.isCurrent && <span className="text-xs text-emerald-600">Current</span>}
                  </div>
                  <p className="text-sm text-slate-500">
                    {t.mobile} · Ends {t.agreementEndDate ? new Date(t.agreementEndDate).toLocaleDateString() : '-'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Vehicles" icon={Car} count={vehicles.length}>
          {vehicles.length === 0 ? (
            <p className="text-sm text-slate-400">No vehicles</p>
          ) : (
            <div className="space-y-2">
              {vehicles.map((v) => (
                <div key={v._id} className="rounded-lg border border-surface-border p-3">
                  <p className="font-medium">{v.vehicleNumber}</p>
                  <p className="text-sm text-slate-500">{v.vehicleType} · Slot {v.parkingSlot || '-'}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Documents" icon={FileText} count={documents.length}>
          {documents.length === 0 ? (
            <p className="text-sm text-slate-400">No documents</p>
          ) : (
            <div className="space-y-2">
              {documents.map((d) => (
                <div key={d._id} className="rounded-lg border border-surface-border p-3">
                  <p className="font-medium">{d.title || d.originalName}</p>
                  <p className="text-sm text-slate-500">{d.documentType}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Notes" icon={StickyNote} count={notes.length}>
          {notes.length === 0 ? (
            <p className="text-sm text-slate-400">No notes</p>
          ) : (
            <div className="space-y-2">
              {notes.map((n) => (
                <div key={n._id} className="rounded-lg border border-surface-border p-3">
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-slate-500">{n.content}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Reminders" icon={Bell} count={reminders.length}>
          {reminders.length === 0 ? (
            <p className="text-sm text-slate-400">No reminders</p>
          ) : (
            <div className="space-y-2">
              {reminders.map((r) => (
                <div key={r._id} className="rounded-lg border border-surface-border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{r.title}</p>
                    <StatusBadge status={r.reminderStatus} />
                  </div>
                  <p className="text-sm text-slate-500">Due {new Date(r.dueDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      <div className="mt-6">
        <Section title="Activity Timeline" icon={Clock} count={activities.length}>
          {activities.length === 0 ? (
            <p className="text-sm text-slate-400">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {activities.map((a) => (
                <div key={a._id} className="flex gap-3 border-l-2 border-brand-200 pl-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{a.action}</p>
                    <p className="text-sm text-slate-500">{a.description}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(a.createdAt).toLocaleString()} · {a.createdBy?.name || 'System'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

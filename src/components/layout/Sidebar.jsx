import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, Car, UserCog, Building2, User, Home, Heart, Key,
  FileText, StickyNote, Tag, AlarmClock, Upload, Eye, ParkingCircle, ScanLine,
  ClipboardList, ChevronDown, Bell, UserCheck, Truck, QrCode,
} from 'lucide-react';

const membersChildren = [
  { to: '/members/flats', label: 'Flats', icon: Building2 },
  { to: '/members/owners', label: 'Owners', icon: User },
  { to: '/members/occupants', label: 'Occupants', icon: Home },
  { to: '/members/family-members', label: 'Family Members', icon: Heart },
  { to: '/members/tenants', label: 'Tenants', icon: Key },
  { to: '/members/vehicles', label: 'Vehicles', icon: Car },
  { to: '/members/documents', label: 'Documents', icon: FileText },
  { to: '/members/notes', label: 'Notes', icon: StickyNote },
  { to: '/members/tags', label: 'Tags', icon: Tag },
  { to: '/members/reminders', label: 'Reminders', icon: AlarmClock },
  { to: '/members/import-export', label: 'Import / Export', icon: Upload },
  { to: '/members/flats', label: 'Flat 360 View', icon: Eye },
];

const adminParkingChildren = [
  { to: '/parking', label: 'Overview', icon: ParkingCircle },
  { to: '/parking/slots', label: 'Parking Slots', icon: ParkingCircle },
  { to: '/parking/allocations', label: 'Assign Parking', icon: Key },
  { to: '/parking/logs', label: 'Entry Logs', icon: ClipboardList },
];

const adminVisitorChildren = [
  { to: '/visitors', label: 'Overview', icon: LayoutDashboard },
  { to: '/visitors/approvals', label: 'Approvals', icon: UserCheck },
  { to: '/visitors/live', label: 'Live Visitors', icon: Users },
  { to: '/visitors/daily-staff', label: 'Daily Staff', icon: UserCheck },
  { to: '/visitors/logs', label: 'Entry Logs', icon: ClipboardList },
  { to: '/visitors/scan', label: 'QR Scanner', icon: QrCode },
];

const adminNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Members', icon: Users, children: membersChildren, prefix: '/members' },
  { label: 'Parking', icon: Car, children: adminParkingChildren, prefix: '/parking' },
  { label: 'Visitors', icon: UserCheck, children: adminVisitorChildren, prefix: '/visitors' },
  { to: '/staff', label: 'Watchman Accounts', icon: UserCog },
];

const watchmanNav = [
  { to: '/visitors/watchman', label: 'Gate Panel', icon: LayoutDashboard },
  { to: '/visitors/scan', label: 'QR Scanner', icon: QrCode },
  { to: '/visitors/delivery', label: 'Delivery Entry', icon: Truck },
  { to: '/visitors/register-staff', label: 'Register Staff', icon: UserCheck },
  { to: '/parking/gate', label: 'Vehicle Gate', icon: ScanLine },
];

const residentNav = [
  { to: '/resident', label: 'My Home', icon: Home },
  { to: '/resident/guests', label: 'Guest Requests', icon: Users },
  { to: '/resident/notices', label: 'Notices', icon: Bell },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

function NavGroup({ item, isOpen, onToggle }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(item.prefix);

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <span className="flex items-center gap-3">
          <item.icon className="h-4 w-4" />
          {item.label}
        </span>
        <ChevronDown className={`h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <ul className="ml-4 mt-1 space-y-0.5 border-l border-surface-border pl-3">
          {item.children.map((child) => (
            <li key={child.to + child.label}>
              <NavLink to={child.to} end={child.to === item.prefix} className={linkClass}>
                <child.icon className="h-3.5 w-3.5" />
                {child.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.role || 'Admin';
  const [membersOpen, setMembersOpen] = useState(location.pathname.startsWith('/members'));
  const [parkingOpen, setParkingOpen] = useState(location.pathname.startsWith('/parking'));
  const [visitorsOpen, setVisitorsOpen] = useState(location.pathname.startsWith('/visitors'));

  const nav = role === 'Watchman' ? watchmanNav : role === 'Resident' ? residentNav : adminNav;
  const panelTitle = role === 'Watchman' ? 'Gate Panel' : role === 'Resident' ? 'Resident Portal' : 'Admin Panel';

  return (
    <aside className="flex h-full w-64 flex-col border-r border-surface-border bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-surface-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Building2 className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Society ERP</p>
          <p className="text-xs text-slate-500">{panelTitle}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {nav.map((item) => {
            if (item.children) {
              const isMembers = item.prefix === '/members';
              const isParking = item.prefix === '/parking';
              const isVisitors = item.prefix === '/visitors';
              return (
                <NavGroup
                  key={item.label}
                  item={item}
                  isOpen={isMembers ? membersOpen : isParking ? parkingOpen : visitorsOpen}
                  onToggle={() => {
                    if (isMembers) setMembersOpen(!membersOpen);
                    else if (isParking) setParkingOpen(!parkingOpen);
                    else setVisitorsOpen(!visitorsOpen);
                  }}
                />
              );
            }
            return (
              <li key={item.to}>
                <NavLink to={item.to} end className={linkClass}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

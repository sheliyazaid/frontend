import { useState } from 'react';
import { Search, LogIn, LogOut, Car, User, Home, ParkingCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { gateApi } from '../../api/parking';

function formatDateTime(date) {
  return new Date(date).toLocaleString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function GatePage() {
  const [digits, setDigits] = useState('');
  const [searching, setSearching] = useState(false);
  const [lookup, setLookup] = useState(null);
  const [selected, setSelected] = useState(null);
  const [logging, setLogging] = useState(false);
  const [unregistered, setUnregistered] = useState({ vehicleNumber: '', holderName: '', mobile: '' });

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (digits.length !== 4) {
      toast.error('Enter last 4 digits of vehicle number');
      return;
    }
    setSearching(true);
    setSelected(null);
    try {
      const res = await gateApi.lookup(digits);
      setLookup(res.data.data);
      if (res.data.data.found && res.data.data.matches.length === 1) {
        setSelected(res.data.data.matches[0]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed');
      setLookup(null);
    } finally {
      setSearching(false);
    }
  };

  const handleLog = async (recordType, match = null) => {
    setLogging(true);
    try {
      const payload = match || selected
        ? { allocationId: (match || selected).allocationId, recordType }
        : { ...unregistered, vehicleNumber: unregistered.vehicleNumber || `XXXX${digits}`, recordType };

      const res = await gateApi.log(payload);
      toast.success(`Vehicle ${recordType === 'Entry' ? 'IN' : 'OUT'} recorded`);
      if (match || selected) {
        setSelected({ ...(match || selected), currentStatus: res.data.data.vehicle.currentStatus });
      }
      setLookup((prev) => {
        if (!prev?.matches) return prev;
        const id = (match || selected)?.allocationId;
        return {
          ...prev,
          matches: prev.matches.map((m) =>
            m.allocationId === id ? { ...m, currentStatus: res.data.data.vehicle.currentStatus } : m
          ),
        };
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log');
    } finally {
      setLogging(false);
    }
  };

  const showUnregistered = lookup && !lookup.found;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Gate — Vehicle IN / OUT</h1>
        <p className="mt-1 text-sm text-slate-500">Watchman: enter last 4 digits of vehicle number</p>
      </div>

      <form onSubmit={handleSearch} className="card mb-6">
        <label className="label-text mb-2 block text-center">Last 4 Digits</label>
        <div className="flex justify-center gap-3">
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={digits}
            onChange={(e) => setDigits(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="input-field w-40 text-center text-3xl font-bold tracking-[0.5em]"
            placeholder="1234"
            autoFocus
          />
          <button type="submit" disabled={searching} className="btn-primary px-6">
            <Search className="h-5 w-5" />
            {searching ? '...' : 'Search'}
          </button>
        </div>
      </form>

      {lookup?.found && (
        <div className="space-y-4">
          <p className="text-center text-sm font-medium text-emerald-600">Registered vehicle found</p>
          {lookup.matches.map((match) => (
            <div key={match.allocationId} className={`card border-2 ${selected?.allocationId === match.allocationId ? 'border-brand-500' : 'border-transparent'}`}>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{match.vehicleNumber}</p>
                  <p className="text-sm text-slate-500">Ends with {digits}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${match.currentStatus === 'Inside' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {match.currentStatus === 'Inside' ? 'Inside Society' : 'Outside Society'}
                </span>
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                  <User className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Owner</p>
                    <p className="font-medium">{match.holderName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                  <Home className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Flat</p>
                    <p className="font-medium">{match.flatNumber}{match.wing ? ` (${match.wing})` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                  <ParkingCircle className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Parking Slot</p>
                    <p className="font-medium">{match.slotNumber}</p>
                  </div>
                </div>
              </div>

              {match.lastLog && (
                <p className="mb-4 text-xs text-slate-400">
                  Last: {match.lastLog.recordType} at {formatDateTime(match.lastLog.scannedAt)}
                </p>
              )}

              {lookup.matches.length > 1 && selected?.allocationId !== match.allocationId && (
                <button type="button" onClick={() => setSelected(match)} className="mb-3 text-sm text-brand-600 hover:underline">Select this vehicle</button>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={logging || (lookup.matches.length > 1 && selected?.allocationId !== match.allocationId)}
                  onClick={() => handleLog('Entry', match)}
                  className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  <LogIn className="h-5 w-5" /> Vehicle IN
                </button>
                <button
                  type="button"
                  disabled={logging || (lookup.matches.length > 1 && selected?.allocationId !== match.allocationId)}
                  onClick={() => handleLog('Exit', match)}
                  className="btn-primary flex-1 bg-amber-600 hover:bg-amber-700"
                >
                  <LogOut className="h-5 w-5" /> Vehicle OUT
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUnregistered && (
        <div className="card border-2 border-dashed border-amber-300 bg-amber-50/50">
          <div className="mb-4 flex items-center gap-2 text-amber-700">
            <Car className="h-5 w-5" />
            <p className="font-semibold">Vehicle not registered — enter details</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label-text">Full Vehicle Number *</label>
              <input
                value={unregistered.vehicleNumber}
                onChange={(e) => setUnregistered({ ...unregistered, vehicleNumber: e.target.value.toUpperCase() })}
                className="input-field"
                placeholder={`e.g. MH01AB${digits}`}
              />
            </div>
            <div>
              <label className="label-text">Name *</label>
              <input
                value={unregistered.holderName}
                onChange={(e) => setUnregistered({ ...unregistered, holderName: e.target.value })}
                className="input-field"
                placeholder="Visitor / driver name"
              />
            </div>
            <div>
              <label className="label-text">Mobile Number</label>
              <input
                value={unregistered.mobile}
                onChange={(e) => setUnregistered({ ...unregistered, mobile: e.target.value })}
                className="input-field"
                placeholder="10-digit mobile"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={logging || !unregistered.holderName}
                onClick={() => handleLog('Entry')}
                className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                <LogIn className="h-5 w-5" /> Vehicle IN
              </button>
              <button
                type="button"
                disabled={logging || !unregistered.holderName}
                onClick={() => handleLog('Exit')}
                className="btn-primary flex-1 bg-amber-600 hover:bg-amber-700"
              >
                <LogOut className="h-5 w-5" /> Vehicle OUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

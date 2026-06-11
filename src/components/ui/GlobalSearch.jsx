import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, User, Car } from 'lucide-react';
import { flatsApi } from '../../api/members';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    clearTimeout(timer.current);
    if (!value.trim()) {
      setResults(null);
      return;
    }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await flatsApi.search(value);
        setResults(res.data.data);
        setOpen(true);
      } catch {
        setResults({ flats: [], owners: [], vehicles: [] });
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const goToFlat = (id) => {
    setOpen(false);
    setQuery('');
    navigate(`/members/flat360/${id}`);
  };

  const hasResults =
    results &&
    (results.flats?.length || results.owners?.length || results.vehicles?.length);

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search flat, owner, mobile, vehicle..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results && setOpen(true)}
          className="input-field pl-10"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        )}
      </div>

      {open && query && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-surface-border bg-white shadow-card">
          {!hasResults ? (
            <p className="p-4 text-sm text-slate-500">No results found</p>
          ) : (
            <>
              {results.flats?.length > 0 && (
                <div className="border-b border-surface-border p-2">
                  <p className="px-2 py-1 text-xs font-semibold uppercase text-slate-400">Flats</p>
                  {results.flats.map((flat) => (
                    <button
                      key={flat._id}
                      type="button"
                      onClick={() => goToFlat(flat._id)}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-slate-50"
                    >
                      <Building2 className="h-4 w-4 text-brand-600" />
                      <div>
                        <p className="text-sm font-medium">{flat.flatNumber}</p>
                        <p className="text-xs text-slate-500">
                          Wing {flat.wing} · Floor {flat.floor}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {results.owners?.length > 0 && (
                <div className="border-b border-surface-border p-2">
                  <p className="px-2 py-1 text-xs font-semibold uppercase text-slate-400">Owners</p>
                  {results.owners.map((owner) => (
                    <button
                      key={owner._id}
                      type="button"
                      onClick={() => goToFlat(owner.flatId?._id || owner.flatId)}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-slate-50"
                    >
                      <User className="h-4 w-4 text-brand-600" />
                      <div>
                        <p className="text-sm font-medium">{owner.fullName}</p>
                        <p className="text-xs text-slate-500">
                          {owner.mobile} · Flat {owner.flatId?.flatNumber}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {results.vehicles?.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1 text-xs font-semibold uppercase text-slate-400">Vehicles</p>
                  {results.vehicles.map((vehicle) => (
                    <button
                      key={vehicle._id}
                      type="button"
                      onClick={() => goToFlat(vehicle.flatId?._id || vehicle.flatId)}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-slate-50"
                    >
                      <Car className="h-4 w-4 text-brand-600" />
                      <div>
                        <p className="text-sm font-medium">{vehicle.vehicleNumber}</p>
                        <p className="text-xs text-slate-500">
                          Flat {vehicle.flatId?.flatNumber}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

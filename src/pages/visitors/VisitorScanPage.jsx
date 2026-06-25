import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { ScanLine, LogIn, LogOut, User, Home, Clock } from 'lucide-react';
import { scanApi } from '../../api/visitors';
import { assetUrl, flatLabel, formatDateTime } from '../../lib/visitorUtils';

export default function VisitorScanPage() {
  const [manualToken, setManualToken] = useState('');
  const [activeToken, setActiveToken] = useState('');
  const [lookup, setLookup] = useState(null);
  const [searching, setSearching] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [useCamera, setUseCamera] = useState(true);
  const scannerRef = useRef(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    if (!useCamera) return undefined;

    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
    }, false);

    scanner.render(
      (decoded) => {
        if (scannedRef.current) return;
        scannedRef.current = true;
        handleLookup(decoded).finally(() => {
          setTimeout(() => { scannedRef.current = false; }, 2000);
        });
      },
      () => {}
    );
    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [useCamera]);

  const handleLookup = async (token) => {
    const value = (token || manualToken).trim();
    if (!value) {
      toast.error('Enter or scan a QR code');
      return;
    }
    setSearching(true);
    try {
      const res = await scanApi.lookup(value);
      setActiveToken(value);
      setLookup(res.data.data);
      if (!res.data.data.found) toast.error(res.data.data.message);
      else if (res.data.data.invalid) toast.error(res.data.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lookup failed');
      setLookup(null);
    } finally {
      setSearching(false);
    }
  };

  const handleScan = async () => {
    if (!lookup?.found || lookup.invalid) return;
    setProcessing(true);
    try {
      const res = await scanApi.process(activeToken || manualToken);
      const { action, currentStatus, visitor } = res.data.data;
      toast.success(`${action} recorded — Status: ${currentStatus}`);
      setLookup({
        ...lookup,
        currentStatus,
        lastAction: action,
        lastTimestamp: res.data.data.timestamp,
        visitor,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Scan failed');
    } finally {
      setProcessing(false);
    }
  };

  const isInside = lookup?.currentStatus === 'Inside';

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Visitor QR Scanner</h1>
        <p className="mt-1 text-sm text-slate-500">Scan QR for daily staff and guest entry/exit</p>
      </div>

      <div className="mb-4 flex justify-center gap-2">
        <button type="button" onClick={() => setUseCamera(true)} className={`rounded-lg px-4 py-2 text-sm ${useCamera ? 'bg-brand-600 text-white' : 'bg-slate-100'}`}>Camera Scan</button>
        <button type="button" onClick={() => setUseCamera(false)} className={`rounded-lg px-4 py-2 text-sm ${!useCamera ? 'bg-brand-600 text-white' : 'bg-slate-100'}`}>Manual Entry</button>
      </div>

      {useCamera ? (
        <div className="card mb-6 overflow-hidden">
          <div id="qr-reader" className="w-full" />
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); handleLookup(manualToken); }}
          className="card mb-6"
        >
          <label className="label-text">QR Token or Code Data</label>
          <div className="flex gap-3">
            <input
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              className="input-field flex-1"
              placeholder="Paste QR data or token"
            />
            <button type="submit" disabled={searching} className="btn-primary">
              <ScanLine className="h-5 w-5" />
              {searching ? '...' : 'Lookup'}
            </button>
          </div>
        </form>
      )}

      {lookup?.found && !lookup.invalid && (
        <div className="card border-2 border-brand-200">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex gap-4">
              {lookup.photo && <img src={assetUrl(lookup.photo)} alt="" className="h-16 w-16 rounded-lg object-cover" />}
              <div>
                <p className="text-2xl font-bold">{lookup.name}</p>
                <p className="text-sm text-slate-500">{lookup.category}{lookup.staffType ? ` · ${lookup.staffType}` : ''}</p>
                <p className="text-sm text-slate-500">{lookup.mobile}</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isInside ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {lookup.currentStatus}
            </span>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            {lookup.flats && (
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                <Home className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Flats</p>
                  <p className="font-medium">{lookup.flats.map(flatLabel).join(', ')}</p>
                </div>
              </div>
            )}
            {lookup.flat && (
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                <Home className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Visiting Flat</p>
                  <p className="font-medium">{flatLabel(lookup.flat)}</p>
                </div>
              </div>
            )}
            {lookup.resident && (
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                <User className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Host</p>
                  <p className="font-medium">{lookup.resident.name}</p>
                </div>
              </div>
            )}
            {lookup.visitingDate && (
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Visit Date</p>
                  <p className="font-medium">{new Date(lookup.visitingDate).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            )}
          </div>

          {lookup.lastAction && (
            <p className="mb-4 text-sm text-emerald-600">Last: {lookup.lastAction} at {formatDateTime(lookup.lastTimestamp)}</p>
          )}

          <button
            type="button"
            disabled={processing}
            onClick={handleScan}
            className={`btn-primary w-full ${isInside ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {isInside ? <><LogOut className="h-5 w-5" /> Record EXIT</> : <><LogIn className="h-5 w-5" /> Record ENTRY</>}
          </button>
        </div>
      )}

      {lookup?.invalid && (
        <div className="card border-2 border-red-200 bg-red-50">
          <p className="font-semibold text-red-700">{lookup.message}</p>
          <p className="text-sm text-red-600">{lookup.name} — {new Date(lookup.visitingDate).toLocaleDateString('en-IN')}</p>
        </div>
      )}
    </div>
  );
}

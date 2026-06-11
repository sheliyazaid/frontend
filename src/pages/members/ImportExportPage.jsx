import { useState } from 'react';
import { Download, Upload, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';
import { importExportApi } from '../../api/members';

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export default function ImportExportPage() {
  const [importType, setImportType] = useState('flats');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const downloadTemplate = async (type) => {
    try {
      const res = await importExportApi.downloadTemplate(type);
      downloadBlob(res.data, `${type}-template.xlsx`);
      toast.success('Template downloaded');
    } catch {
      toast.error('Download failed');
    }
  };

  const handlePreview = async () => {
    if (!file) {
      toast.error('Select a file first');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', importType);
      const res = await importExportApi.preview(fd);
      setPreview(res.data.data);
      toast.success(`Found ${res.data.data.count} records`);
    } catch {
      toast.error('Preview failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Select a file first');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', importType);
      const res = await importExportApi.import(fd);
      const { created, errors } = res.data.data;
      toast.success(`Imported ${created} records`);
      if (errors?.length) {
        toast.error(`${errors.length} rows had errors`);
      }
      setPreview(null);
      setFile(null);
    } catch {
      toast.error('Import failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type, format) => {
    try {
      const res = await importExportApi.export(type, format);
      downloadBlob(res.data, `${type}.${format}`);
      toast.success('Export downloaded');
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Import / Export</h1>
        <p className="mt-1 text-sm text-slate-500">Bulk import and export member data</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
              <Upload className="h-5 w-5 text-brand-600" />
            </div>
            <h2 className="font-semibold text-slate-900">Import Data</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label-text">Import Type</label>
              <select
                value={importType}
                onChange={(e) => { setImportType(e.target.value); setPreview(null); }}
                className="input-field"
              >
                <option value="flats">Flats</option>
                <option value="owners">Owners</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => downloadTemplate(importType)} className="btn-secondary">
                <Download className="h-4 w-4" />
                Download Template
              </button>
            </div>

            <div>
              <label className="label-text">Upload Excel File</label>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => { setFile(e.target.files[0]); setPreview(null); }}
                className="input-field"
              />
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={handlePreview} disabled={loading} className="btn-secondary">
                Preview Data
              </button>
              <button type="button" onClick={handleImport} disabled={loading} className="btn-primary">
                Import Records
              </button>
            </div>

            {preview && (
              <div className="rounded-lg border border-surface-border p-4">
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Preview ({preview.count} records)
                </p>
                <div className="max-h-48 overflow-auto text-xs">
                  <pre className="text-slate-600">
                    {JSON.stringify(preview.preview, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="font-semibold text-slate-900">Export Data</h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-surface-border p-4">
              <p className="mb-3 font-medium text-slate-900">Flats</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => handleExport('flats', 'xlsx')} className="btn-secondary">
                  Export Excel
                </button>
                <button type="button" onClick={() => handleExport('flats', 'csv')} className="btn-secondary">
                  Export CSV
                </button>
              </div>
            </div>
            <div className="rounded-lg border border-surface-border p-4">
              <p className="mb-3 font-medium text-slate-900">Owners</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => handleExport('owners', 'xlsx')} className="btn-secondary">
                  Export Excel
                </button>
                <button type="button" onClick={() => handleExport('owners', 'csv')} className="btn-secondary">
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Construction } from 'lucide-react';

export default function ComingSoon({ title }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50">
        <Construction className="h-10 w-10 text-brand-600" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 max-w-md text-slate-500">
        This module is under development. Check back soon for new features.
      </p>
      <span className="mt-6 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
        Coming Soon
      </span>
    </div>
  );
}

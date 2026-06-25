import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Truck, LogOut } from 'lucide-react';
import { deliveryApi } from '../../api/visitors';
import { flatsApi } from '../../api/members';
import { deliveryEntrySchema } from '../../lib/schemas';
import FlatSelect from '../../components/members/FlatSelect';
import StatusBadge from '../../components/ui/StatusBadge';
import { flatLabel, formatDateTime } from '../../lib/visitorUtils';

export default function DeliveryEntryPage() {
  const [flats, setFlats] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [insideDeliveries, setInsideDeliveries] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(deliveryEntrySchema),
  });

  const loadInside = () => {
    deliveryApi.list({ status: 'Inside', limit: 20 }).then((res) => setInsideDeliveries(res.data.data));
  };

  useEffect(() => {
    flatsApi.list({ limit: 500 }).then((res) => setFlats(res.data.data || []));
    loadInside();
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await deliveryApi.create(data);
      toast.success('Delivery entry recorded');
      reset();
      loadInside();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record entry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExit = async (id) => {
    try {
      await deliveryApi.exit(id);
      toast.success('Exit recorded');
      loadInside();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record exit');
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Delivery Entry</h1>
        <p className="mt-1 text-sm text-slate-500">Record delivery personnel entry and exit</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card mb-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700">
          <Truck className="h-5 w-5" />
          <p className="font-semibold">New Delivery Entry</p>
        </div>
        <div>
          <label className="label-text">Delivery Person Name *</label>
          <input {...register('deliveryPersonName')} className="input-field" placeholder="Full name" />
          {errors.deliveryPersonName && <p className="mt-1 text-xs text-red-500">{errors.deliveryPersonName.message}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text">Mobile Number</label>
            <input {...register('mobile')} className="input-field" placeholder="10-digit mobile" />
          </div>
          <div>
            <label className="label-text">Company Name *</label>
            <input {...register('companyName')} className="input-field" placeholder="Amazon, Swiggy, etc." />
            {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName.message}</p>}
          </div>
        </div>
        <FlatSelect register={register} errors={errors} flats={flats} />
        <div>
          <label className="label-text">Parcel Type (optional)</label>
          <input {...register('parcelType')} className="input-field" placeholder="Food, Package, Documents..." />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700">
          Record Entry
        </button>
      </form>

      <div className="card">
        <h2 className="mb-4 font-semibold">Delivery Personnel Inside ({insideDeliveries.length})</h2>
        {insideDeliveries.length === 0 ? (
          <p className="text-sm text-slate-400">No delivery personnel inside</p>
        ) : (
          <div className="space-y-3">
            {insideDeliveries.map((d) => (
              <div key={d._id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{d.deliveryPersonName}</p>
                  <p className="text-sm text-slate-500">{d.companyName} · Flat {flatLabel(d.flatId)}</p>
                  <p className="text-xs text-slate-400">Entry: {formatDateTime(d.entryTime)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status="Inside" />
                  <button type="button" onClick={() => handleExit(d._id)} className="btn-secondary text-xs">
                    <LogOut className="h-3.5 w-3.5" /> Exit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

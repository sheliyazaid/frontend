import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import { dailyStaffApi } from '../../api/visitors';
import { flatsApi } from '../../api/members';
import { dailyStaffSchema } from '../../lib/schemas';

const STAFF_TYPES = ['Maid', 'Cook', 'Driver', 'Cleaner', 'Tutor', 'Newspaper Vendor', 'Milkman', 'Other'];

export default function RegisterStaffPage() {
  const [flats, setFlats] = useState([]);
  const [selectedFlats, setSelectedFlats] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(dailyStaffSchema),
    defaultValues: { flatIds: [] },
  });

  useEffect(() => {
    flatsApi.list({ limit: 500 }).then((res) => setFlats(res.data.data || []));
  }, []);

  const toggleFlat = (flatId) => {
    const next = selectedFlats.includes(flatId)
      ? selectedFlats.filter((id) => id !== flatId)
      : [...selectedFlats, flatId];
    setSelectedFlats(next);
    setValue('flatIds', next, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'flatIds') formData.append('flatIds', JSON.stringify(value));
        else if (value) formData.append(key, value);
      });
      if (photo) formData.append('photo', photo);
      if (idProof) formData.append('idProof', idProof);

      await dailyStaffApi.register(formData);
      toast.success('Daily staff registered — sent to admin for approval');
      setSelectedFlats([]);
      setPhoto(null);
      setIdProof(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Register Daily Staff</h1>
        <p className="mt-1 text-sm text-slate-500">One-time registration — admin approval required</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <div className="flex items-center gap-2 text-brand-700">
          <UserPlus className="h-5 w-5" />
          <p className="font-semibold">Staff Details</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text">Full Name *</label>
            <input {...register('fullName')} className="input-field" />
            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="label-text">Mobile Number *</label>
            <input {...register('mobile')} className="input-field" />
            {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
          </div>
        </div>

        <div>
          <label className="label-text">Address</label>
          <textarea {...register('address')} className="input-field" rows={2} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text">Emergency Contact</label>
            <input {...register('emergencyContact')} className="input-field" />
          </div>
          <div>
            <label className="label-text">Staff Type *</label>
            <select {...register('staffType')} className="input-field">
              <option value="">Select type</option>
              {STAFF_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.staffType && <p className="mt-1 text-xs text-red-500">{errors.staffType.message}</p>}
          </div>
        </div>

        <div>
          <label className="label-text">Flats Assigned *</label>
          <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border p-3">
            <div className="flex flex-wrap gap-2">
              {flats.map((flat) => (
                <button
                  key={flat._id}
                  type="button"
                  onClick={() => toggleFlat(flat._id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${selectedFlats.includes(flat._id) ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  {flat.wing ? `${flat.wing}-` : ''}{flat.flatNumber}
                </button>
              ))}
            </div>
          </div>
          {errors.flatIds && <p className="mt-1 text-xs text-red-500">{errors.flatIds.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text">Work Description</label>
            <input {...register('workDescription')} className="input-field" placeholder="Cleaning, Cooking..." />
          </div>
          <div>
            <label className="label-text">Working Time Slot</label>
            <input {...register('workingTimeSlot')} className="input-field" placeholder="9 AM - 1 PM" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text">Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0])} className="input-field" />
          </div>
          <div>
            <label className="label-text">Aadhaar / ID Proof (optional)</label>
            <input type="file" accept="image/*,.pdf" onChange={(e) => setIdProof(e.target.files?.[0])} className="input-field" />
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          Submit for Approval
        </button>
      </form>
    </div>
  );
}

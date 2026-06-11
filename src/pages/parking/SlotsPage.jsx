import { ParkingCircle } from 'lucide-react';
import ParkingCrudPage from '../../components/parking/ParkingCrudPage';
import { slotsApi } from '../../api/parking';
import StatusBadge from '../../components/ui/StatusBadge';
import { z } from 'zod';

const schema = z.object({
  slotNumber: z.string().min(1, 'Slot number required'),
  floor: z.string().optional(),
  notes: z.string().optional(),
});

export default function SlotsPage() {
  return (
    <ParkingCrudPage
      title="Parking Slots"
      description="Secretary creates parking slots for the society"
      api={slotsApi}
      schema={schema}
      emptyIcon={ParkingCircle}
      filters={[
        { key: 'slotStatus', label: 'All Status', options: [
          { value: 'Available', label: 'Available' },
          { value: 'Occupied', label: 'Occupied' },
        ]},
      ]}
      defaultValues={{ slotNumber: '', floor: 'B1', notes: '' }}
      columns={[
        { key: 'slotNumber', label: 'Slot Number' },
        { key: 'floor', label: 'Floor' },
        { key: 'slotStatus', label: 'Status', render: (r) => <StatusBadge status={r.slotStatus} /> },
        { key: 'notes', label: 'Notes', render: (r) => r.notes || '-' },
      ]}
      renderForm={({ register, errors }) => (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text">Slot Number *</label>
            <input {...register('slotNumber')} className="input-field" placeholder="B1-001" />
            {errors.slotNumber && <p className="mt-1 text-xs text-red-500">{errors.slotNumber.message}</p>}
          </div>
          <div>
            <label className="label-text">Floor</label>
            <input {...register('floor')} className="input-field" placeholder="B1" />
          </div>
          <div className="sm:col-span-2">
            <label className="label-text">Notes</label>
            <textarea {...register('notes')} rows={2} className="input-field" />
          </div>
        </div>
      )}
    />
  );
}

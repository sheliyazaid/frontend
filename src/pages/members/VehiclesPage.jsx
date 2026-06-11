import { Car } from 'lucide-react';
import MemberCrudPage from '../../components/members/MemberCrudPage';
import FlatSelect from '../../components/members/FlatSelect';
import { vehiclesApi } from '../../api/members';
import { vehicleSchema } from '../../lib/schemas';

export default function VehiclesPage() {
  return (
    <MemberCrudPage
      title="Vehicles"
      description="Track vehicles and parking slots"
      api={vehiclesApi}
      schema={vehicleSchema}
      emptyIcon={Car}
      getFlatLink
      filters={[
        {
          key: 'vehicleType',
          label: 'All Types',
          options: [
            { value: 'Car', label: 'Car' },
            { value: 'Bike', label: 'Bike' },
            { value: 'Scooter', label: 'Scooter' },
            { value: 'EV', label: 'EV' },
          ],
        },
      ]}
      defaultValues={{
        flatId: '',
        vehicleNumber: '',
        vehicleType: 'Car',
        parkingSlot: '',
        brand: '',
        color: '',
      }}
      columns={[
        { key: 'vehicleNumber', label: 'Number' },
        { key: 'flatId', label: 'Flat', render: (r) => r.flatId?.flatNumber || '-' },
        { key: 'vehicleType', label: 'Type' },
        { key: 'parkingSlot', label: 'Parking Slot' },
        { key: 'brand', label: 'Brand' },
        { key: 'color', label: 'Color' },
      ]}
      renderForm={({ register, errors, flats }) => (
        <div className="grid gap-4 sm:grid-cols-2">
          <FlatSelect register={register} errors={errors} flats={flats} />
          <div>
            <label className="label-text">Vehicle Number *</label>
            <input {...register('vehicleNumber')} className="input-field" />
            {errors.vehicleNumber && <p className="mt-1 text-xs text-red-500">{errors.vehicleNumber.message}</p>}
          </div>
          <div>
            <label className="label-text">Vehicle Type *</label>
            <select {...register('vehicleType')} className="input-field">
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Scooter">Scooter</option>
              <option value="EV">EV</option>
            </select>
          </div>
          <div>
            <label className="label-text">Parking Slot</label>
            <input {...register('parkingSlot')} className="input-field" />
          </div>
          <div>
            <label className="label-text">Brand</label>
            <input {...register('brand')} className="input-field" />
          </div>
          <div>
            <label className="label-text">Color</label>
            <input {...register('color')} className="input-field" />
          </div>
        </div>
      )}
    />
  );
}

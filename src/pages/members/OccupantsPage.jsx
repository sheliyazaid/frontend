import { Home } from 'lucide-react';
import MemberCrudPage from '../../components/members/MemberCrudPage';
import FlatSelect from '../../components/members/FlatSelect';
import { occupantsApi } from '../../api/members';
import { occupantSchema } from '../../lib/schemas';
import StatusBadge from '../../components/ui/StatusBadge';

export default function OccupantsPage() {
  return (
    <MemberCrudPage
      title="Occupants"
      description="Track who lives in each flat"
      api={occupantsApi}
      schema={occupantSchema}
      emptyIcon={Home}
      getFlatLink
      filters={[
        {
          key: 'type',
          label: 'All Types',
          options: [
            { value: 'Owner', label: 'Owner' },
            { value: 'Tenant', label: 'Tenant' },
            { value: 'Family Member', label: 'Family Member' },
          ],
        },
      ]}
      defaultValues={{ flatId: '', name: '', mobile: '', relation: '', type: 'Owner' }}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'flatId', label: 'Flat', render: (r) => r.flatId?.flatNumber || '-' },
        { key: 'mobile', label: 'Mobile' },
        { key: 'relation', label: 'Relation' },
        { key: 'type', label: 'Type', render: (r) => <StatusBadge status={r.type} /> },
      ]}
      renderForm={({ register, errors, flats }) => (
        <div className="grid gap-4 sm:grid-cols-2">
          <FlatSelect register={register} errors={errors} flats={flats} />
          <div>
            <label className="label-text">Name *</label>
            <input {...register('name')} className="input-field" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label-text">Mobile</label>
            <input {...register('mobile')} className="input-field" />
          </div>
          <div>
            <label className="label-text">Relation</label>
            <input {...register('relation')} className="input-field" />
          </div>
          <div>
            <label className="label-text">Type *</label>
            <select {...register('type')} className="input-field">
              <option value="Owner">Owner</option>
              <option value="Tenant">Tenant</option>
              <option value="Family Member">Family Member</option>
            </select>
          </div>
        </div>
      )}
    />
  );
}

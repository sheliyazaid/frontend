import { User } from 'lucide-react';
import MemberCrudPage from '../../components/members/MemberCrudPage';
import FlatSelect from '../../components/members/FlatSelect';
import { ownersApi } from '../../api/members';
import { ownerSchema } from '../../lib/schemas';
import StatusBadge from '../../components/ui/StatusBadge';

export default function OwnersPage() {
  return (
    <MemberCrudPage
      title="Owners"
      description="Manage flat owners and primary owner designation"
      api={ownersApi}
      schema={ownerSchema}
      emptyIcon={User}
      getFlatLink
      defaultValues={{
        flatId: '',
        fullName: '',
        mobile: '',
        alternateMobile: '',
        email: '',
        aadhaarNumber: '',
        panNumber: '',
        ownershipStartDate: '',
        isPrimary: false,
      }}
      columns={[
        { key: 'fullName', label: 'Name' },
        {
          key: 'flatId',
          label: 'Flat',
          render: (row) => row.flatId?.flatNumber || '-',
        },
        { key: 'mobile', label: 'Mobile' },
        { key: 'email', label: 'Email' },
        {
          key: 'isPrimary',
          label: 'Primary',
          render: (row) =>
            row.isPrimary ? (
              <StatusBadge status="Verified" />
            ) : (
              <span className="text-slate-400">-</span>
            ),
        },
      ]}
      renderForm={({ register, errors, flats }) => (
        <div className="grid gap-4 sm:grid-cols-2">
          <FlatSelect register={register} errors={errors} flats={flats} />
          <div>
            <label className="label-text">Full Name *</label>
            <input {...register('fullName')} className="input-field" />
            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="label-text">Mobile *</label>
            <input {...register('mobile')} className="input-field" />
            {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
          </div>
          <div>
            <label className="label-text">Alternate Mobile</label>
            <input {...register('alternateMobile')} className="input-field" />
          </div>
          <div>
            <label className="label-text">Email</label>
            <input type="email" {...register('email')} className="input-field" />
          </div>
          <div>
            <label className="label-text">Aadhaar Number</label>
            <input {...register('aadhaarNumber')} className="input-field" />
          </div>
          <div>
            <label className="label-text">PAN Number</label>
            <input {...register('panNumber')} className="input-field" />
          </div>
          <div>
            <label className="label-text">Ownership Start Date</label>
            <input type="date" {...register('ownershipStartDate')} className="input-field" />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" {...register('isPrimary')} id="isPrimary" className="rounded" />
            <label htmlFor="isPrimary" className="text-sm text-slate-700">Primary Owner</label>
          </div>
        </div>
      )}
    />
  );
}

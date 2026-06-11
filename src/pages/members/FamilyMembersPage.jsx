import { Heart } from 'lucide-react';
import MemberCrudPage from '../../components/members/MemberCrudPage';
import FlatSelect from '../../components/members/FlatSelect';
import { familyMembersApi } from '../../api/members';
import { familyMemberSchema } from '../../lib/schemas';

export default function FamilyMembersPage() {
  return (
    <MemberCrudPage
      title="Family Members"
      description="Manage family members linked to flats"
      api={familyMembersApi}
      schema={familyMemberSchema}
      emptyIcon={Heart}
      getFlatLink
      defaultValues={{ flatId: '', name: '', relation: '', mobile: '', dateOfBirth: '' }}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'flatId', label: 'Flat', render: (r) => r.flatId?.flatNumber || '-' },
        { key: 'relation', label: 'Relation' },
        { key: 'mobile', label: 'Mobile' },
        {
          key: 'dateOfBirth',
          label: 'Date of Birth',
          render: (r) => (r.dateOfBirth ? new Date(r.dateOfBirth).toLocaleDateString() : '-'),
        },
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
            <label className="label-text">Relation</label>
            <input {...register('relation')} className="input-field" />
          </div>
          <div>
            <label className="label-text">Mobile</label>
            <input {...register('mobile')} className="input-field" />
          </div>
          <div>
            <label className="label-text">Date of Birth</label>
            <input type="date" {...register('dateOfBirth')} className="input-field" />
          </div>
        </div>
      )}
    />
  );
}

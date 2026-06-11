import { Key } from 'lucide-react';
import MemberCrudPage from '../../components/members/MemberCrudPage';
import FlatSelect from '../../components/members/FlatSelect';
import { tenantsApi } from '../../api/members';
import { tenantSchema } from '../../lib/schemas';
import StatusBadge from '../../components/ui/StatusBadge';

export default function TenantsPage() {
  return (
    <MemberCrudPage
      title="Tenants"
      description="Manage tenant agreements and verification status"
      api={tenantsApi}
      schema={tenantSchema}
      emptyIcon={Key}
      getFlatLink
      filters={[
        {
          key: 'policeVerificationStatus',
          label: 'Verification',
          options: [
            { value: 'Pending', label: 'Pending' },
            { value: 'Verified', label: 'Verified' },
            { value: 'Rejected', label: 'Rejected' },
          ],
        },
      ]}
      defaultValues={{
        flatId: '',
        tenantName: '',
        mobile: '',
        agreementStartDate: '',
        agreementEndDate: '',
        policeVerificationStatus: 'Pending',
        idProof: '',
        isCurrent: true,
      }}
      columns={[
        { key: 'tenantName', label: 'Tenant' },
        { key: 'flatId', label: 'Flat', render: (r) => r.flatId?.flatNumber || '-' },
        { key: 'mobile', label: 'Mobile' },
        {
          key: 'agreementEndDate',
          label: 'Agreement End',
          render: (r) =>
            r.agreementEndDate ? new Date(r.agreementEndDate).toLocaleDateString() : '-',
        },
        {
          key: 'policeVerificationStatus',
          label: 'Verification',
          render: (r) => <StatusBadge status={r.policeVerificationStatus} />,
        },
        {
          key: 'isCurrent',
          label: 'Current',
          render: (r) => (r.isCurrent ? 'Yes' : 'No'),
        },
      ]}
      renderForm={({ register, errors, flats }) => (
        <div className="grid gap-4 sm:grid-cols-2">
          <FlatSelect register={register} errors={errors} flats={flats} />
          <div>
            <label className="label-text">Tenant Name *</label>
            <input {...register('tenantName')} className="input-field" />
            {errors.tenantName && <p className="mt-1 text-xs text-red-500">{errors.tenantName.message}</p>}
          </div>
          <div>
            <label className="label-text">Mobile *</label>
            <input {...register('mobile')} className="input-field" />
            {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
          </div>
          <div>
            <label className="label-text">Agreement Start</label>
            <input type="date" {...register('agreementStartDate')} className="input-field" />
          </div>
          <div>
            <label className="label-text">Agreement End</label>
            <input type="date" {...register('agreementEndDate')} className="input-field" />
          </div>
          <div>
            <label className="label-text">Police Verification</label>
            <select {...register('policeVerificationStatus')} className="input-field">
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
              <option value="Not Required">Not Required</option>
            </select>
          </div>
          <div>
            <label className="label-text">ID Proof</label>
            <input {...register('idProof')} className="input-field" />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" {...register('isCurrent')} id="isCurrent" className="rounded" />
            <label htmlFor="isCurrent" className="text-sm text-slate-700">Current Tenant</label>
          </div>
        </div>
      )}
    />
  );
}

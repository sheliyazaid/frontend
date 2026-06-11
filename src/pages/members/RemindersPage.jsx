import { AlarmClock } from 'lucide-react';
import MemberCrudPage from '../../components/members/MemberCrudPage';
import FlatSelect from '../../components/members/FlatSelect';
import { remindersApi } from '../../api/members';
import { reminderSchema } from '../../lib/schemas';
import StatusBadge from '../../components/ui/StatusBadge';

export default function RemindersPage() {
  return (
    <MemberCrudPage
      title="Reminders"
      description="Track follow-ups and expiry reminders"
      api={remindersApi}
      schema={reminderSchema}
      emptyIcon={AlarmClock}
      getFlatLink
      filters={[
        {
          key: 'reminderStatus',
          label: 'All Status',
          options: [
            { value: 'Pending', label: 'Pending' },
            { value: 'Completed', label: 'Completed' },
          ],
        },
      ]}
      defaultValues={{
        flatId: '',
        title: '',
        description: '',
        dueDate: '',
        reminderStatus: 'Pending',
      }}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'flatId', label: 'Flat', render: (r) => r.flatId?.flatNumber || '-' },
        {
          key: 'dueDate',
          label: 'Due Date',
          render: (r) => new Date(r.dueDate).toLocaleDateString(),
        },
        {
          key: 'reminderStatus',
          label: 'Status',
          render: (r) => <StatusBadge status={r.reminderStatus} />,
        },
      ]}
      renderForm={({ register, errors, flats }) => (
        <div className="grid gap-4 sm:grid-cols-2">
          <FlatSelect register={register} errors={errors} flats={flats} />
          <div>
            <label className="label-text">Title *</label>
            <input {...register('title')} className="input-field" />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label-text">Due Date *</label>
            <input type="date" {...register('dueDate')} className="input-field" />
            {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate.message}</p>}
          </div>
          <div>
            <label className="label-text">Status</label>
            <select {...register('reminderStatus')} className="input-field">
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label-text">Description</label>
            <textarea {...register('description')} rows={3} className="input-field" />
          </div>
        </div>
      )}
    />
  );
}

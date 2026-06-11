import { StickyNote } from 'lucide-react';
import MemberCrudPage from '../../components/members/MemberCrudPage';
import FlatSelect from '../../components/members/FlatSelect';
import { notesApi } from '../../api/members';
import { noteSchema } from '../../lib/schemas';

export default function NotesPage() {
  return (
    <MemberCrudPage
      title="Notes"
      description="Secretary notes and special instructions"
      api={notesApi}
      schema={noteSchema}
      emptyIcon={StickyNote}
      getFlatLink
      defaultValues={{ flatId: '', title: '', content: '' }}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'flatId', label: 'Flat', render: (r) => r.flatId?.flatNumber || '-' },
        {
          key: 'content',
          label: 'Content',
          render: (r) => (
            <span className="line-clamp-1 max-w-xs text-slate-500">{r.content}</span>
          ),
        },
        {
          key: 'createdAt',
          label: 'Created',
          render: (r) => new Date(r.createdAt).toLocaleDateString(),
        },
      ]}
      renderForm={({ register, errors, flats }) => (
        <div className="space-y-4">
          <FlatSelect register={register} errors={errors} flats={flats} />
          <div>
            <label className="label-text">Title *</label>
            <input {...register('title')} className="input-field" />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label-text">Content *</label>
            <textarea {...register('content')} rows={4} className="input-field" />
            {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
          </div>
        </div>
      )}
    />
  );
}

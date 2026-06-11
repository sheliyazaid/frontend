export default function FlatSelect({ register, errors, flats, name = 'flatId', required = true }) {
  return (
    <div>
      <label className="label-text">Flat{required ? ' *' : ''}</label>
      <select {...register(name)} className="input-field">
        <option value="">Select flat</option>
        {flats.map((flat) => (
          <option key={flat._id} value={flat._id}>
            {flat.wing ? `${flat.wing}-` : ''}{flat.flatNumber}
          </option>
        ))}
      </select>
      {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name].message}</p>}
    </div>
  );
}

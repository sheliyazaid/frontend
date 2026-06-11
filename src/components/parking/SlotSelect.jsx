export default function SlotSelect({ register, errors, slots, name = 'slotId', filter }) {
  const filtered = filter ? slots.filter(filter) : slots;
  return (
    <div>
      <label className="label-text">Parking Slot *</label>
      <select {...register(name)} className="input-field">
        <option value="">Select slot</option>
        {filtered.map((slot) => (
          <option key={slot._id} value={slot._id}>
            {slot.slotNumber} ({slot.floor || slot.areaId?.name || '-'} · {slot.vehicleType || '-'} · {slot.slotStatus})
          </option>
        ))}
      </select>
      {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name].message}</p>}
    </div>
  );
}

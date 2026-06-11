import { z } from 'zod';

export const flatSchema = z.object({
  flatNumber: z.string().min(1, 'Flat number is required'),
  wing: z.string().optional(),
  floor: z.coerce.number().optional(),
  flatStatus: z.enum(['Occupied', 'Vacant', 'Under Maintenance']),
  notes: z.string().optional(),
});

export const ownerSchema = z.object({
  flatId: z.string().min(1, 'Flat is required'),
  fullName: z.string().min(1, 'Name is required'),
  mobile: z.string().min(10, 'Valid mobile required'),
  alternateMobile: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  aadhaarNumber: z.string().optional(),
  panNumber: z.string().optional(),
  ownershipStartDate: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

export const occupantSchema = z.object({
  flatId: z.string().min(1, 'Flat is required'),
  name: z.string().min(1, 'Name is required'),
  mobile: z.string().optional(),
  relation: z.string().optional(),
  type: z.enum(['Owner', 'Tenant', 'Family Member']),
});

export const familyMemberSchema = z.object({
  flatId: z.string().min(1, 'Flat is required'),
  name: z.string().min(1, 'Name is required'),
  relation: z.string().optional(),
  mobile: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export const tenantSchema = z.object({
  flatId: z.string().min(1, 'Flat is required'),
  tenantName: z.string().min(1, 'Tenant name is required'),
  mobile: z.string().min(10, 'Valid mobile required'),
  agreementStartDate: z.string().optional(),
  agreementEndDate: z.string().optional(),
  policeVerificationStatus: z.enum(['Pending', 'Verified', 'Rejected', 'Not Required']).optional(),
  idProof: z.string().optional(),
  isCurrent: z.boolean().optional(),
});

export const vehicleSchema = z.object({
  flatId: z.string().min(1, 'Flat is required'),
  vehicleNumber: z.string().min(1, 'Vehicle number is required'),
  vehicleType: z.enum(['Car', 'Bike', 'Scooter', 'EV']),
  parkingSlot: z.string().optional(),
  brand: z.string().optional(),
  color: z.string().optional(),
});

export const noteSchema = z.object({
  flatId: z.string().min(1, 'Flat is required'),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

export const reminderSchema = z.object({
  flatId: z.string().min(1, 'Flat is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  reminderStatus: z.enum(['Pending', 'Completed']).optional(),
});

export const tagSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
  color: z.string().optional(),
});

export const parkingSlotSchema = z.object({
  slotNumber: z.string().min(1, 'Slot number is required'),
  level: z.string().optional(),
  slotType: z.enum(['Resident', 'Visitor', 'EV', 'Reserved']),
  slotStatus: z.enum(['Available', 'Occupied', 'Reserved', 'Under Maintenance']),
  notes: z.string().optional(),
});

export const allocationSchema = z.object({
  slotId: z.string().min(1, 'Slot is required'),
  flatId: z.string().min(1, 'Flat is required'),
  vehicleNumber: z.string().min(1, 'Vehicle number is required'),
  holderName: z.string().min(1, 'Holder name is required'),
  allocationType: z.enum(['Permanent', 'Temporary']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const visitorParkingSchema = z.object({
  visitorName: z.string().min(1, 'Visitor name is required'),
  mobile: z.string().optional(),
  vehicleNumber: z.string().min(1, 'Vehicle number is required'),
  slotId: z.string().min(1, 'Slot is required'),
  flatId: z.string().optional(),
});

export const temporaryParkingSchema = z.object({
  slotId: z.string().min(1, 'Slot is required'),
  flatId: z.string().optional(),
  vehicleNumber: z.string().min(1, 'Vehicle number is required'),
  holderName: z.string().min(1, 'Holder name is required'),
  mobile: z.string().optional(),
  purpose: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

export const vehicleMappingSchema = z.object({
  slotId: z.string().min(1, 'Slot is required'),
  flatId: z.string().optional(),
  vehicleId: z.string().optional(),
  vehicleNumber: z.string().min(1, 'Vehicle number is required'),
  vehicleType: z.enum(['Car', 'Bike', 'Scooter', 'EV']).optional(),
  isPrimary: z.boolean().optional(),
});

export const violationSchema = z.object({
  vehicleNumber: z.string().min(1, 'Vehicle number is required'),
  slotId: z.string().optional(),
  flatId: z.string().optional(),
  violationType: z.enum(['Wrong Slot', 'No Permit', 'Overtime', 'Blocking', 'Other']),
  description: z.string().optional(),
  fineAmount: z.coerce.number().optional(),
  violationDate: z.string().optional(),
  violationStatus: z.enum(['Open', 'Resolved', 'Waived']).optional(),
});

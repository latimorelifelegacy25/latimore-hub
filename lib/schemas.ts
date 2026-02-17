import { z } from 'zod'

export const FilloutSchema = z.object({
  email:           z.string().email('Invalid email'),
  first_name:      z.string().max(100).optional().nullable(),
  firstName:       z.string().max(100).optional().nullable(),
  last_name:       z.string().max(100).optional().nullable(),
  lastName:        z.string().max(100).optional().nullable(),
  phone:           z.string().max(20).optional().nullable(),
  county:          z.string().max(50).optional().nullable(),
  interest_type:   z.enum(['Velocity', 'Depth', 'Group']).optional().nullable(),
  interestType:    z.enum(['Velocity', 'Depth', 'Group']).optional().nullable(),
  lead_session_id: z.string().max(128).optional().nullable(),
  utm_source:      z.string().max(100).optional().nullable(),
  utm_medium:      z.string().max(100).optional().nullable(),
  utm_campaign:    z.string().max(100).optional().nullable(),
  utm_term:        z.string().max(100).optional().nullable(),
  utm_content:     z.string().max(100).optional().nullable(),
  referrer:        z.string().max(500).optional().nullable(),
}).passthrough()

export const InquiryPatchSchema = z.object({
  status: z.enum(['New_Inquiry', 'Qualified', 'Booked', 'Closed_Won', 'Closed_Lost']),
  notes:  z.string().max(2000).optional().nullable(),
  actor:  z.string().max(100).optional().nullable(),
})

export const BookingNotifySchema = z.object({
  lead_session_id: z.string().min(1).max(128),
  gcal_id:         z.string().max(200).optional().nullable(),
  start_at:        z.string().optional().nullable(),
  end_at:          z.string().optional().nullable(),
})

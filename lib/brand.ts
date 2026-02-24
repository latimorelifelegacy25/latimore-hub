export const BRAND = {
  // Public-facing name (use in headings/metadata)
  name: 'Latimore Life & Legacy',
  // Used when "LLC" is appended in legal copy
  fullName: 'Latimore Life & Legacy',

  tagline: 'Protecting Today. Securing Tomorrow.',
  hashtag: '#TheBeatGoesOn',

  advisor: 'Jackson M. Latimore Sr., Founder & CEO',
  affiliation: 'In Affiliation with Global Financial Impact',

  phone: '(856) 895-1457',
  phoneRaw: '8568951457',
  email: 'jackson1989@latimorelegacy.com',

  nipr: '21638507',
  paLicense: '1268820',

  // Primary CTAs
  bookingUrl: '/book',
  filloutUrl: 'https://latimorelifelegacy.fillout.com/latimorelifelegacy',
  ethosUrl: 'https://agents.ethoslife.com/invite/29ad1',

  // Social
  instagram: 'https://www.instagram.com/jacksonlatimore.global',
  linkedin: 'https://www.linkedin.com/in/startwithjacksongfi',
  facebook: 'https://www.facebook.com/LatimoreLegacyLL',

  instagramUrl: 'https://www.instagram.com/jacksonlatimore.global',
  linkedinUrl: 'https://www.linkedin.com/in/startwithjacksongfi',
  facebookUrl: 'https://www.facebook.com/LatimoreLegacyLL',

  // Service region
  counties: ['Schuylkill', 'Luzerne', 'Northumberland'],

  // Used for absolute URLs in emails
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://latimorehub.vercel.app',
} as const

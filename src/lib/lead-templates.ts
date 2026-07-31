interface LeadTemplate {
  subject: string;
  emailBody: string[];
  whatsappMessage: string;
}

interface TemplateSet {
  keywords: string[];
  template: (businessName: string) => LeadTemplate;
}

const TEMPLATE_SETS: TemplateSet[] = [
  {
    keywords: ["restaurant", "cafe", "coffee", "bakery", "food", "diner", "bar", "pub"],
    template: (name) => ({
      subject: `A website that brings more diners to ${name}`,
      emailBody: [
        `Hi ${name} team,`,
        `I came across ${name} while looking at local spots and noticed you don't have a website yet. A lot of hungry customers search online before deciding where to eat, and a simple site with your menu, hours, and location can turn that browsing into bookings and takeout orders.`,
        `We build fast, mobile-friendly websites for restaurants and cafes — menu pages, online ordering links, Google Maps integration, and photo galleries — usually live within a week.`,
        `Would you be open to a quick chat about what this could look like for ${name}?`,
      ],
      whatsappMessage: `Hi! I noticed ${name} doesn't have a website yet. We build simple, fast websites for restaurants & cafes (menu, hours, location, online ordering links) that help bring in more customers. Would you be open to a quick chat about this?`,
    }),
  },
  {
    keywords: ["salon", "spa", "beauty", "barber", "nail", "hair"],
    template: (name) => ({
      subject: `Get ${name} discovered online with a simple website`,
      emailBody: [
        `Hi ${name} team,`,
        `I noticed ${name} doesn't have a website yet. Most people now search online and check reviews before booking a salon or spa appointment — a clean website with your services, pricing, and booking details helps you stand out and get found.`,
        `We design simple, elegant websites for salons and spas with service menus, an online booking link, and a photo gallery of your work — typically live within a week.`,
        `Would you like to see what this could look like for ${name}?`,
      ],
      whatsappMessage: `Hi! I noticed ${name} doesn't have a website yet. We build simple websites for salons & spas (services, pricing, booking link, photo gallery) to help you get discovered online. Want to see what it could look like?`,
    }),
  },
  {
    keywords: ["gym", "fitness", "yoga", "workout", "training"],
    template: (name) => ({
      subject: `Help more people find ${name} online`,
      emailBody: [
        `Hi ${name} team,`,
        `I noticed ${name} doesn't have a website yet. People searching for a gym or fitness studio nearby usually check online first — a website with your class schedule, membership plans, and location helps convert that search into a walk-in.`,
        `We build clean, mobile-friendly websites for gyms and fitness studios — class schedules, trainer profiles, membership info, and contact/booking details — live within a week.`,
        `Open to a quick chat about what this could look like for ${name}?`,
      ],
      whatsappMessage: `Hi! I noticed ${name} doesn't have a website yet. We build simple websites for gyms & fitness studios (class schedule, membership plans, location) to help bring in more members. Would you be open to a quick chat?`,
    }),
  },
  {
    keywords: ["dentist", "dental", "doctor", "clinic", "hospital", "physician", "medical"],
    template: (name) => ({
      subject: `A professional website for ${name}`,
      emailBody: [
        `Hi ${name} team,`,
        `I noticed ${name} doesn't have a website yet. Patients often look up a clinic online before booking — a professional website with your services, doctor profiles, and appointment details builds trust and makes it easy for new patients to reach you.`,
        `We build clean, professional websites for clinics and practices — services offered, doctor bios, appointment booking, and location — usually live within a week.`,
        `Would you be open to a quick chat about what this could look like for ${name}?`,
      ],
      whatsappMessage: `Hi! I noticed ${name} doesn't have a website yet. We build professional websites for clinics (services, doctor profiles, appointment booking) to help new patients find and trust you online. Open to a quick chat?`,
    }),
  },
  {
    keywords: ["boutique", "clothing", "fashion", "store", "shop", "retail", "apparel"],
    template: (name) => ({
      subject: `Bring ${name} online with a simple storefront`,
      emailBody: [
        `Hi ${name} team,`,
        `I noticed ${name} doesn't have a website yet. Shoppers increasingly browse online before visiting a store — a simple website showcasing your products, location, and hours (with an online catalog if you'd like) helps you reach more customers.`,
        `We build clean, mobile-friendly websites for boutiques and retail stores — product galleries, store hours, location, and social links — live within a week.`,
        `Would you like to see what this could look like for ${name}?`,
      ],
      whatsappMessage: `Hi! I noticed ${name} doesn't have a website yet. We build simple websites for stores & boutiques (product gallery, hours, location) to help you reach more customers online. Want to see what it could look like?`,
    }),
  },
  {
    keywords: ["hotel", "resort", "lodge", "guest house", "homestay"],
    template: (name) => ({
      subject: `Get more direct bookings for ${name}`,
      emailBody: [
        `Hi ${name} team,`,
        `I noticed ${name} doesn't have its own website yet. Relying only on booking platforms means paying commission on every stay — a direct website with your rooms, amenities, and a booking/contact form helps you capture guests directly and keep more of what you earn.`,
        `We build clean, mobile-friendly websites for hotels and stays — room galleries, amenities, location, and direct enquiry forms — live within a week.`,
        `Would you be open to a quick chat about what this could look like for ${name}?`,
      ],
      whatsappMessage: `Hi! I noticed ${name} doesn't have its own website yet. We build simple websites for hotels & stays (rooms, amenities, direct booking enquiry) to help you get more direct bookings and avoid commission. Open to a quick chat?`,
    }),
  },
  {
    keywords: ["lawyer", "law", "legal", "attorney", "advocate"],
    template: (name) => ({
      subject: `A professional online presence for ${name}`,
      emailBody: [
        `Hi ${name} team,`,
        `I noticed ${name} doesn't have a website yet. Clients often research a lawyer or firm online before reaching out — a professional website with your practice areas, experience, and contact details builds credibility and brings in new enquiries.`,
        `We build clean, professional websites for law practices — practice areas, attorney bios, and a contact form — usually live within a week.`,
        `Would you be open to a quick chat about what this could look like for ${name}?`,
      ],
      whatsappMessage: `Hi! I noticed ${name} doesn't have a website yet. We build professional websites for law practices (practice areas, bios, contact form) to help build credibility and bring in new enquiries. Open to a quick chat?`,
    }),
  },
  {
    keywords: ["real estate", "realtor", "property", "builder", "construction"],
    template: (name) => ({
      subject: `Showcase your listings online for ${name}`,
      emailBody: [
        `Hi ${name} team,`,
        `I noticed ${name} doesn't have a website yet. Buyers and renters usually start their search online — a website showcasing your listings, projects, and contact details helps you reach serious leads directly.`,
        `We build clean, mobile-friendly websites for real estate and construction businesses — listing galleries, project details, and enquiry forms — live within a week.`,
        `Would you like to see what this could look like for ${name}?`,
      ],
      whatsappMessage: `Hi! I noticed ${name} doesn't have a website yet. We build simple websites for real estate businesses (listings, projects, enquiry form) to help you reach more direct leads. Want to see what it could look like?`,
    }),
  },
];

const DEFAULT_TEMPLATE = (name: string): LeadTemplate => ({
  subject: `A simple website for ${name}`,
  emailBody: [
    `Hi ${name} team,`,
    `I came across ${name} and noticed you don't have a website yet. More and more customers search online before visiting or contacting a business — a simple, professional website makes it easy for them to find you, see what you offer, and get in touch.`,
    `We build fast, mobile-friendly websites — usually live within a week — tailored to what your business needs.`,
    `Would you be open to a quick chat about what this could look like for ${name}?`,
  ],
  whatsappMessage: `Hi! I noticed ${name} doesn't have a website yet. We build simple, professional websites that help local businesses get found online and bring in more customers. Would you be open to a quick chat about this?`,
});

export function getLeadTemplate(
  businessName: string,
  category?: string | null
): LeadTemplate {
  const normalized = (category ?? "").toLowerCase();

  const match = TEMPLATE_SETS.find((set) =>
    set.keywords.some((kw) => normalized.includes(kw))
  );

  return (match ? match.template : DEFAULT_TEMPLATE)(businessName);
}

export function buildWhatsAppLink(
  phone: string,
  message: string,
  address?: string | null
): string {
  // Leads searched after the Places API switch to internationalPhoneNumber
  // already carry a "+<country code>" prefix — use it as-is.
  if (phone.trim().startsWith("+")) {
    return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  }

  // Legacy leads saved before that switch only have a 10-digit national
  // number with no country code. India, Canada, and the US all use 10-digit
  // national numbers, so digit count alone can't tell them apart — fall back
  // to guessing from the lead's address text.
  const digits = phone.replace(/\D/g, "").replace(/^0+/, "");
  const addr = (address ?? "").toLowerCase();
  const countryCode =
    addr.includes("canada") || addr.includes("united states") || addr.includes("usa")
      ? "1"
      : "91";

  return `https://wa.me/${countryCode}${digits}?text=${encodeURIComponent(message)}`;
}

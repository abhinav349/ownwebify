interface LeadTemplate {
  subject: string;
  emailBody: string[];
  whatsappMessage: string;
}

interface TemplateSet {
  keywords: string[];
  template: (businessName: string) => LeadTemplate;
}

const DEMO_BASE_URL = "https://ownwebify.com/demos";

function demoLink(slug?: string): string {
  return slug ? `${DEMO_BASE_URL}/${slug}` : DEMO_BASE_URL;
}

function whatsappPitch(
  name: string,
  hook: string,
  demoSlug: string | undefined,
  demoCaption: string
): string {
  return [
    `Hi! 👋 This is OwnWebify - we design websites for businesses like ${name}.`,
    hook,
    `Here's a live example - ${demoCaption}: ${demoLink(demoSlug)}`,
    `We could build something like this for ${name}, live in about a week. Want to see what it'd look like for you?`,
  ].join("\n\n");
}

const TEMPLATE_SETS: TemplateSet[] = [
  {
    keywords: ["cafe", "coffee", "bakery"],
    template: (name) => ({
      subject: `A website that brings more regulars to ${name}`,
      emailBody: [
        `Hi ${name} team,`,
        `I came across ${name} while looking at local spots and noticed you don't have a website yet. A lot of coffee lovers search online before deciding where to go, and a simple site with your menu, hours, and location can turn that browsing into visits.`,
        `We build fast, mobile-friendly websites for cafes — menu pages, hours, location, and photo galleries — usually live within a week.`,
        `Would you be open to a quick chat about what this could look like for ${name}?`,
      ],
      whatsappMessage: whatsappPitch(
        name,
        `We noticed ${name} doesn't have a website yet - and most people now check online before picking a cafe to visit.`,
        "cafe",
        "a cafe site we designed"
      ),
    }),
  },
  {
    keywords: ["restaurant", "diner", "bar", "pub", "food", "eatery"],
    template: (name) => ({
      subject: `A website that brings more diners to ${name}`,
      emailBody: [
        `Hi ${name} team,`,
        `I came across ${name} while looking at local spots and noticed you don't have a website yet. A lot of hungry customers search online before deciding where to eat, and a simple site with your menu, hours, and location can turn that browsing into bookings and takeout orders.`,
        `We build fast, mobile-friendly websites for restaurants — menu pages, online ordering links, Google Maps integration, and photo galleries — usually live within a week.`,
        `Would you be open to a quick chat about what this could look like for ${name}?`,
      ],
      whatsappMessage: whatsappPitch(
        name,
        `We noticed ${name} doesn't have a website yet - and most diners now check online before picking where to eat.`,
        "restaurant",
        "a fine-dining site we designed"
      ),
    }),
  },
  {
    keywords: ["spa", "wellness", "massage", "ayurveda", "retreat"],
    template: (name) => ({
      subject: `Help more people discover ${name} online`,
      emailBody: [
        `Hi ${name} team,`,
        `I noticed ${name} doesn't have a website yet. People looking for a spa or wellness retreat almost always browse online first — a calm, well-photographed website with your treatment menu and booking details is often what decides where they go.`,
        `We design serene, image-led websites for spas and wellness studios — treatment menus, pricing, and an online booking link — typically live within a week.`,
        `Would you like to see what this could look like for ${name}?`,
      ],
      whatsappMessage: whatsappPitch(
        name,
        `We noticed ${name} doesn't have a website yet - and guests almost always browse online before booking a treatment.`,
        "spa",
        "a spa & wellness site we designed"
      ),
    }),
  },
  {
    keywords: ["salon", "beauty", "barber", "nail", "hair"],
    template: (name) => ({
      subject: `Get ${name} discovered online with a simple website`,
      emailBody: [
        `Hi ${name} team,`,
        `I noticed ${name} doesn't have a website yet. Most people now search online and check reviews before booking a salon appointment — a clean website with your services, pricing, and booking details helps you stand out and get found.`,
        `We design simple, elegant websites for salons with service menus, an online booking link, and a photo gallery of your work — typically live within a week.`,
        `Would you like to see what this could look like for ${name}?`,
      ],
      whatsappMessage: whatsappPitch(
        name,
        `We noticed ${name} doesn't have a website yet - and clients increasingly check online before booking an appointment.`,
        "salon",
        "a salon site we designed"
      ),
    }),
  },
  {
    keywords: ["interior design", "interior designer", "architect", "renovation", "decor"],
    template: (name) => ({
      subject: `A portfolio site that does justice to ${name}'s work`,
      emailBody: [
        `Hi ${name} team,`,
        `I noticed ${name} doesn't have a website yet. Clients choosing an interior designer or architect want to see completed work before they ever make contact — a proper project portfolio is usually what turns a browser into an enquiry.`,
        `We build image-led websites for design studios — project galleries, service tiers, and an enquiry form — usually live within a week.`,
        `Would you be open to a quick chat about what this could look like for ${name}?`,
      ],
      whatsappMessage: whatsappPitch(
        name,
        `We noticed ${name} doesn't have a website yet - and clients almost always want to see completed projects before enquiring.`,
        "interior-design",
        "a design studio portfolio we built"
      ),
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
      whatsappMessage: whatsappPitch(
        name,
        `We noticed ${name} doesn't have a website yet - and most people check online before choosing where to train.`,
        "fitness",
        "a gym site we designed"
      ),
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
      whatsappMessage: whatsappPitch(
        name,
        `We noticed ${name} doesn't have a website yet - and patients often look up a clinic online before booking.`,
        "clinic",
        "a clinic site we designed"
      ),
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
      whatsappMessage: whatsappPitch(
        name,
        `We noticed ${name} doesn't have a website yet - and shoppers increasingly browse online before visiting a store.`,
        "ecommerce",
        "a fashion storefront we designed"
      ),
    }),
  },
  {
    keywords: ["photographer", "photography", "photo studio"],
    template: (name) => ({
      subject: `A portfolio site that does justice to ${name}'s work`,
      emailBody: [
        `Hi ${name} team,`,
        `I noticed ${name} doesn't have a website yet. Clients booking a photographer almost always want to see a portfolio first — a clean gallery site makes your best work the first thing they see.`,
        `We build elegant, image-first websites for photographers — galleries, packages, and a contact/booking form — usually live within a week.`,
        `Would you be open to a quick chat about what this could look like for ${name}?`,
      ],
      whatsappMessage: whatsappPitch(
        name,
        `We noticed ${name} doesn't have a website yet - and clients almost always want to see a portfolio before booking a shoot.`,
        "photography",
        "a photography portfolio we designed"
      ),
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
      whatsappMessage: whatsappPitch(
        name,
        `We noticed ${name} doesn't have its own website yet - right now you're likely paying commission on every booking platform stay.`,
        "hotel",
        "a boutique hotel site we designed"
      ),
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
      whatsappMessage: whatsappPitch(
        name,
        `We noticed ${name} doesn't have a website yet - and clients often research a firm online before reaching out.`,
        "law-firm",
        "a law firm site we designed"
      ),
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
      whatsappMessage: whatsappPitch(
        name,
        `We noticed ${name} doesn't have a website yet - and buyers usually start their search online.`,
        "real-estate",
        "a real estate site we designed"
      ),
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
  whatsappMessage: whatsappPitch(
    name,
    `We noticed ${name} doesn't have a website yet - and most customers now search online before visiting or calling a business.`,
    undefined,
    "recent work from our portfolio"
  ),
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

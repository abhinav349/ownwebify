type CuratedImage = {
  id: string;
  alt: string;
};

function photo(id: string, alt: string): CuratedImage {
  return { id, alt };
}

export function img(entry: CuratedImage, width: number, quality = 75) {
  return {
    src: `https://images.unsplash.com/photo-${entry.id}?auto=format&fit=crop&w=${width}&q=${quality}`,
    alt: entry.alt,
  };
}

export const demoImages = {
  cafe: {
    hero: photo("1521017432531-fbd92d768814", "Roasted coffee beans scattered across a dark wooden counter"),
    interior: photo("1453614512568-c4024d13c247", "Warm, sunlit cafe interior with pastries on display"),
    counter: photo("1442512595331-e89e73853f31", "Barista working behind a cafe counter"),
    latteArt: photo("1509042239860-f550ce710b93", "Close-up of latte art in a ceramic cup"),
    cup: photo("1495474472287-4d71bcdd2085", "Top-down view of a coffee cup on a wooden table"),
  },
  restaurant: {
    hero: photo("1517248135467-4c7edcad34c4", "Dark, gold-lit fine dining room with a wine wall"),
    plate: photo("1414235077428-338989a2e8c0", "Elegantly plated fine dining dish"),
    interior: photo("1424847651672-bf20a4b0982b", "Candlelit restaurant interior with set tables"),
    dish: photo("1552566626-52f8b828add9", "Chef-plated tasting menu course"),
    moody: photo("1533777857889-4be7c70b33f7", "Moody, dramatic close-up of a plated restaurant dish"),
  },
  salon: {
    hero: photo("1560066984-138dadb4c035", "Modern hair salon interior with styling chairs"),
    chair: photo("1522337360788-8b13dee7a37e", "Salon chair facing a lit mirror"),
    styling: photo("1580618672591-eb180b1a973f", "Stylist working on a client's hair"),
    spa: photo("1487412947147-5cebf100ffc2", "Relaxing beauty spa treatment setting"),
    nails: photo("1522335789203-aabd1fc54bc9", "Close-up of a manicure being applied"),
  },
  fitness: {
    hero: photo("1571019613454-1cb2f99b2d8b", "Dark, moody gym with a rack of weights"),
    training: photo("1541534741688-6078c6bfb5c5", "Athlete training with weights in a gym"),
    equipment: photo("1550345332-09e3ac987658", "Rows of gym equipment under dramatic lighting"),
    workout: photo("1517836357463-d25dfeac3438", "Person mid-workout in a fitness studio"),
    dumbbells: photo("1534438327276-14e5300c3a48", "Rack of dumbbells in a modern gym"),
  },
  ecommerce: {
    hero: photo("1441986300917-64674bd600d8", "Editorial fashion portrait against a minimal backdrop"),
    rack: photo("1483985988355-763728e1935b", "Curated clothing rack in a boutique"),
    shelf: photo("1445205170230-053b83016050", "Minimalist shoe display shelf"),
    editorial: photo("1490481651871-ab68de25d43d", "High-fashion editorial styling shot"),
    boutique: photo("1490114538077-0a7f8cb49891", "Interior of a minimalist fashion boutique"),
  },
  realEstate: {
    hero: photo("1600585154340-be6161a56a0c", "Modern luxury house exterior at dusk"),
    exterior: photo("1512917774080-9991f1c4c750", "Contemporary house exterior with clean architectural lines"),
    living: photo("1560448204-e02f11c3d0e2", "Bright, luxurious living room interior"),
    interior: photo("1600607687939-ce8a6c25118c", "Modern open-plan living room interior"),
    lounge: photo("1580587771525-78b9dba3b914", "Elegant lounge interior with designer furniture"),
  },
  photography: {
    hero: photo("1554080353-a576cf803bda", "Professional photo studio setup with lighting equipment"),
    camera: photo("1516035069371-29a1b244cc32", "Photographer holding a camera up to shoot"),
    lens: photo("1471341971476-ae15ff5dd4ea", "Close-up of a camera lens"),
    atWork: photo("1500259571355-332da5cb07aa", "Photographer at work on location"),
    detail: photo("1502920917128-1aa500764cbd", "Close-up detail of a vintage camera"),
  },
  clinic: {
    hero: photo("1584982751601-97dcc096659c", "Bright, modern clinic reception area"),
    corridor: photo("1519494026892-80bbd2d6fd0d", "Clean, well-lit hospital corridor"),
    consult: photo("1505751172876-fa1923c5c528", "Doctor consulting with a patient"),
    care: photo("1538108149393-fbbd81895907", "Doctor holding a stethoscope"),
    interior: photo("1666214280391-8ff5bd3c0bf0", "Calm, modern medical clinic interior"),
  },
  hotel: {
    hero: photo("1571003123894-1f0594d2b5d9", "Luxurious hotel bedroom with soft ambient lighting"),
    lobby: photo("1566073771259-6a8506099945", "Elegant hotel lobby interior"),
    room: photo("1611892440504-42a792e24d32", "Well-appointed hotel guest room"),
    pool: photo("1520250497591-112f2f40a3f4", "Resort pool at dusk"),
    exterior: photo("1590490360182-c33d57733427", "Boutique hotel exterior"),
  },
  lawFirm: {
    hero: photo("1521737604893-d14cc237f11d", "Modern law office building exterior"),
    desk: photo("1589829085413-56de8ae18c73", "Attorney's desk with legal documents"),
    library: photo("1521791136064-7986c2920216", "Law library with rows of bound volumes"),
    meeting: photo("1450101499163-c8848c66ca85", "Professionals shaking hands after a meeting"),
    consult: photo("1568992687947-868a62a9f521", "Lawyer consulting with a client"),
  },
  interiorDesign: {
    hero: photo("1618221195710-dd6b41faaea6", "Warmly styled modern living room interior"),
    moodboard: photo("1618220179428-22790b461013", "Curated interior design mood board"),
    detail: photo("1615874959474-d609969a20ed", "Close-up detail of designer furniture"),
    furniture: photo("1615529182904-14819c35db37", "Elegant furniture piece in a styled room"),
    architecture: photo("1618219740975-d40978bb7378", "Modern interior architecture with clean lines"),
  },
  spa: {
    hero: photo("1540555700478-4be289fbecef", "Spa treatment stones arranged for a massage"),
    treatment: photo("1600334129128-685c5582fd35", "Calm spa treatment room"),
    candles: photo("1544161515-4ab6ce6db874", "Zen candles and spa ambiance"),
    relax: photo("1519415510236-718bdfcd89c8", "Person relaxing during a spa treatment"),
    detail: photo("1583417319070-4a69db38a482", "Close-up detail of spa amenities"),
  },
} as const;

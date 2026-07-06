import { Building2, MapPin, Bed, Bath, Maximize, Phone, Mail, Star, ArrowRight, Search, TrendingUp } from "lucide-react";

const properties = [
  { name: "Skyline Penthouse", location: "Downtown, Manhattan", price: "$4.2M", beds: 4, baths: 3, sqft: "3,200", tag: "Featured" },
  { name: "Harbor View Condo", location: "Waterfront, Brooklyn", price: "$1.8M", beds: 2, baths: 2, sqft: "1,450", tag: "New" },
  { name: "Park Avenue Classic", location: "Upper East Side", price: "$6.5M", beds: 5, baths: 4, sqft: "4,800", tag: null },
  { name: "Chelsea Loft", location: "Chelsea, Manhattan", price: "$2.1M", beds: 3, baths: 2, sqft: "2,100", tag: "Hot" },
  { name: "Riverside Villa", location: "Hudson Valley", price: "$3.8M", beds: 6, baths: 5, sqft: "5,500", tag: null },
  { name: "Modern Studio+", location: "Williamsburg, Brooklyn", price: "$950K", beds: 1, baths: 1, sqft: "780", tag: "New" },
];

const stats = [
  { value: "$2.1B+", label: "Properties Sold" },
  { value: "850+", label: "Happy Families" },
  { value: "15+", label: "Years Experience" },
  { value: "99%", label: "Client Satisfaction" },
];

const testimonials = [
  { text: "Skyline made our dream home a reality. Their market knowledge is unmatched.", author: "James & Sarah T." },
  { text: "Sold our property in just 5 days above asking price. Exceptional service.", author: "Dr. Michelle K." },
  { text: "The most professional and dedicated real estate team we've ever worked with.", author: "Robert Chen" },
];

export default function RealEstateDemoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-900 to-teal-700 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900 tracking-tight block leading-none">Skyline</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Properties</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#listings" className="text-sm text-gray-600 hover:text-blue-900 transition-colors font-medium">Listings</a>
            <a href="#about" className="text-sm text-gray-600 hover:text-blue-900 transition-colors font-medium">About</a>
            <a href="#testimonials" className="text-sm text-gray-600 hover:text-blue-900 transition-colors font-medium">Reviews</a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-blue-900 transition-colors font-medium">Contact</a>
            <button className="px-6 py-2.5 bg-blue-900 text-white text-sm font-medium hover:bg-blue-800 transition-colors rounded-lg shadow-lg shadow-blue-900/20">
              List Property
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24">
        <div className="relative min-h-[85vh] bg-gradient-to-br from-blue-950 via-blue-900 to-teal-900 flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-teal-500/10 rounded-full blur-[128px]" />
          <div className="mx-auto max-w-7xl px-6 py-20 relative z-10">
            <div className="max-w-2xl">
              <p className="text-teal-300 text-sm font-medium uppercase tracking-wider mb-6">
                New York&apos;s Premier Real Estate
              </p>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1]">
                Find Your
                <br />
                <span className="text-teal-400">Dream Home</span>
              </h1>
              <p className="mt-8 text-blue-100/70 text-lg leading-relaxed max-w-lg">
                Exclusive access to the city&apos;s most coveted properties. From stunning
                penthouses to charming brownstones — we find perfection.
              </p>

              {/* Search Bar */}
              <div className="mt-10 p-2 bg-white rounded-xl shadow-2xl shadow-black/20 flex items-center gap-2 max-w-xl">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by location, type, or price..."
                    className="w-full py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
                <button className="px-6 py-3 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors">
                  Search
                </button>
              </div>

              <div className="mt-12 grid grid-cols-4 gap-8">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-blue-200/60 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section id="listings" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-sm font-medium text-teal-600 uppercase tracking-wider mb-2">Featured</p>
              <h2 className="text-3xl font-bold text-gray-900">Premium Listings</h2>
            </div>
            <button className="text-sm text-blue-900 font-medium flex items-center gap-2 hover:gap-3 transition-all">
              View All Properties <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.name}
                className="rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all group cursor-pointer"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-teal-50 relative flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-blue-200" />
                  {property.tag && (
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      property.tag === "Featured" ? "bg-blue-900" :
                      property.tag === "Hot" ? "bg-red-500" :
                      "bg-teal-600"
                    }`}>
                      {property.tag}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-2xl font-bold text-blue-900">{property.price}</p>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                    {property.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-5 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Bed className="h-4 w-4" /> {property.beds}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath className="h-4 w-4" /> {property.baths}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize className="h-4 w-4" /> {property.sqft} sqft
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-medium text-teal-600 uppercase tracking-wider mb-4">Why Skyline</p>
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                We Don&apos;t Just Sell Homes.
                <br />
                <span className="text-blue-900">We Build Futures.</span>
              </h2>
              <p className="mt-6 text-gray-600 leading-relaxed">
                With over 15 years of experience in New York&apos;s luxury real estate market,
                Skyline Properties has established itself as the trusted name for buyers and
                sellers who demand excellence.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Our team of expert agents combines deep market knowledge with personalized
                service, ensuring every client finds exactly what they&apos;re looking for.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <button className="px-8 py-4 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20">
                  Schedule Consultation
                </button>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-teal-600" />
                  <span className="text-sm text-gray-600 font-medium">#1 Rated Agency 2025</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center">
                <Building2 className="h-16 w-16 text-blue-300/30" />
              </div>
              <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-teal-700 to-teal-600 flex items-center justify-center mt-8">
                <MapPin className="h-16 w-16 text-teal-200/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-teal-600 uppercase tracking-wider mb-3">Testimonials</p>
            <h2 className="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((item) => (
              <div
                key={item.author}
                className="p-8 rounded-xl border border-gray-100 bg-white hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  &ldquo;{item.text}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-gray-900">— {item.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-24 bg-blue-950 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl font-bold">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="mt-6 text-blue-200/70 text-lg leading-relaxed">
            Our expert agents are ready to help. Schedule a free consultation today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-teal-300">
              <Phone className="h-5 w-5" />
              <span className="font-medium">(555) 789-HOME</span>
            </div>
            <div className="flex items-center gap-2 text-teal-300">
              <Mail className="h-5 w-5" />
              <span className="font-medium">hello@skylineprops.com</span>
            </div>
          </div>
          <button className="mt-8 px-10 py-4 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-400 transition-colors shadow-xl shadow-teal-500/20">
            Book Free Consultation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Building2 className="h-5 w-5 text-blue-900" />
            <span className="font-bold text-gray-900">Skyline Properties</span>
          </div>
          <p className="text-xs text-gray-400">
            &copy; 2026 Skyline Properties. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

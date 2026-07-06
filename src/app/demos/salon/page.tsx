import { Scissors, Sparkles, Clock, Phone, MapPin, Star, Heart, Users } from "lucide-react";

const services = [
  { name: "Signature Blowout", price: "$75", duration: "45 min", desc: "Luxurious wash, conditioning treatment & styled blowout" },
  { name: "Balayage Color", price: "$250+", duration: "3 hrs", desc: "Hand-painted highlights for a natural, sun-kissed look" },
  { name: "Keratin Smoothing", price: "$300", duration: "2.5 hrs", desc: "Frizz-free, silky smooth hair for up to 3 months" },
  { name: "Bridal Styling", price: "$350", duration: "2 hrs", desc: "Trial included. Your dream look for the perfect day" },
  { name: "Facial Rejuvenation", price: "$120", duration: "60 min", desc: "Deep cleanse, exfoliation, mask & LED therapy" },
  { name: "Lash Extensions", price: "$180", duration: "90 min", desc: "Full set of handcrafted mink lashes" },
];

const team = [
  { name: "Priya K.", role: "Creative Director", specialty: "Color & Balayage" },
  { name: "Lena M.", role: "Senior Stylist", specialty: "Bridal & Updo" },
  { name: "Aisha R.", role: "Skin Specialist", specialty: "Facials & Peels" },
  { name: "Zoe T.", role: "Lash Artist", specialty: "Extensions & Brows" },
];

export default function SalonDemoPage() {
  return (
    <div className="min-h-screen bg-[#FFF9FB]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-[#FFF9FB]/90 backdrop-blur-md border-b border-pink-100">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-xl text-gray-900 tracking-tight">Glow Studio</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm text-gray-600 hover:text-pink-500 transition-colors">Services</a>
            <a href="#team" className="text-sm text-gray-600 hover:text-pink-500 transition-colors">Team</a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-pink-500 transition-colors">Contact</a>
            <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium hover:from-pink-400 hover:to-purple-400 transition-all shadow-lg shadow-pink-500/20">
              Book Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-100/60 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-rose-100/50 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-sm font-medium mb-8">
                <Heart className="h-4 w-4 fill-pink-400 text-pink-400" />
                Voted #1 Salon 2025
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1]">
                Glow From
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  The Inside Out
                </span>
              </h1>
              <p className="mt-8 text-lg text-gray-500 leading-relaxed max-w-md">
                Your sanctuary for beauty and self-care. Expert stylists, premium products,
                and an atmosphere designed to make you feel extraordinary.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <button className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:from-pink-400 hover:to-purple-400 transition-all shadow-xl shadow-pink-500/20 hover:-translate-y-0.5">
                  Book Appointment
                </button>
                <button className="px-8 py-4 rounded-full border-2 border-pink-300 text-pink-600 font-semibold hover:bg-pink-50 transition-all">
                  View Services
                </button>
              </div>
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-pink-300 to-purple-300" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">500+ happy clients this month</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100 border border-pink-200/50 p-8 flex items-center justify-center shadow-2xl shadow-pink-200/30">
                <div className="text-center">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mx-auto shadow-2xl shadow-pink-400/30">
                    <Scissors className="h-16 w-16 text-white" />
                  </div>
                  <p className="mt-6 text-xl font-bold text-gray-900">Premium Beauty</p>
                  <p className="text-pink-500 text-sm mt-1">Tailored to You</p>
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    {["Hair", "Skin", "Lashes", "Bridal"].map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-white border border-pink-200 text-xs text-pink-600 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 px-5 py-3 rounded-2xl bg-white shadow-xl border border-pink-100">
                <p className="text-xs text-pink-500 font-medium">Next Available</p>
                <p className="text-sm font-bold text-gray-900">Today, 2:30 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-pink-500 uppercase tracking-wider mb-3">Our Services</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Treatments You&apos;ll Love
            </h2>
            <p className="mt-4 text-gray-500 max-w-lg mx-auto">
              From signature blowouts to complete transformations, we&apos;ve got you covered.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <div
                key={service.name}
                className="p-6 rounded-2xl border border-pink-100 bg-gradient-to-br from-white to-pink-50/50 hover:shadow-lg hover:shadow-pink-100/50 hover:border-pink-200 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-purple-500 font-medium bg-purple-50 px-2.5 py-1 rounded-full">
                    {service.duration}
                  </span>
                  <span className="text-lg font-bold text-pink-600">{service.price}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-pink-500 uppercase tracking-wider mb-3">Meet the Experts</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Our Dream Team
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-pink-200 via-purple-100 to-rose-200 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-pink-200/50 transition-all">
                  <Users className="h-12 w-12 text-pink-400" />
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-xs text-pink-500 font-medium">{member.role}</p>
                <p className="text-xs text-gray-400 mt-1">{member.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-24 bg-gradient-to-br from-pink-500 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl px-6 text-center relative z-10">
          <Sparkles className="h-10 w-10 text-white/80 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Glow?
          </h2>
          <p className="mt-6 text-white/80 text-lg leading-relaxed max-w-md mx-auto">
            Book your appointment today and step into a world of beauty and relaxation.
          </p>
          <button className="mt-10 px-10 py-4 rounded-full bg-white text-pink-600 font-semibold hover:bg-white/90 transition-all shadow-2xl hover:-translate-y-0.5">
            Book Your Visit
          </button>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>88 Rose Lane, Beauty District</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Tue-Sat 9am - 7pm</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>(555) 456-GLOW</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-pink-100">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-pink-400" />
            <span className="font-semibold text-gray-900">Glow Studio</span>
          </div>
          <p className="text-xs text-gray-400">
            &copy; 2026 Glow Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

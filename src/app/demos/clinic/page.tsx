import { Stethoscope, Heart, Clock, Phone, MapPin, Shield, Users, Calendar, ArrowRight, CheckCircle } from "lucide-react";

const services = [
  {
    name: "General Medicine",
    desc: "Comprehensive health check-ups and preventive care for the whole family.",
    icon: Stethoscope,
  },
  {
    name: "Pediatrics",
    desc: "Specialized care for infants, children, and adolescents.",
    icon: Heart,
  },
  {
    name: "Dental Care",
    desc: "From routine cleanings to advanced restorative procedures.",
    icon: Shield,
  },
  {
    name: "Women's Health",
    desc: "Dedicated gynecology and obstetrics services.",
    icon: Users,
  },
  {
    name: "Diagnostics",
    desc: "On-site lab testing, imaging, and same-day results.",
    icon: CheckCircle,
  },
  {
    name: "Physiotherapy",
    desc: "Recovery programs tailored to your needs and goals.",
    icon: Calendar,
  },
];

const doctors = [
  { name: "Dr. Sarah Mitchell", specialty: "Family Medicine", exp: "18 years" },
  { name: "Dr. Rajiv Patel", specialty: "Pediatrics", exp: "12 years" },
  { name: "Dr. Emily Chen", specialty: "Dentistry", exp: "10 years" },
  { name: "Dr. Michael Torres", specialty: "Orthopedics", exp: "15 years" },
];

const stats = [
  { value: "25K+", label: "Patients Treated" },
  { value: "15+", label: "Specialists" },
  { value: "10+", label: "Years Trusted" },
  { value: "4.9", label: "Patient Rating" },
];

const whyUs = [
  "Same-day appointments available",
  "Transparent pricing, no hidden fees",
  "Insurance accepted — all major providers",
  "Modern facilities with latest technology",
  "Multilingual staff for your comfort",
  "Free follow-up within 7 days",
];

export default function ClinicDemoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">CarePlus</span>
              <span className="text-sm text-sky-600 font-medium ml-1">Medical</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm text-gray-600 hover:text-sky-600 transition-colors font-medium">Services</a>
            <a href="#doctors" className="text-sm text-gray-600 hover:text-sky-600 transition-colors font-medium">Doctors</a>
            <a href="#about" className="text-sm text-gray-600 hover:text-sky-600 transition-colors font-medium">About</a>
            <button className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-medium rounded-xl hover:from-sky-400 hover:to-emerald-400 transition-all shadow-lg shadow-sky-500/20">
              Book Appointment
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24">
        <div className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-emerald-50" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-3xl" />
          </div>
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-sm font-medium mb-8">
                  <Shield className="h-4 w-4" />
                  Trusted by 25,000+ Patients
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1]">
                  Your Health,
                  <br />
                  <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                    Our Priority
                  </span>
                </h1>
                <p className="mt-8 text-lg text-gray-500 leading-relaxed max-w-md">
                  Compassionate, comprehensive healthcare for you and your family.
                  From routine check-ups to specialized care — all under one roof.
                </p>
                <div className="mt-10 flex items-center gap-4 flex-wrap">
                  <button className="px-8 py-4 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-sky-400 hover:to-emerald-400 transition-all shadow-xl shadow-sky-500/20 hover:-translate-y-0.5">
                    Book Appointment
                  </button>
                  <button className="px-8 py-4 border-2 border-sky-200 text-sky-700 font-semibold rounded-xl hover:bg-sky-50 transition-all">
                    Call Us Now
                  </button>
                </div>
                <div className="mt-10 flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-sky-500" />
                    Open 7 days
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-sky-500" />
                    Same-day appointments
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-sky-100 via-white to-emerald-100 border border-sky-200/50 p-8 flex items-center justify-center shadow-2xl shadow-sky-200/30">
                  <div className="text-center">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center mx-auto shadow-2xl shadow-sky-500/20">
                      <Stethoscope className="h-16 w-16 text-white" />
                    </div>
                    <p className="mt-6 text-xl font-bold text-gray-900">Expert Care</p>
                    <p className="text-sky-600 text-sm mt-1">15+ Specialists On-Site</p>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {["General", "Dental", "Pediatric", "Women's"].map((tag) => (
                        <span key={tag} className="px-3 py-1.5 rounded-lg bg-white border border-sky-100 text-xs text-gray-600 font-medium shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 px-5 py-3 rounded-xl bg-white shadow-xl border border-sky-100">
                  <p className="text-xs text-emerald-600 font-medium">Next Available</p>
                  <p className="text-sm font-bold text-gray-900">Today, 10:30 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gradient-to-r from-sky-500 to-emerald-500">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">What We Offer</p>
            <h2 className="text-4xl font-bold text-gray-900">
              Comprehensive Healthcare Services
            </h2>
            <p className="mt-4 text-gray-500 max-w-lg mx-auto">
              Everything you need for your health and wellness, from routine visits to specialized treatment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.name}
                className="p-7 rounded-2xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/50 hover:shadow-lg hover:shadow-sky-100/50 hover:border-sky-200 transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500/10 to-emerald-500/10 flex items-center justify-center mb-4 group-hover:from-sky-500/20 group-hover:to-emerald-500/20 transition-colors">
                  <service.icon className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-sky-600 transition-colors">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{service.desc}</p>
                <a href="#" className="mt-4 inline-flex items-center gap-1.5 text-sm text-sky-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section id="doctors" className="py-24 bg-sky-50/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">Our Team</p>
            <h2 className="text-4xl font-bold text-gray-900">
              Meet Our Specialists
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {doctors.map((doctor) => (
              <div key={doctor.name} className="text-center group">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-sky-100/50 transition-all border border-sky-100">
                  <Users className="h-12 w-12 text-sky-300" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{doctor.name}</h3>
                <p className="text-xs text-sky-600 font-medium mt-0.5">{doctor.specialty}</p>
                <p className="text-xs text-gray-400 mt-0.5">{doctor.exp} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="about" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-4">Why CarePlus</p>
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Healthcare That Puts
                <br />
                <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                  You First
                </span>
              </h2>
              <p className="mt-6 text-gray-500 leading-relaxed">
                We believe healthcare should be accessible, transparent, and compassionate.
                Every patient deserves to be heard, understood, and cared for with dignity.
              </p>
              <ul className="mt-8 space-y-3">
                {whyUs.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-sky-50 to-emerald-50 border border-sky-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Book an Appointment</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm bg-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm bg-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                <select className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm bg-white text-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100">
                  <option>Select Department</option>
                  <option>General Medicine</option>
                  <option>Pediatrics</option>
                  <option>Dental</option>
                  <option>Orthopedics</option>
                </select>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm bg-white text-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                <button className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-sky-400 hover:to-emerald-400 transition-all shadow-lg shadow-sky-500/20">
                  Request Appointment
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-3">
                We&apos;ll confirm within 30 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gradient-to-r from-sky-500 to-emerald-500 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Phone className="h-6 w-6 text-white/80" />
              <div>
                <p className="font-semibold">Call Us</p>
                <p className="text-white/80 text-sm">(555) 234-CARE</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <MapPin className="h-6 w-6 text-white/80" />
              <div>
                <p className="font-semibold">Visit Us</p>
                <p className="text-white/80 text-sm">200 Wellness Ave, Health District</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Clock className="h-6 w-6 text-white/80" />
              <div>
                <p className="font-semibold">Hours</p>
                <p className="text-white/80 text-sm">Mon-Sun: 8am - 9pm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-sky-100">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-sky-500" />
            <span className="font-bold text-gray-900">CarePlus Medical</span>
          </div>
          <p className="text-xs text-gray-400">
            &copy; 2026 CarePlus Medical Center. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

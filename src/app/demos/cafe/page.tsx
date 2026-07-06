import { Coffee, MapPin, Clock, Phone, Star, Leaf, Heart } from "lucide-react";

const menuItems = [
  { name: "Ethiopian Single Origin", price: "$5.50", desc: "Fruity, bright with blueberry notes" },
  { name: "Caramel Oat Latte", price: "$6.00", desc: "Smooth espresso with oat milk & house caramel" },
  { name: "Matcha Ceremony", price: "$5.75", desc: "Ceremonial grade matcha whisked to perfection" },
  { name: "Cold Brew Flight", price: "$8.00", desc: "Three house-made cold brews to explore" },
  { name: "Artisan Pour Over", price: "$6.50", desc: "Hand-poured, single origin, brewed fresh" },
  { name: "Honey Lavender Latte", price: "$6.25", desc: "Floral lavender with raw honey sweetness" },
];

const stats = [
  { value: "12+", label: "Bean Origins" },
  { value: "5K", label: "Cups Daily" },
  { value: "4.9", label: "Star Rating" },
  { value: "2018", label: "Est. Since" },
];

export default function CafeDemoPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-[#FDF8F0]/90 backdrop-blur-md border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-700 to-yellow-600 flex items-center justify-center">
              <Coffee className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-amber-900 tracking-tight">Brew & Bean</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#menu" className="text-sm font-medium text-amber-800 hover:text-amber-600 transition-colors">Menu</a>
            <a href="#about" className="text-sm font-medium text-amber-800 hover:text-amber-600 transition-colors">Our Story</a>
            <a href="#visit" className="text-sm font-medium text-amber-800 hover:text-amber-600 transition-colors">Visit Us</a>
            <button className="px-5 py-2.5 rounded-full bg-amber-800 text-white text-sm font-medium hover:bg-amber-700 transition-colors shadow-lg shadow-amber-800/20">
              Order Online
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-amber-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-100/50 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-8">
                <Leaf className="h-4 w-4" />
                100% Ethically Sourced Beans
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-amber-950 leading-[1.1]">
                Where Every
                <br />
                <span className="text-amber-700">Sip Tells</span>
                <br />
                A Story
              </h1>
              <p className="mt-8 text-lg text-amber-800/70 leading-relaxed max-w-md">
                Handcrafted coffee from single-origin beans, roasted in-house daily.
                A sanctuary for those who appreciate the art of a perfect cup.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <button className="px-8 py-4 rounded-full bg-amber-800 text-white font-semibold hover:bg-amber-700 transition-all shadow-xl shadow-amber-800/20 hover:shadow-amber-800/30 hover:-translate-y-0.5">
                  Explore Menu
                </button>
                <button className="px-8 py-4 rounded-full border-2 border-amber-800 text-amber-800 font-semibold hover:bg-amber-800 hover:text-white transition-all">
                  Find Us
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-amber-200 via-amber-100 to-yellow-50 border border-amber-200 p-8 flex items-center justify-center shadow-2xl shadow-amber-200/50">
                <div className="text-center">
                  <div className="h-40 w-40 rounded-full bg-gradient-to-br from-amber-700 to-amber-500 flex items-center justify-center mx-auto shadow-2xl shadow-amber-700/30">
                    <Coffee className="h-20 w-20 text-white" />
                  </div>
                  <p className="mt-8 text-2xl font-bold text-amber-900">Freshly Roasted</p>
                  <p className="mt-2 text-amber-700">Every single morning</p>
                  <div className="mt-6 flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-amber-600 mt-2">2,400+ Happy Customers</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 px-5 py-3 rounded-2xl bg-white shadow-xl border border-amber-100">
                <p className="text-xs text-amber-600 font-medium">Today&apos;s Special</p>
                <p className="text-sm font-bold text-amber-900">Honey Lavender Latte</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-amber-200/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-amber-800">{stat.value}</p>
                <p className="mt-2 text-sm text-amber-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-3">Our Menu</p>
            <h2 className="text-4xl md:text-5xl font-bold text-amber-950">
              Crafted With Love
            </h2>
            <p className="mt-4 text-amber-700/70 max-w-lg mx-auto">
              Every drink is handcrafted by our expert baristas using beans roasted fresh each morning.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-6 rounded-2xl bg-white border border-amber-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 transition-all group"
              >
                <div>
                  <h3 className="font-semibold text-amber-900 group-hover:text-amber-700 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-amber-600/70 mt-1">{item.desc}</p>
                </div>
                <span className="text-lg font-bold text-amber-800 shrink-0 ml-4">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-amber-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-800/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-700/30 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-3">Our Story</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Born From a Love of{" "}
                <span className="text-amber-300">Exceptional Coffee</span>
              </h2>
              <p className="mt-6 text-amber-100/80 leading-relaxed">
                Founded in 2018, Brew & Bean started as a small corner shop with a big dream:
                to bring specialty, ethically-sourced coffee to our community. Today, we partner
                directly with farmers across 12 countries to bring you the finest beans,
                roasted fresh in-house every single day.
              </p>
              <p className="mt-4 text-amber-100/80 leading-relaxed">
                We believe great coffee is more than a drink — it&apos;s an experience, a ritual,
                a moment of peace in a busy world.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-amber-300" />
                  <span className="text-sm text-amber-200">Fair Trade</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-amber-300" />
                  <span className="text-sm text-amber-200">Organic</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-300" />
                  <span className="text-sm text-amber-200">Award Winning</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-3xl bg-amber-800/50 border border-amber-700/50 flex items-center justify-center">
                <Coffee className="h-16 w-16 text-amber-300/50" />
              </div>
              <div className="aspect-[3/4] rounded-3xl bg-amber-800/50 border border-amber-700/50 flex items-center justify-center mt-8">
                <Leaf className="h-16 w-16 text-amber-300/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visit */}
      <section id="visit" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-3">Visit Us</p>
            <h2 className="text-4xl md:text-5xl font-bold text-amber-950">
              Come Say Hello
            </h2>
          </div>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-white border border-amber-100 text-center hover:shadow-lg transition-shadow">
              <MapPin className="h-8 w-8 text-amber-700 mx-auto mb-4" />
              <h3 className="font-semibold text-amber-900">Location</h3>
              <p className="mt-2 text-sm text-amber-600">123 Bean Street, Brewtown, CA 90210</p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-amber-100 text-center hover:shadow-lg transition-shadow">
              <Clock className="h-8 w-8 text-amber-700 mx-auto mb-4" />
              <h3 className="font-semibold text-amber-900">Hours</h3>
              <p className="mt-2 text-sm text-amber-600">Mon-Fri: 6am - 8pm<br />Weekends: 7am - 9pm</p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-amber-100 text-center hover:shadow-lg transition-shadow">
              <Phone className="h-8 w-8 text-amber-700 mx-auto mb-4" />
              <h3 className="font-semibold text-amber-900">Contact</h3>
              <p className="mt-2 text-sm text-amber-600">(555) 123-BREW<br />hello@brewandbean.co</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-amber-950 text-amber-200">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-amber-700 flex items-center justify-center">
              <Coffee className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">Brew & Bean</span>
          </div>
          <p className="text-sm text-amber-400">
            &copy; 2026 Brew & Bean Coffee Co. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

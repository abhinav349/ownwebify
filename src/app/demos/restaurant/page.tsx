import { UtensilsCrossed, Star, Clock, Wine, Flame, Award, MapPin, Phone } from "lucide-react";

const courses = [
  { name: "Truffle Burrata", price: "$22", category: "Starter", desc: "With heirloom tomatoes & aged balsamic" },
  { name: "Saffron Risotto", price: "$34", category: "Main", desc: "Arborio rice, wild mushrooms, parmigiano" },
  { name: "Wagyu Tenderloin", price: "$58", category: "Main", desc: "A5 grade, miso-glazed, seasonal vegetables" },
  { name: "Pan-Seared Scallops", price: "$42", category: "Main", desc: "Cauliflower purée, pancetta crisp, lemon oil" },
  { name: "Dark Chocolate Fondant", price: "$18", category: "Dessert", desc: "Molten center, vanilla bean gelato" },
  { name: "Crème Brûlée", price: "$16", category: "Dessert", desc: "Tahitian vanilla, caramelized sugar" },
];

const reviews = [
  { text: "An unforgettable dining experience. Every course was a masterpiece.", author: "The Times", rating: 5 },
  { text: "Saffron Table sets the gold standard for fine dining in the city.", author: "Food & Wine", rating: 5 },
  { text: "Impeccable service, extraordinary flavors. A must-visit destination.", author: "Michelin Guide", rating: 5 },
];

export default function RestaurantDemoPage() {
  return (
    <div className="min-h-screen bg-[#1a0a0a]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-[#1a0a0a]/90 backdrop-blur-md border-b border-amber-900/20">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UtensilsCrossed className="h-6 w-6 text-amber-400" />
            <span className="font-serif text-xl text-amber-50 tracking-wide">Saffron Table</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#menu" className="text-sm text-amber-200/70 hover:text-amber-200 transition-colors tracking-wide">Menu</a>
            <a href="#about" className="text-sm text-amber-200/70 hover:text-amber-200 transition-colors tracking-wide">About</a>
            <a href="#reviews" className="text-sm text-amber-200/70 hover:text-amber-200 transition-colors tracking-wide">Reviews</a>
            <button className="px-6 py-2.5 border border-amber-400/50 text-amber-300 text-sm tracking-wider uppercase hover:bg-amber-400/10 transition-colors rounded-sm">
              Reserve
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a0a] via-[#2d0f0f] to-[#1a0a0a]" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-900/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-900/15 rounded-full blur-[128px]" />
        </div>
        <div className="text-center px-6 max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-8">
            {[...Array(3)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs text-amber-400/80 uppercase tracking-[0.3em] ml-2">Michelin Starred</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif text-amber-50 leading-[1.1]">
            A Culinary
            <br />
            <em className="text-amber-400 italic">Journey</em>
          </h1>
          <p className="mt-8 text-lg text-amber-200/60 max-w-lg mx-auto leading-relaxed font-light">
            Where tradition meets innovation. An intimate dining experience
            celebrating the finest ingredients and time-honored techniques.
          </p>
          <div className="mt-12 flex items-center justify-center gap-6">
            <button className="px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-medium tracking-wider uppercase text-sm hover:from-amber-500 hover:to-amber-400 transition-all shadow-2xl shadow-amber-600/20 rounded-sm">
              Reserve a Table
            </button>
            <button className="px-10 py-4 border border-amber-400/30 text-amber-300 font-medium tracking-wider uppercase text-sm hover:border-amber-400/60 transition-all rounded-sm">
              View Menu
            </button>
          </div>
          <div className="mt-20 flex items-center justify-center gap-12 text-center">
            <div>
              <Wine className="h-6 w-6 text-amber-400/60 mx-auto mb-2" />
              <p className="text-xs text-amber-200/50 uppercase tracking-wider">200+ Wines</p>
            </div>
            <div className="h-8 w-px bg-amber-400/20" />
            <div>
              <Flame className="h-6 w-6 text-amber-400/60 mx-auto mb-2" />
              <p className="text-xs text-amber-200/50 uppercase tracking-wider">Open Kitchen</p>
            </div>
            <div className="h-8 w-px bg-amber-400/20" />
            <div>
              <Award className="h-6 w-6 text-amber-400/60 mx-auto mb-2" />
              <p className="text-xs text-amber-200/50 uppercase tracking-wider">Award Winning</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-32 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1a0a0a] via-[#150808] to-[#1a0a0a]" />
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-20">
            <p className="text-xs text-amber-400 uppercase tracking-[0.3em] mb-4">Curated Selection</p>
            <h2 className="text-4xl md:text-5xl font-serif text-amber-50">
              Tasting Menu
            </h2>
            <div className="mt-4 w-16 h-px bg-amber-400/50 mx-auto" />
          </div>
          <div className="space-y-1">
            {courses.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between py-6 border-b border-amber-900/20 group hover:border-amber-400/30 transition-colors"
              >
                <div>
                  <p className="text-xs text-amber-400/60 uppercase tracking-wider mb-1">{item.category}</p>
                  <h3 className="text-lg font-serif text-amber-50 group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-amber-200/40 mt-1">{item.desc}</p>
                </div>
                <span className="text-xl font-serif text-amber-400 shrink-0 ml-6">{item.price}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button className="px-10 py-4 border border-amber-400/30 text-amber-300 text-sm tracking-wider uppercase hover:bg-amber-400/5 transition-all rounded-sm">
              Full Menu & Wine List
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-32 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-xs text-amber-400 uppercase tracking-[0.3em] mb-4">Our Philosophy</p>
              <h2 className="text-4xl md:text-5xl font-serif text-amber-50 leading-tight">
                Every Dish Tells
                <br />
                <em className="text-amber-400 italic">A Story</em>
              </h2>
              <p className="mt-8 text-amber-200/60 leading-relaxed">
                Chef Ananya Sharma draws inspiration from her travels across India, France, and Japan,
                creating a menu that celebrates the intersection of cultures. Using only the finest
                seasonal ingredients sourced from local farms and trusted suppliers worldwide.
              </p>
              <p className="mt-4 text-amber-200/60 leading-relaxed">
                Our tasting menu changes with the seasons, ensuring every visit to Saffron Table
                is a new discovery. The wine cellar houses over 200 carefully curated bottles
                from the world&apos;s most revered vineyards.
              </p>
              <div className="mt-10 grid grid-cols-3 gap-8">
                <div>
                  <p className="text-3xl font-serif text-amber-400">15</p>
                  <p className="text-xs text-amber-200/50 mt-1 uppercase tracking-wider">Years</p>
                </div>
                <div>
                  <p className="text-3xl font-serif text-amber-400">3</p>
                  <p className="text-xs text-amber-200/50 mt-1 uppercase tracking-wider">Stars</p>
                </div>
                <div>
                  <p className="text-3xl font-serif text-amber-400">1</p>
                  <p className="text-xs text-amber-200/50 mt-1 uppercase tracking-wider">Vision</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-sm bg-gradient-to-br from-amber-900/30 to-rose-900/20 border border-amber-800/30 flex items-center justify-center">
                <div className="text-center">
                  <Flame className="h-20 w-20 text-amber-400/30 mx-auto" />
                  <p className="mt-4 text-amber-200/40 font-serif italic">The Art of Fire</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 p-6 bg-[#1a0a0a] border border-amber-800/30 rounded-sm">
                <p className="text-xs text-amber-400 uppercase tracking-wider">Open Kitchen</p>
                <p className="text-sm text-amber-100 mt-1">Watch the magic unfold</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-32 border-t border-amber-900/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs text-amber-400 uppercase tracking-[0.3em] mb-4">Press & Reviews</p>
            <h2 className="text-4xl font-serif text-amber-50">What They Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review.author}
                className="p-8 border border-amber-900/20 rounded-sm hover:border-amber-400/20 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-amber-100/80 font-serif italic leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="mt-6 text-xs text-amber-400 uppercase tracking-wider">— {review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1a0a0a] via-[#2d0f0f] to-[#1a0a0a]" />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-amber-50">
            Reserve Your Table
          </h2>
          <p className="mt-6 text-amber-200/60 leading-relaxed">
            Join us for an evening of extraordinary cuisine. Reservations recommended.
          </p>
          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-amber-300/70">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Tue - Sun, 6pm - 11pm</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>(555) 789-TABLE</span>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4 text-amber-400/60" />
            <span className="text-sm text-amber-200/50">45 Gold Avenue, Downtown, NY 10001</span>
          </div>
          <button className="mt-10 px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-medium tracking-wider uppercase text-sm hover:from-amber-500 hover:to-amber-400 transition-all shadow-2xl shadow-amber-600/20 rounded-sm">
            Make a Reservation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-amber-900/20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <UtensilsCrossed className="h-6 w-6 text-amber-400/50 mx-auto mb-3" />
          <p className="text-xs text-amber-200/40 tracking-wider">
            &copy; 2026 Saffron Table. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

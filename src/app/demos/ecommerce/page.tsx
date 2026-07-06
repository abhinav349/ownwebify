import { ShoppingBag, Heart, Star, Truck, RotateCcw, Shield, ArrowRight, Search } from "lucide-react";

const products = [
  { name: "Cashmere Overcoat", price: "$890", category: "Outerwear", tag: "New" },
  { name: "Silk Midi Dress", price: "$420", category: "Dresses", tag: "Bestseller" },
  { name: "Leather Tote Bag", price: "$580", category: "Accessories", tag: null },
  { name: "Merino Wool Blazer", price: "$650", category: "Suiting", tag: "New" },
  { name: "Gold Chain Necklace", price: "$320", category: "Jewelry", tag: null },
  { name: "Suede Ankle Boots", price: "$490", category: "Shoes", tag: "Limited" },
  { name: "Linen Wide Trousers", price: "$280", category: "Bottoms", tag: null },
  { name: "Crystal Drop Earrings", price: "$195", category: "Jewelry", tag: "Bestseller" },
];

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $200" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: Shield, title: "Secure Payment", desc: "256-bit encryption" },
];

const collections = [
  { name: "Summer 2026", count: "42 pieces" },
  { name: "Resort Wear", count: "28 pieces" },
  { name: "Evening Edit", count: "35 pieces" },
  { name: "Essentials", count: "56 pieces" },
];

export default function EcommerceDemoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <span className="text-2xl font-light tracking-[0.3em] text-gray-900 uppercase">Velvet & Thread</span>
          <div className="hidden md:flex items-center gap-10">
            <a href="#shop" className="text-xs text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-[0.2em]">Shop</a>
            <a href="#collections" className="text-xs text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-[0.2em]">Collections</a>
            <a href="#about" className="text-xs text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-[0.2em]">Story</a>
          </div>
          <div className="flex items-center gap-4">
            <Search className="h-4 w-4 text-gray-600 cursor-pointer hover:text-gray-900" />
            <Heart className="h-4 w-4 text-gray-600 cursor-pointer hover:text-gray-900" />
            <div className="relative">
              <ShoppingBag className="h-4 w-4 text-gray-600 cursor-pointer hover:text-gray-900" />
              <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-gray-900 text-white text-[8px] font-bold flex items-center justify-center">3</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24">
        <div className="relative h-[80vh] bg-gray-50 flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#f5f5f0_0%,#ebebeb_100%)]" />
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-gray-200/50 to-transparent" />
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">Summer Collection 2026</p>
              <h1 className="text-5xl md:text-7xl font-light text-gray-900 leading-[1.1] tracking-tight">
                Timeless
                <br />
                <span className="italic font-normal">Elegance</span>
              </h1>
              <p className="mt-8 text-gray-500 leading-relaxed max-w-md">
                Curated pieces crafted from the finest materials. Designed to transcend
                seasons and elevate your everyday wardrobe.
              </p>
              <div className="mt-10 flex items-center gap-6">
                <button className="px-10 py-4 bg-gray-900 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-gray-800 transition-colors">
                  Shop Now
                </button>
                <a href="#collections" className="text-xs uppercase tracking-[0.2em] text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-4 justify-center">
                <feature.icon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="shop" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">Curated Selection</p>
              <h2 className="text-3xl font-light text-gray-900 tracking-tight">New Arrivals</h2>
            </div>
            <a href="#" className="text-xs uppercase tracking-[0.2em] text-gray-600 hover:text-gray-900 flex items-center gap-2">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.name} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-gray-100 rounded-sm relative overflow-hidden mb-4">
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-200 flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-gray-300" />
                  </div>
                  {product.tag && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white text-[10px] uppercase tracking-wider font-medium text-gray-700">
                      {product.tag}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                    <button className="px-6 py-2.5 bg-white text-gray-900 text-xs uppercase tracking-wider font-medium shadow-lg">
                      Quick Add
                    </button>
                  </div>
                  <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{product.category}</p>
                <h3 className="mt-1 text-sm font-medium text-gray-900 group-hover:underline">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">Browse By</p>
            <h2 className="text-3xl font-light text-gray-900 tracking-tight">Collections</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {collections.map((col) => (
              <div
                key={col.name}
                className="aspect-[3/4] bg-gradient-to-b from-gray-200 to-gray-300 rounded-sm relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-white text-sm font-medium">{col.name}</h3>
                  <p className="text-white/70 text-xs mt-1">{col.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-light text-gray-300 italic">V&T</p>
                <p className="text-xs text-gray-400 uppercase tracking-[0.3em] mt-4">Since 2019</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">Our Story</p>
              <h2 className="text-3xl font-light text-gray-900 leading-relaxed">
                Fashion That Respects Both <em className="italic">People</em> and <em className="italic">Planet</em>
              </h2>
              <p className="mt-6 text-gray-500 leading-relaxed">
                Founded with a belief that luxury shouldn&apos;t come at the cost of ethics.
                Every piece in our collection is crafted from sustainably sourced materials,
                produced in fair-wage workshops, and designed to last for years — not just one season.
              </p>
              <p className="mt-4 text-gray-500 leading-relaxed">
                We partner with artisans across Italy, Portugal, and India to create garments
                that honor traditional craftsmanship while embracing modern design.
              </p>
              <div className="mt-8 flex items-center gap-8">
                <div>
                  <p className="text-2xl font-light text-gray-900">100%</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Sustainable</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div>
                  <p className="text-2xl font-light text-gray-900">40+</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Countries</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-gray-900 text-gray-900" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Rated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="mx-auto max-w-xl px-6 text-center">
          <h2 className="text-2xl font-light tracking-tight">
            Join the Inner Circle
          </h2>
          <p className="mt-4 text-gray-400 text-sm">
            Be first to know about new collections, exclusive offers, and styling inspiration.
          </p>
          <div className="mt-8 flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-3.5 bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-gray-500"
            />
            <button className="px-6 py-3.5 bg-white text-gray-900 text-xs uppercase tracking-wider font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-600">Unsubscribe anytime. No spam.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-lg font-light tracking-[0.3em] text-gray-900 uppercase">Velvet & Thread</p>
          <p className="text-xs text-gray-400 mt-2">
            &copy; 2026 Velvet & Thread. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

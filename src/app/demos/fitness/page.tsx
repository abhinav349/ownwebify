import { Dumbbell, Zap, Timer, Users, Trophy, Heart, ArrowRight, Flame } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    features: ["Full gym access", "Locker room", "Free WiFi", "1 PT session/month"],
    popular: false,
  },
  {
    name: "Pro",
    price: "$59",
    period: "/month",
    features: ["Everything in Starter", "Unlimited classes", "Nutrition plan", "4 PT sessions/month", "Sauna & steam"],
    popular: true,
  },
  {
    name: "Elite",
    price: "$99",
    period: "/month",
    features: ["Everything in Pro", "Personal trainer", "Recovery zone", "Guest passes", "Priority booking"],
    popular: false,
  },
];

const classes = [
  { name: "HIIT Blitz", time: "6:00 AM", duration: "45 min", intensity: "High" },
  { name: "Power Yoga", time: "7:30 AM", duration: "60 min", intensity: "Medium" },
  { name: "CrossFit WOD", time: "12:00 PM", duration: "50 min", intensity: "Extreme" },
  { name: "Spin & Burn", time: "5:30 PM", duration: "40 min", intensity: "High" },
  { name: "Boxing Fundamentals", time: "7:00 PM", duration: "60 min", intensity: "High" },
  { name: "Recovery & Stretch", time: "8:30 PM", duration: "30 min", intensity: "Low" },
];

const stats = [
  { value: "10K+", label: "Members", icon: Users },
  { value: "200+", label: "Classes/Week", icon: Timer },
  { value: "50+", label: "Trainers", icon: Trophy },
  { value: "24/7", label: "Access", icon: Zap },
];

export default function FitnessDemoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-lime-400/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-lime-400 flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-black" />
            </div>
            <span className="font-black text-xl text-white tracking-tight uppercase">IronPulse</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#classes" className="text-sm text-gray-400 hover:text-lime-400 transition-colors uppercase tracking-wider font-medium">Classes</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-lime-400 transition-colors uppercase tracking-wider font-medium">Pricing</a>
            <a href="#join" className="text-sm text-gray-400 hover:text-lime-400 transition-colors uppercase tracking-wider font-medium">Join</a>
            <button className="px-6 py-2.5 bg-lime-400 text-black text-sm font-bold uppercase tracking-wider hover:bg-lime-300 transition-colors rounded-lg">
              Free Trial
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a2e05_0%,#0a0a0a_60%)]" />
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-lime-400/5 rounded-full blur-[128px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:6rem_6rem]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lime-400/10 border border-lime-400/20 text-lime-400 text-sm font-bold uppercase tracking-wider mb-8">
              <Flame className="h-4 w-4" />
              No Excuses. Just Results.
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter">
              Push Your
              <br />
              <span className="text-lime-400">Limits</span>
              <br />
              Every Day
            </h1>
            <p className="mt-8 text-xl text-gray-400 leading-relaxed max-w-lg">
              State-of-the-art equipment. World-class trainers. A community that
              pushes you to be your best. This is where champions are built.
            </p>
            <div className="mt-10 flex items-center gap-4 flex-wrap">
              <button className="px-10 py-5 bg-lime-400 text-black font-black uppercase tracking-wider text-sm hover:bg-lime-300 transition-all shadow-2xl shadow-lime-400/20 hover:-translate-y-0.5 rounded-lg">
                Start Free Trial <ArrowRight className="inline ml-2 h-4 w-4" />
              </button>
              <button className="px-10 py-5 border-2 border-gray-700 text-white font-bold uppercase tracking-wider text-sm hover:border-lime-400/50 hover:text-lime-400 transition-all rounded-lg">
                View Schedule
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-gray-800">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-8 w-8 text-lime-400 mx-auto mb-3" />
                <p className="text-3xl md:text-4xl font-black text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500 uppercase tracking-wider font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes */}
      <section id="classes" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-lime-400 uppercase tracking-wider mb-3">Daily Schedule</p>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              Today&apos;s Classes
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {classes.map((cls) => (
              <div
                key={cls.name}
                className="flex items-center justify-between p-5 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-lime-400/30 hover:bg-gray-900 transition-all group"
              >
                <div className="flex items-center gap-5">
                  <span className="text-sm font-mono text-lime-400 w-20">{cls.time}</span>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-lime-400 transition-colors">
                      {cls.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{cls.duration}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  cls.intensity === "Extreme" ? "bg-red-500/10 text-red-400" :
                  cls.intensity === "High" ? "bg-orange-500/10 text-orange-400" :
                  cls.intensity === "Medium" ? "bg-yellow-500/10 text-yellow-400" :
                  "bg-green-500/10 text-green-400"
                }`}>
                  {cls.intensity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-lime-400/[0.02] to-transparent" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-lime-400 uppercase tracking-wider mb-3">Membership</p>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              Choose Your Plan
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-2xl border ${
                  plan.popular
                    ? "border-lime-400/50 bg-lime-400/5 shadow-xl shadow-lime-400/10 scale-105 relative"
                    : "border-gray-800 bg-gray-900/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-lime-400 text-black text-xs font-black uppercase rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold uppercase tracking-wider text-gray-300">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-400">
                      <Heart className="h-4 w-4 text-lime-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`mt-8 w-full py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-all ${
                  plan.popular
                    ? "bg-lime-400 text-black hover:bg-lime-300"
                    : "border border-gray-700 text-white hover:border-lime-400/50 hover:text-lime-400"
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="join" className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="p-12 md:p-16 rounded-3xl bg-gradient-to-br from-lime-400/10 to-green-900/20 border border-lime-400/20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <Zap className="h-12 w-12 text-lime-400 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                Your First Week <span className="text-lime-400">Free</span>
              </h2>
              <p className="mt-6 text-gray-400 text-lg max-w-lg mx-auto">
                No contracts. No commitment. Just walk in and start training.
                If you love it, join the family.
              </p>
              <button className="mt-10 px-12 py-5 bg-lime-400 text-black font-black uppercase tracking-wider text-sm hover:bg-lime-300 transition-all shadow-2xl shadow-lime-400/20 rounded-lg">
                Claim Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Dumbbell className="h-5 w-5 text-lime-400" />
            <span className="font-black text-white uppercase tracking-tight">IronPulse</span>
          </div>
          <p className="text-xs text-gray-600">
            &copy; 2026 IronPulse Fitness. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

import { Stethoscope, Heart, Shield, Users, CheckCircle, Calendar } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";

const ACCENT = "#4fd1c5";

const services = [
  { name: "General Medicine", icon: Stethoscope, desc: "Comprehensive health check-ups and preventive care for the whole family." },
  { name: "Pediatrics", icon: Heart, desc: "Specialized, gentle care for infants, children, and adolescents." },
  { name: "Dental Care", icon: Shield, desc: "From routine cleanings to advanced restorative procedures." },
  { name: "Women's Health", icon: Users, desc: "Dedicated gynecology and obstetrics services." },
  { name: "Diagnostics", icon: CheckCircle, desc: "On-site lab testing, imaging, and same-day results." },
  { name: "Physiotherapy", icon: Calendar, desc: "Recovery programs tailored to your needs and goals." },
];

export function Offerings() {
  return (
    <section id="services" className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">What We Treat</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Our Services</h2>
          </Reveal>
        </div>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.07}>
          {services.map((service) => (
            <StaggerItem key={service.name}>
              <div className="h-full p-7 border border-white/10 rounded-sm transition-colors hover:border-white/25 group">
                <service.icon className="h-6 w-6 mb-4 transition-transform group-hover:-translate-y-0.5" style={{ color: ACCENT }} />
                <h3 className="font-display text-xl">{service.name}</h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">{service.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

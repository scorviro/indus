"use client";

import Image from "next/image";
import { Settings, Cpu, Shield, Award } from "lucide-react";

export default function ProductSection() {
  const models = [
    {
      name: "NEXUS V3",
      tagline: "Compact High-Speed Machining",
      desc: "Optimized for high-speed, light-duty manufacturing in medical, electronics, and precision components. Features a compact footprint without compromising on rigidity.",
      specs: {
        spindle: "15,000 RPM (Direct Drive)",
        travel: "600 x 400 x 450 mm",
        table: "700 x 400 mm",
        capacity: "16 Tools (ATC)",
      },
      icon: Cpu,
    },
    {
      name: "NEXUS V5",
      tagline: "Heavy-Duty Production Workhorse",
      desc: "Designed for heavy-duty metal cutting in automotive, molds, and general engineering. Heavy cast iron frame delivers maximum dampening and stability under heavy loads.",
      specs: {
        spindle: "10,000 RPM (High Torque Gearbox)",
        travel: "1020 x 600 x 600 mm",
        table: "1200 x 600 mm",
        capacity: "24 Tools (ATC)",
      },
      icon: Settings,
      popular: true,
    },
    {
      name: "NEXUS X5",
      tagline: "Simultaneous 5-Axis Precision",
      desc: "The pinnacle of engineering, featuring simultaneous 5-axis capability for aerospace, defence, and complex turbine components. Direct-drive rotary tilting table.",
      specs: {
        spindle: "18,000 RPM (Built-in Motor Spindle)",
        travel: "800 x 800 x 550 mm",
        table: "ø 630 mm Integrated Trunnion",
        capacity: "40 Tools (Chain-type ATC)",
      },
      icon: Award,
    },
  ];

  return (
    <section 
      id="product" 
      className="relative w-full min-h-screen bg-white text-zinc-900 py-24 flex flex-col justify-center overflow-hidden z-10"
    >
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-200 pb-10">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#ff6b00] uppercase font-bold">
                PRODUCT LINEUP
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bebas tracking-tight text-zinc-950 uppercase leading-none">
              NEXUS VMC SERIES
            </h2>
          </div>
          <p className="text-zinc-600 text-sm md:text-base max-w-md leading-relaxed font-medium">
            From high-speed prototyping to heavy industrial casting cuts, the NEXUS Vertical Machining Center lineup offers unmatched thermal stability, high-torque spindle options, and absolute positioning accuracy.
          </p>
        </div>

        {/* Feature Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Details */}
          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-3xl font-bebas text-zinc-950 tracking-wide uppercase">
              Designed for Zero-Tolerance Industries
            </h3>
            
            <p className="text-zinc-600 text-sm leading-relaxed">
              Every NEXUS machine is cast from high-grade Meehanite iron, stress-relieved, and fitted with dual-anchored ball screws. This ensures maximum stiffness, minimal thermal expansion, and precision that lasts decades.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#ff6b00]/10 rounded-sm text-[#ff6b00]">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm uppercase tracking-wide">Heavy Casting Base</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-1">Wide-span triangular column design prevents structural twisting during rapid directional changes.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#ff6b00]/10 rounded-sm text-[#ff6b00]">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm uppercase tracking-wide">Next-Gen Controllers</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-1">Direct integration with FANUC 0i-MF Plus or Siemens SINUMERIK ONE for real-time feed optimization.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Product Image */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-[620px] aspect-square bg-zinc-50 rounded-xl overflow-hidden shadow-2xl border border-zinc-100 group">
              <Image 
                src="/product_vmc.png" 
                alt="NEXUS Vertical Machining Center" 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-white font-mono text-[9px] bg-zinc-950/80 px-3 py-1.5 backdrop-blur-md rounded-sm uppercase tracking-widest border border-white/10">
                NEXUS X5 Model Shown
              </div>
            </div>
          </div>
        </div>

        {/* Model Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          {models.map((model, idx) => {
            const Icon = model.icon;
            return (
              <div 
                key={idx} 
                className={`relative border rounded-lg p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
                  model.popular 
                    ? "border-[#ff6b00] bg-zinc-950 text-white shadow-lg" 
                    : "border-zinc-200 bg-zinc-50/50 text-zinc-800 hover:border-zinc-400"
                }`}
              >
                {model.popular && (
                  <span className="absolute -top-3.5 left-8 bg-[#ff6b00] text-white font-mono text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                
                <div className="space-y-6">
                  {/* Top line */}
                  <div className="flex justify-between items-center">
                    <h4 className={`text-4xl font-bebas leading-none tracking-wide ${model.popular ? "text-white" : "text-zinc-950"}`}>
                      {model.name}
                    </h4>
                    <Icon className={`w-6 h-6 ${model.popular ? "text-[#ff6b00]" : "text-zinc-500"}`} />
                  </div>

                  <div className="space-y-2">
                    <h5 className={`text-xs font-mono font-bold tracking-wider uppercase ${model.popular ? "text-[#ff6b00]" : "text-zinc-900"}`}>
                      {model.tagline}
                    </h5>
                    <p className={`text-xs leading-relaxed ${model.popular ? "text-zinc-400" : "text-zinc-500"}`}>
                      {model.desc}
                    </p>
                  </div>

                  {/* Specs Table */}
                  <div className={`border-t pt-4 space-y-2 ${model.popular ? "border-zinc-800" : "border-zinc-200"}`}>
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className={model.popular ? "text-zinc-500" : "text-zinc-400"}>SPINDLE SPEED</span>
                      <span className={`font-bold ${model.popular ? "text-white" : "text-zinc-900"}`}>{model.specs.spindle}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className={model.popular ? "text-zinc-500" : "text-zinc-400"}>X/Y/Z TRAVEL</span>
                      <span className={`font-bold ${model.popular ? "text-white" : "text-zinc-900"}`}>{model.specs.travel}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className={model.popular ? "text-zinc-500" : "text-zinc-400"}>TABLE SIZE</span>
                      <span className={`font-bold ${model.popular ? "text-white" : "text-zinc-900"}`}>{model.specs.table}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className={model.popular ? "text-zinc-500" : "text-zinc-400"}>TOOL CAPACITY</span>
                      <span className={`font-bold ${model.popular ? "text-white" : "text-zinc-900"}`}>{model.specs.capacity}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <a 
                    href="#quote" 
                    className={`block text-center py-3 font-mono text-[10px] font-bold uppercase tracking-wider rounded transition-all duration-300 ${
                      model.popular 
                        ? "bg-[#ff6b00] text-white hover:bg-[#e05e00]" 
                        : "bg-zinc-900 text-white hover:bg-zinc-800"
                    }`}
                  >
                    Configure Model
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Check, Settings, Compass, Cpu, RefreshCw } from "lucide-react";

export default function SpecsSection() {
  const parameters = [
    { name: "Table Size", v3: "700 x 400 mm", v5: "1200 x 600 mm", x5: "ø 630 mm Trunnion" },
    { name: "Max Table Load", v3: "350 kg", v5: "800 kg", x5: "500 kg" },
    { name: "X/Y/Z Axis Travel", v3: "600 / 400 / 450 mm", v5: "1020 / 600 / 600 mm", x5: "800 / 800 / 550 mm" },
    { name: "A/C Axis Tilting Range", v3: "N/A", v5: "N/A", x5: "±120° / 360° Continuous" },
    { name: "Spindle Speed", v3: "15,000 RPM", v5: "10,000 RPM", x5: "18,000 RPM" },
    { name: "Spindle Motor Power", v3: "11 / 15 kW", v5: "15 / 18.5 kW", x5: "25 / 35 kW" },
    { name: "Spindle Taper", v3: "BT30 / BBT30", v5: "BT40 / BBT40 / CAT40", x5: "HSK-A63" },
    { name: "Tool Magazine Capacity", v3: "16 Tools", v5: "24 Tools", x5: "40 Tools" },
    { name: "Rapid Traverse (X/Y/Z)", v3: "36 / 36 / 30 m/min", v5: "36 / 36 / 30 m/min", x5: "48 / 48 / 48 m/min" },
    { name: "Positioning Accuracy", v3: "±0.003 mm", v5: "±0.003 mm", x5: "±0.002 mm" },
    { name: "Repeatability", v3: "±0.002 mm", v5: "±0.002 mm", x5: "±0.001 mm" },
    { name: "CNC Controller Option", v3: "FANUC 0i-MF / Siemens 828D", v5: "FANUC 0i-MF / Siemens 828D", x5: "FANUC 31i-B5 / Siemens ONE" },
  ];

  const features = [
    {
      title: "High Speed Spindle",
      desc: "Auto-balancing direct drive spindle designed to minimize thermal distortion and maximize cutting feedrates.",
      icon: Settings,
    },
    {
      title: "5-Axis Precision",
      desc: "Simultaneous 5-axis control enabling complex helical and turbine blade geometries to be milled in a single setup.",
      icon: Compass,
    },
    {
      title: "Smart CNC Control",
      desc: "Adaptive feed control and real-time monitoring algorithms to extend tool life by up to 35%.",
      icon: Cpu,
    },
    {
      title: "Auto Tool Changer",
      desc: "Ultra-reliable double-arm tool changer system completing tool-to-tool swapping in just 1.2 seconds.",
      icon: RefreshCw,
    },
  ];

  return (
    <section 
      id="specs" 
      className="relative w-full min-h-screen bg-[#07193f] text-slate-100 py-24 flex flex-col justify-center overflow-hidden z-10"
      style={{
        backgroundImage: "radial-gradient(circle at 80% 20%, rgba(26, 75, 172, 0.2) 0%, transparent 60%)"
      }}
    >
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 space-y-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-blue-900/60 pb-10">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#ff6b00] uppercase font-bold">
                SPECIFICATIONS
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bebas tracking-tight text-white uppercase leading-none">
              ENGINEERING PARAMETERS
            </h2>
          </div>
          <p className="text-blue-200/70 text-sm md:text-base max-w-md leading-relaxed font-medium">
            Review detailed alignment specifications across our three standard vertical machining platforms to select the system matching your technical load requirements.
          </p>
        </div>

        {/* Feature Grid (adapted from ScrollContainer specs) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="group border border-blue-900/50 bg-[#0a2354]/40 backdrop-blur-md p-6 rounded-sm text-left border-l-2 border-l-[#ff6b00] space-y-3 transition-all duration-300 hover:bg-[#0c2b66]/60 hover:border-blue-800 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/5 hover:border-l-[5px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-400">0{index + 1}</span>
                  <Icon className="w-5 h-5 text-[#ff6b00] transition-transform duration-300 group-hover:scale-115 group-hover:rotate-6" />
                </div>
                <h3 className="text-xl font-bebas text-white leading-none uppercase tracking-wide transition-colors duration-300 group-hover:text-[#ff6b00]">
                  {feature.title}
                </h3>
                <p className="text-[11px] text-blue-200/70 leading-relaxed font-sans font-medium transition-colors duration-300 group-hover:text-blue-100/90">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Full Specifications Table */}
        <div className="pt-8">
          <div className="overflow-x-auto rounded-lg border border-blue-900/60 bg-[#081e4b]/60 backdrop-blur-sm shadow-xl">
            <table className="min-w-full divide-y divide-blue-900/40 font-mono text-[10px] md:text-xs">
              <thead className="bg-[#0b275f]/80 text-white uppercase tracking-wider font-bold">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left font-sans font-extrabold text-[#ff6b00]">
                    TECHNICAL PARAMETER
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    NEXUS V3
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    NEXUS V5
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    NEXUS X5 (5-AXIS)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-950 text-slate-300">
                {parameters.map((param, index) => (
                  <tr 
                    key={index}
                    className={`transition-colors hover:bg-blue-900/20 ${
                      index % 2 === 0 ? "bg-[#092150]/20" : "bg-transparent"
                    }`}
                  >
                    <td className="px-6 py-4.5 font-sans font-bold text-white whitespace-nowrap">
                      {param.name}
                    </td>
                    <td className="px-6 py-4.5 text-center whitespace-nowrap text-blue-100">
                      {param.v3}
                    </td>
                    <td className="px-6 py-4.5 text-center whitespace-nowrap text-blue-100">
                      {param.v5}
                    </td>
                    <td className="px-6 py-4.5 text-center whitespace-nowrap text-blue-100 font-semibold bg-[#ff6b00]/5 border-x border-[#ff6b00]/10">
                      {param.x5}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

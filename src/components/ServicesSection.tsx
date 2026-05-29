"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, ShieldCheck, HeartHandshake, BookOpen } from "lucide-react";

export default function ServicesSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    machine: "NEXUS V5",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API request
    setTimeout(() => {
      setSubmitted(true);
    }, 800);
  };

  const services = [
    {
      title: "Preventive Care",
      desc: "Regular scheduled calibration, lubrication, and axis tolerance audits to guarantee uninterrupted precision.",
      icon: ShieldCheck,
    },
    {
      title: "Spindle Services",
      desc: "Complete spindle vibration analysis, bearing rebuilding, and balancing services with fast turnaround times.",
      icon: HeartHandshake,
    },
    {
      title: "Training Programs",
      desc: "Comprehensive CNC operator and programmer training on FANUC and Siemens interfaces to maximize feed efficiency.",
      icon: BookOpen,
    },
  ];

  return (
    <section 
      id="services" 
      className="relative w-full min-h-screen bg-[#800c1e] text-red-50 py-24 flex flex-col justify-center overflow-hidden z-10"
      style={{
        backgroundImage: "radial-gradient(circle at 20% 80%, rgba(220, 38, 38, 0.25) 0%, transparent 60%)"
      }}
    >
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-red-900/60 pb-10">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-white uppercase font-bold">
                SERVICES & SUPPORT
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bebas tracking-tight text-white uppercase leading-none">
              LIFECYCLE PARTNERSHIP
            </h2>
          </div>
          <p className="text-red-200/70 text-sm md:text-base max-w-md leading-relaxed font-medium">
            We don&apos;t just build vertical machining centers; we guarantee their uptime. From commissioning to deep spindle maintenance, NEXUS supports your line 24/7.
          </p>
        </div>

        {/* Content Split: Services Grid & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Services Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              {services.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <div 
                    key={idx} 
                    className="flex gap-4 p-5 rounded-md border border-red-900/40 bg-red-950/20 backdrop-blur-sm transition-all duration-300 hover:bg-red-950/30"
                  >
                    <div className="p-3 bg-white/10 rounded-sm text-white shrink-0 h-fit">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm uppercase tracking-wide">
                        {service.title}
                      </h4>
                      <p className="text-xs text-red-200/70 leading-relaxed font-medium">
                        {service.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Contact Info */}
            <div className="pt-6 space-y-4 border-t border-red-900/60 text-xs font-mono">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-red-300" />
                <span className="text-red-200/90">support@nexusmachinery.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-red-300" />
                <span className="text-red-200/90">+1 (800) 555-NEXUS</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-red-300" />
                <span className="text-red-200/90">Industrial Area 4, Block C, Innovation Drive</span>
              </div>
            </div>
          </div>

          {/* Frosted Glass Form Column */}
          <div className="lg:col-span-7" id="quote">
            <div className="w-full border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-lg shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-white/20" />
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bebas text-white uppercase tracking-wider">
                  Request Technical Quote
                </h3>
                <p className="text-red-200/60 text-xs font-medium">
                  Connect with our engineers to request layout drawings, spindle load curves, or standard pricing sheets.
                </p>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-fadeIn">
                  <CheckCircle className="w-16 h-16 text-white animate-bounce" />
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
                      Request Submitted
                    </h4>
                    <p className="text-xs text-red-200/70 max-w-sm">
                      A systems application engineer will review your machine requirements and respond within 4 business hours.
                    </p>
                  </div>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-4 font-mono text-[9px] uppercase tracking-widest text-white/60 hover:text-white underline transition-colors"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-wider uppercase text-red-200">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-sm py-3 px-4 text-white focus:outline-none focus:border-white focus:bg-black/30 transition-all font-sans text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-wider uppercase text-red-200">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({...formState, email: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-sm py-3 px-4 text-white focus:outline-none focus:border-white focus:bg-black/30 transition-all font-sans text-sm"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  {/* Machine Model Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-wider uppercase text-red-200">Target Platform</label>
                    <select 
                      value={formState.machine}
                      onChange={(e) => setFormState({...formState, machine: e.target.value})}
                      className="w-full bg-[#911d2e] border border-white/10 rounded-sm py-3 px-4 text-white focus:outline-none focus:border-white transition-all font-sans text-sm appearance-none cursor-pointer"
                    >
                      <option className="bg-[#800c1e] text-white">NEXUS V3 (Compact high-speed VMC)</option>
                      <option className="bg-[#800c1e] text-white">NEXUS V5 (Heavy-duty production VMC)</option>
                      <option className="bg-[#800c1e] text-white">NEXUS X5 (Precision 5-Axis VMC)</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-wider uppercase text-red-200">Machining Specifications / Message</label>
                    <textarea 
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-sm py-3 px-4 text-white focus:outline-none focus:border-white focus:bg-black/30 transition-all font-sans text-sm resize-none"
                      placeholder="Outline your materials, cycle times, or required axis travels..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    className="w-full py-4 bg-white text-zinc-950 font-bold uppercase tracking-widest hover:bg-zinc-150 active:scale-[0.99] transition-all flex items-center justify-center gap-2 rounded-sm"
                  >
                    <span>Submit RFP</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { Sparkles, Sprout, Globe2, Layers3 } from "lucide-react";

// NOTE: Spline scene URL — uses the public demo scene by default.
// Swap this for your own thematic Spline scene URL when one is ready.
// Create scenes at https://spline.design and copy the public scene URL.
const FARM_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export function FarmShowcase3D() {
  return (
    <Card className="w-full h-[560px] bg-[#04130d] border-emerald-900/40 relative overflow-hidden rounded-3xl shadow-2xl shadow-emerald-950/40">
      {/* Spotlight reveal */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#34d399"
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/3 -left-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 backdrop-blur-sm rounded-full text-emerald-300 text-xs font-medium mb-6 border border-emerald-500/20 self-start">
            <Sparkles className="w-3.5 h-3.5" />
            New · Immersive Experience
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.05] tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-emerald-50 to-emerald-300/70">
            Tour Your Farms
            <br />
            in Real 3D.
          </h2>

          <p className="mt-5 text-neutral-300/80 max-w-lg text-base md:text-lg leading-relaxed">
            Don&apos;t just buy a number on a screen. Walk the rows, watch the
            light shift across the canopy, and feel connected to the land
            that&apos;s growing your wealth.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { icon: Globe2, label: "Real terrain" },
              { icon: Sprout, label: "Live crop data" },
              { icon: Layers3, label: "Plot-level detail" },
            ].map((item) => (
              <div
                key={item.label}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/5 backdrop-blur-sm rounded-xl text-sm text-neutral-200 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <item.icon className="w-4 h-4 text-emerald-400" />
                {item.label}
              </div>
            ))}
          </div>

          {/* Hint */}
          <p className="mt-8 text-xs text-emerald-300/60 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Click and drag the 3D scene to explore
          </p>
        </div>

        {/* Right content — 3D scene */}
        <div className="flex-1 relative min-h-[280px] lg:min-h-0">
          <SplineScene
            scene={FARM_SCENE_URL}
            className="w-full h-full"
          />
          {/* Edge fade so the scene blends into the card */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#04130d] to-transparent pointer-events-none" />
        </div>
      </div>
    </Card>
  );
}

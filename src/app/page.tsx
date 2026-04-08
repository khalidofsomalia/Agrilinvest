import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FarmCard from "@/components/farm-card";
import { Reveal } from "@/components/reveal";
import { AnimatedCounter } from "@/components/animated-counter";
import { FarmShowcase3D } from "@/components/farm-showcase-3d";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  Search,
  MousePointerClick,
  Wallet,
  TrendingUp,
  Users,
  Landmark,
  Globe,
  ShieldCheck,
  BarChart3,
  Leaf,
  Quote,
  Sparkles,
  CircleDollarSign,
  CheckCircle2,
  Star,
} from "lucide-react";

async function getFeaturedFarms() {
  return prisma.farm.findMany({
    where: { status: "ACTIVE" },
    orderBy: { expectedROI: "desc" },
    take: 4,
  });
}

async function getStats() {
  const [farmCount, investmentCount, totalInvested] = await Promise.all([
    prisma.farm.count(),
    prisma.investment.count(),
    prisma.investment.aggregate({ _sum: { amount: true } }),
  ]);
  return {
    farms: farmCount,
    investments: investmentCount,
    totalInvested: totalInvested._sum.amount || 0,
  };
}

export default async function HomePage() {
  const [farms, stats] = await Promise.all([getFeaturedFarms(), getStats()]);

  return (
    <div>
      {/* Hero Section - Animated Gradient */}
      <section className="relative overflow-hidden animated-gradient min-h-[90vh] flex items-center">
        {/* Decorative orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-[10%] w-64 h-64 bg-emerald-400/20 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-1/4 right-[10%] w-80 h-80 bg-teal-300/15 rounded-full blur-[120px] animate-float stagger-3" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] animate-float stagger-5" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 glass-dark text-emerald-300 text-sm font-medium px-5 py-2.5 rounded-full mb-8">
                <Sparkles className="w-4 h-4" />
                The Future of Agricultural Investment
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                Invest in Farmland.
                <br />
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
                  Grow Your Wealth.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-emerald-100/70 mb-10 max-w-xl leading-relaxed">
                Purchase fractional shares of productive farmland worldwide.
                Diversify your portfolio with agricultural investments and earn
                returns from crop yields.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  size="lg"
                  className="text-base px-8 h-13 bg-white text-emerald-900 hover:bg-emerald-50 font-semibold shadow-lg shadow-black/20"
                  asChild
                >
                  <Link href="/marketplace">
                    Browse Farms
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 h-13 bg-white/5 border-white/20 text-white hover:bg-white/15 hover:text-white backdrop-blur-sm"
                  asChild
                >
                  <Link href="/#how-it-works">Learn How It Works</Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-emerald-200/60">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  SEC Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Verified Farms
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  No Hidden Fees
                </span>
              </div>
            </div>

            {/* Hero stats cards - floating glass cards */}
            <div className="hidden lg:block relative animate-fade-in stagger-3">
              <div className="relative">
                {/* Main stat card */}
                <div className="glass-dark rounded-3xl p-8 animate-float">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-emerald-300/70">Portfolio Growth</p>
                      <p className="text-2xl font-bold text-white">+15.4%</p>
                    </div>
                  </div>
                  {/* Mini chart bars */}
                  <div className="flex items-end gap-1.5 h-24">
                    {[40, 55, 35, 65, 50, 75, 60, 85, 70, 90, 80, 95].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-emerald-500/40 to-emerald-400/80 rounded-t-sm"
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-emerald-300/40">
                    <span>Jan</span>
                    <span>Jun</span>
                    <span>Dec</span>
                  </div>
                </div>

                {/* Floating smaller cards */}
                <div className="absolute -top-4 -right-4 glass-dark rounded-2xl p-4 animate-float stagger-2">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-xs text-emerald-300/60">Avg. ROI</p>
                      <p className="text-lg font-bold text-white">16.8%</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 glass-dark rounded-2xl p-4 animate-float stagger-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-xs text-emerald-300/60">Investors</p>
                      <p className="text-lg font-bold text-white">1,200+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom stats strip */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Invested",
                node: (
                  <AnimatedCounter
                    value={stats.totalInvested}
                    format="compact"
                    prefix="$"
                  />
                ),
                icon: Wallet,
              },
              {
                label: "Active Farms",
                node: <AnimatedCounter value={stats.farms} />,
                icon: Landmark,
              },
              {
                label: "Investments Made",
                node: (
                  <AnimatedCounter value={stats.investments} suffix="+" />
                ),
                icon: BarChart3,
              },
              {
                label: "Countries",
                node: <AnimatedCounter value={8} suffix="+" />,
                icon: Globe,
              },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
                <div className="glass-dark rounded-2xl p-5 transition-all duration-300 hover:bg-white/15">
                  <stat.icon className="w-5 h-5 text-emerald-400 mb-3" />
                  <p className="text-2xl font-bold text-white tracking-tight">
                    {stat.node}
                  </p>
                  <p className="text-sm text-emerald-200/50 mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - with connecting line */}
      <section id="how-it-works" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Start investing in agricultural land in three simple steps.
              No experience required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200" />

            {[
              {
                step: "01",
                icon: Search,
                title: "Browse Farms",
                description:
                  "Explore our curated marketplace of verified farms across the globe. Filter by crop type, location, and expected returns.",
                color: "from-emerald-500 to-teal-600",
              },
              {
                step: "02",
                icon: MousePointerClick,
                title: "Select Plots",
                description:
                  "Choose your plots from an interactive grid. Pick as many as you want and see your investment calculated in real time.",
                color: "from-teal-500 to-emerald-600",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Earn Returns",
                description:
                  "Track your portfolio as crops grow. Receive returns from harvests and watch your agricultural investments flourish.",
                color: "from-emerald-600 to-green-600",
              },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 120}>
                <div className="relative group">
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 card-hover bg-white">
                    <CardContent className="p-8 text-center">
                      {/* Step circle */}
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-xs font-bold text-emerald-600 tracking-widest uppercase mb-3">
                        Step {item.step}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Farms */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-2 rounded-full mb-4">
                <Star className="w-4 h-4" />
                Top Picks
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Featured Farms
              </h2>
              <p className="text-lg text-gray-500">
                Top-performing agricultural investments available now
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link href="/marketplace">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {farms.map((farm, i) => (
              <Reveal key={farm.id} delay={i * 80}>
                <FarmCard {...farm} />
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Button variant="outline" asChild>
              <Link href="/marketplace">
                View All Farms
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive 3D Showcase */}
      <section className="py-24 md:py-32 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <FarmShowcase3D />
          </Reveal>
        </div>
      </section>

      {/* Why Investoir - Gradient section */}
      <section className="py-24 md:py-32 animated-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Why Choose Investoir?
            </h2>
            <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto">
              We make agricultural investment accessible, transparent, and
              rewarding
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Verified Farms",
                description:
                  "Every farm is vetted and verified by our agricultural experts before listing.",
              },
              {
                icon: BarChart3,
                title: "Real-time Tracking",
                description:
                  "Monitor your investments with live portfolio tracking and performance analytics.",
              },
              {
                icon: Users,
                title: "Community Driven",
                description:
                  "Join a growing community of investors supporting sustainable agriculture worldwide.",
              },
              {
                icon: Globe,
                title: "Global Access",
                description:
                  "Invest in farms across multiple countries and diversify across different crops.",
              },
            ].map((feature, i) => (
              <Reveal key={feature.title} delay={i * 100}>
                <div className="glass-dark rounded-2xl p-8 text-center transition-all duration-300 hover:bg-white/15 h-full">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-white/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-emerald-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-emerald-100/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-2 rounded-full mb-4">
              <Star className="w-4 h-4" />
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              What Investors Say
            </h2>
            <p className="text-lg text-gray-500">
              Hear from our community of agricultural investors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "James Wilson",
                role: "Portfolio Investor",
                rating: 5,
                text: "Investoir opened up a whole new asset class for me. The returns from my coffee farm investments have consistently outperformed my expectations.",
              },
              {
                name: "Amina Osei",
                role: "Sustainable Investor",
                rating: 5,
                text: "I love that I can support sustainable farming while earning returns. The platform makes it incredibly easy to diversify across different crops and regions.",
              },
              {
                name: "Michael Chen",
                role: "First-time Investor",
                rating: 5,
                text: "As someone new to agricultural investing, the interactive plot selection and clear ROI projections made me feel confident in my first investment.",
              },
            ].map((testimonial, i) => (
              <Reveal key={testimonial.name} delay={i * 120}>
                <Card className="border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 card-hover h-full">
                  <CardContent className="p-8">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-emerald-200 mb-4" />
                    <p className="text-gray-600 leading-relaxed mb-8">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <Reveal direction="left">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <Leaf className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Bridging Agriculture{" "}
                <span className="gradient-text">& Finance</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6 text-lg">
                Investoir was founded with a simple mission: make agricultural
                investment accessible to everyone. We believe that farmland is
                one of the most stable and rewarding investment classes, and it
                shouldn&apos;t be limited to those who can afford entire farms.
              </p>
              <p className="text-gray-500 leading-relaxed mb-10">
                By enabling fractional ownership of farmland, we&apos;re
                democratizing access to agricultural returns while providing
                farmers with the capital they need to grow their operations
                sustainably.
              </p>
              <div className="grid grid-cols-2 gap-8">
                {[
                  {
                    node: (
                      <AnimatedCounter value={stats.farms} suffix="+" />
                    ),
                    label: "Verified Farms",
                  },
                  {
                    node: <AnimatedCounter value={8} suffix="+" />,
                    label: "Countries",
                  },
                  {
                    node: <AnimatedCounter value={15} suffix="%" />,
                    label: "Avg. ROI",
                  },
                  {
                    node: <AnimatedCounter value={100} suffix="%" />,
                    label: "Transparent",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="border-l-2 border-emerald-500 pl-4"
                  >
                    <p className="text-3xl font-extrabold text-gray-900">
                      {stat.node}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal direction="right" delay={150} className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center overflow-hidden">
                {/* Decorative farm-themed elements */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="grid grid-cols-3 gap-3 opacity-30">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-16 h-16 bg-emerald-500/30 rounded-xl"
                      />
                    ))}
                  </div>
                </div>
                <div className="relative text-center z-10">
                  <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Leaf className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-emerald-800 font-bold text-xl">
                    Sustainable
                  </p>
                  <p className="text-emerald-600 text-sm">Investment</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-600 rounded-2xl -z-10 opacity-80" />
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-teal-400 rounded-xl -z-10 opacity-60" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px]" />
        </div>
        <Reveal className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-900/50 text-emerald-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            Get Started Today
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Ready to Start Investing?
          </h2>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of investors who are growing their wealth through
            agricultural investments. Create your free account today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-base px-10 h-13 font-semibold shadow-lg shadow-emerald-600/20"
              asChild
            >
              <Link href="/register">
                Create Free Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-10 h-13 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              asChild
            >
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

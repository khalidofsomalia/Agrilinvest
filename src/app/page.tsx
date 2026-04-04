import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FarmCard from "@/components/farm-card";
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-700/50 backdrop-blur-sm text-emerald-200 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Leaf className="w-4 h-4" />
              Sustainable Agricultural Investment
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Invest in Farmland.{" "}
              <span className="text-emerald-400">Grow Your Wealth.</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100/80 mb-10 max-w-2xl leading-relaxed">
              Purchase fractional shares of productive farmland worldwide.
              Diversify your portfolio with agricultural investments and earn
              returns from crop yields.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base px-8" asChild>
                <Link href="/marketplace">
                  Browse Farms
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                asChild
              >
                <Link href="/#how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Floating Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Invested",
                value: `$${Math.round(stats.totalInvested / 1000)}K+`,
                icon: Wallet,
              },
              { label: "Active Farms", value: `${stats.farms}`, icon: Landmark },
              {
                label: "Investments Made",
                value: `${stats.investments}+`,
                icon: BarChart3,
              },
              { label: "Countries", value: "8+", icon: Globe },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <stat.icon className="w-5 h-5 text-emerald-400 mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-emerald-200/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Start investing in agricultural land in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Search,
                title: "Browse Farms",
                description:
                  "Explore our curated marketplace of verified farms across the globe. Filter by crop type, location, and expected returns.",
              },
              {
                step: "02",
                icon: MousePointerClick,
                title: "Select Plots",
                description:
                  "Choose your plots from an interactive grid. Pick as many as you want and see your investment calculated in real time.",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Earn Returns",
                description:
                  "Track your portfolio as crops grow. Receive returns from harvests and watch your agricultural investments flourish.",
              },
            ].map((item) => (
              <Card
                key={item.step}
                className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
              >
                <CardContent className="p-8">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-gray-100 group-hover:text-emerald-50 transition-colors">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors">
                    <item.icon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Farms */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
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
            {farms.map((farm) => (
              <FarmCard key={farm.id} {...farm} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild>
              <Link href="/marketplace">
                View All Farms
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Investoir */}
      <section className="py-20 md:py-28 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Investoir?
            </h2>
            <p className="text-lg text-emerald-100/80 max-w-2xl mx-auto">
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
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-emerald-100/70">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
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
                text: "Investoir opened up a whole new asset class for me. The returns from my coffee farm investments have consistently outperformed my expectations.",
              },
              {
                name: "Amina Osei",
                role: "Sustainable Investor",
                text: "I love that I can support sustainable farming while earning returns. The platform makes it incredibly easy to diversify across different crops and regions.",
              },
              {
                name: "Michael Chen",
                role: "First-time Investor",
                text: "As someone new to agricultural investing, the interactive plot selection and clear ROI projections made me feel confident in my first investment.",
              },
            ].map((testimonial) => (
              <Card key={testimonial.name} className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <Quote className="w-8 h-8 text-emerald-200 mb-4" />
                  <p className="text-gray-600 leading-relaxed mb-6">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-emerald-700">
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
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Bridging Agriculture{" "}
                <span className="text-emerald-600">& Finance</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Investoir was founded with a simple mission: make agricultural
                investment accessible to everyone. We believe that farmland is one
                of the most stable and rewarding investment classes, and it
                shouldn&apos;t be limited to those who can afford entire farms.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                By enabling fractional ownership of farmland, we&apos;re
                democratizing access to agricultural returns while providing
                farmers with the capital they need to grow their operations
                sustainably.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-bold text-emerald-600">
                    {stats.farms}+
                  </p>
                  <p className="text-sm text-gray-500">Verified Farms</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-600">8+</p>
                  <p className="text-sm text-gray-500">Countries</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-600">15%</p>
                  <p className="text-sm text-gray-500">Avg. ROI</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-600">100%</p>
                  <p className="text-sm text-gray-500">Transparent</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <Leaf className="w-24 h-24 text-emerald-600 mx-auto mb-4 opacity-50" />
                  <p className="text-emerald-700 font-medium text-lg">
                    Sustainable Investment
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-600 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Investing?
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of investors who are growing their wealth through
            agricultural investments. Create your account today and explore the
            marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/register">
                Create Free Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              asChild
            >
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

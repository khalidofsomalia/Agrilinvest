"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import {
  User,
  Mail,
  Calendar,
  Wallet,
  Shield,
  BarChart3,
  Check,
  Sprout,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
  createdAt: string;
  _count: {
    investments: number;
    transactions: number;
  };
}

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          setName(data.name);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-48 skeleton" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          <div className="h-64 bg-white rounded-2xl skeleton shadow-sm mb-6" />
          <div className="h-48 bg-white rounded-2xl skeleton shadow-sm" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="relative h-48 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-12">
        {/* Profile Header */}
        <Card className="mb-6 border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0">
                <span className="text-3xl font-bold text-white">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">{profile.email}</p>
                <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
                  <Badge className="rounded-lg px-3 py-1">
                    <Sprout className="w-3 h-3 mr-1" />
                    {profile.role === "INVESTOR" ? "Investor" : "Farmer"}
                  </Badge>
                  <Badge variant="outline" className="rounded-lg px-3 py-1">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: Wallet,
                  value: formatCurrency(profile.balance),
                  label: "Balance",
                  color: "from-emerald-50 to-teal-50",
                  iconColor: "text-emerald-600",
                },
                {
                  icon: BarChart3,
                  value: profile._count.investments.toString(),
                  label: "Investments",
                  color: "from-blue-50 to-indigo-50",
                  iconColor: "text-blue-600",
                },
                {
                  icon: Shield,
                  value: profile._count.transactions.toString(),
                  label: "Transactions",
                  color: "from-violet-50 to-purple-50",
                  iconColor: "text-violet-600",
                },
                {
                  icon: Calendar,
                  value: new Date(profile.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "short", year: "numeric" }
                  ),
                  label: "Joined",
                  color: "from-amber-50 to-orange-50",
                  iconColor: "text-amber-600",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-center`}
                >
                  <stat.icon
                    className={`w-5 h-5 ${stat.iconColor} mx-auto mb-2`}
                  />
                  <p className="text-lg font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 h-12 rounded-xl bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="pl-11 h-12 rounded-xl bg-gray-100 border-gray-200 text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-400">Email cannot be changed</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={saving || name === profile.name}
                className="rounded-xl h-11 px-6"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  Saved successfully
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

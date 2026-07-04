import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Trophy,
  Users,
  Zap,
  Shield,
  Gamepad2,
  Dumbbell,
  Sparkles,
  Loader2,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter"; 
import { loginStudent } from "@/lib/supabase";

export default function Home() {
  const [, setLocation] = useLocation(); 
  const [loading, setLoading] = useState(false);

  // Student Form Login State
  const [admissionNo, setAdmissionNo] = useState("");
  const [portalPassword, setPortalPassword] = useState("");

  const handlePortalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginStudent(admissionNo.trim(), portalPassword);
    if (result.success) {
      // Replaced alert box with professional route jump!
      setLocation(`/dashboard?admissionNo=${encodeURIComponent(admissionNo.trim())}`);
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/2348022228201", "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/10">
      
      {/* 1. STICKY NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-xs" role="navigation">
        <div className="container mx-auto flex items-center justify-between py-4 px-4 max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-md shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight leading-none text-primary mb-0.5">MOSH DAY SCHOOL</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Best Grooming</p>
            </div>
          </div>
          <Button onClick={handleWhatsApp} size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-xs px-4 py-2">
            Chat on WhatsApp
          </Button>
        </div>
      </nav>

      {/* MAIN SCREEN GRID MATCHING YOUR DESIGN BLUEPRINT */}
      <main className="container mx-auto px-4 py-6 max-w-md space-y-8">
        
        {/* 2. IMAGE TIMELINE LAYOUT */}
        <div className="space-y-6">
          <div className="relative pb-3">
            <div className="rounded-3xl overflow-hidden shadow-sm border border-border bg-card">
              <img 
                src="https://i.ibb.co/Vpr1683K/IMG-20260528-WA0094.jpg" 
                alt="Pupils studying together" 
                className="w-full h-56 object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-3 bg-white py-2.5 px-4 rounded-2xl shadow-xl border border-border flex items-center gap-3 max-w-[210px]">
              <div className="w-8 h-8 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-bold shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-foreground text-xs tracking-tight">Quality Education</h4>
                <p className="text-muted-foreground text-[10px] font-semibold mt-0.5">Since 2015</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-sm border border-border bg-card">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/classroom-activities-gnLbegz26EbmTaT7toqMFZ.webp" 
              alt="Classroom Activities" 
              className="w-full h-56 object-cover"
            />
          </div>
        </div>

        {/* 3. ABOUT CONTAINER SECTION */}
        <section id="about" className="bg-card rounded-3xl p-6 shadow-xs border border-border text-center">
          <h2 className="text-lg font-black text-primary uppercase tracking-wide">
            About Our School
          </h2>
          <div className="w-10 h-1 bg-primary/40 mx-auto rounded-full mt-1.5 mb-3.5"></div>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-sm mx-auto font-medium">
            Mosh Day School is a premier educational institution dedicated to cultivating a love for learning, critical thinking, and character building in every pupil from early childhood.
          </p>

          <div className="grid grid-cols-1 gap-3 mt-6 text-left">
            <div className="p-4 bg-muted/30 rounded-2xl border border-border/60">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Trophy className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-primary mb-0.5">Our Mission</h3>
              <p className="text-muted-foreground text-[11px] font-medium leading-relaxed">To provide a stimulating learning environment where children realize maximum potentials.</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-2xl border border-border/60">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-primary mb-0.5">Our Vision</h3>
              <p className="text-muted-foreground text-[11px] font-medium leading-relaxed">To be a foundational beacon of premium academic excellence and total child moral care.</p>
            </div>
          </div>
        </section>

        {/* 4. INTERACTIVE PORTAL ACCOUNT MANAGER */}
        <section id="portal-section" className="bg-white rounded-3xl shadow-xl border border-border overflow-hidden">
          <div className="p-6">
            <h3 className="text-base font-black text-primary text-center mb-0.5">
              Student Portal Login
            </h3>
            <p className="text-muted-foreground text-xs text-center mb-5 font-medium">
              Enter details to access performance results.
            </p>
            
            <form onSubmit={handlePortalSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Admission Number</label>
                <Input value={admissionNo} onChange={(e) => setAdmissionNo(e.target.value)} placeholder="e.g. MDS/2026/045" className="rounded-xl border-border text-xs py-2.5" required />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Portal Password</label>
                <Input type="password" value={portalPassword} onChange={(e) => setPortalPassword(e.target.value)} placeholder="••••••••" className="rounded-xl border-border text-xs py-2.5" required />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-xs py-4 shadow-sm flex justify-center items-center">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login to Portal"}
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-dashed border-border text-center">
              <a href="/admin" className="inline-flex items-center gap-1 text-[10px] font-black tracking-wider uppercase text-muted-foreground hover:text-primary transition">
                <Lock className="w-3 h-3" /> Authorized Staff Administration Gate &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* 5. EXPANDED FEATURES GRID */}
        <section id="why-us" className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-black text-primary uppercase tracking-wide">Why Choose Us?</h2>
            <div className="w-10 h-1 bg-primary/40 mx-auto rounded-full mt-1.5"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Users className="w-4 h-4 text-primary" />, title: "Qualified Teachers", desc: "Devoted instructors committed to character building." },
              { icon: <Zap className="w-4 h-4 text-primary" />, title: "ICT Learning", desc: "Early introduction to basic interactive digital tools." },
              { icon: <Trophy className="w-4 h-4 text-primary" />, title: "Chess Training", desc: "Strategic exercises designed to boost critical thinking." },
              { icon: <Shield className="w-4 h-4 text-primary" />, title: "Safe Environment", desc: "Secured structural setups built for total peace of mind." },
              { icon: <Dumbbell className="w-4 h-4 text-primary" />, title: "Sports Activities", desc: "Healthy physical games supporting absolute coordination." },
              { icon: <Sparkles className="w-4 h-4 text-primary" />, title: "Modern Methods", desc: "Using a standard structured custom curriculum safely." },
              { icon: <Gamepad2 className="w-4 h-4 text-primary" />, title: "Playground", desc: "Equipped recreational spaces for fun social development." },
              { icon: <BookOpen className="w-4 h-4 text-primary" />, title: "Moral Grooming", desc: "Deep core foundational focus on discipline and high integrity." }
            ].map((item, idx) => (
              <Card key={idx} className="p-4 text-center border border-border shadow-xs rounded-2xl bg-card flex flex-col items-center justify-center min-h-[125px]">
                <div className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center mb-2 shrink-0">
                  {item.icon}
                </div>
                <h4 className="font-bold text-foreground text-xs mb-0.5 tracking-tight">{item.title}</h4>
                <p className="text-muted-foreground text-[10px] leading-tight font-medium">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

      </main>

      {/* 6. FOOTER */}
      <footer className="bg-primary text-white/70 py-6 px-4 text-center text-[11px] border-t border-border mt-12">
        <p className="font-bold text-white tracking-wide">MOSH DAY SCHOOL — "Best Grooming"</p>
        <p className="mt-1 opacity-75">&copy; 2026 All Rights Reserved.</p>
      </footer>

    </div>
  );
}

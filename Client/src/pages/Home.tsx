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
  ChevronRight,
  MessageCircle,
  Upload,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
// Import our Supabase client and connection helpers
import { supabase, loginStudent } from "@/lib/supabase";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  
  // Toggle between Student Login mode and Admin Registration mode
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form Fields State
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [portalPassword, setPortalPassword] = useState("");
  const [term, setTerm] = useState("Third Term");
  const [parentPhone, setParentPhone] = useState("");
  const [studentImageUrl, setStudentImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Image Upload Logic to Public Cloud
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        const directUrl = data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
        setStudentImageUrl(directUrl); 
        alert("Image uploaded to cloud successfully! 🚀");
      } else {
        alert("Upload failed. Try a smaller file size.");
      }
    } catch (error) {
      console.error("Upload error details:", error);
      alert("Network error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  // Handle Form Actions (Login vs Registration)
  const handlePortalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLoginMode) {
      // --- LOGIN LOGIC ---
      const result = await loginStudent(admissionNo, portalPassword);
      if (result.success) {
        alert(`Welcome back, ${result.student.full_name}! 🎉\nClass: ${result.student.class}\nTerm: ${result.student.term}`);
        console.log("Logged in student profile:", result.student);
      } else {
        alert(result.error);
      }
    } else {
      // --- REGISTRATION LOGIC (Inserts straight to Supabase) ---
      try {
        const { data, error } = await supabase
          .from("students")
          .insert([
            {
              admission_no: admissionNo,
              full_name: studentName,
              class: studentClass,
              term: term,
              parent_phone: parentPhone,
              portal_password: portalPassword,
              student_image_url: studentImageUrl // Linked the uploaded cloud image
            },
          ])
          .select();

        if (error) throw error;

        alert(`Successfully registered profile for ${studentName}! 🚀`);
        
        // Reset fields
        setStudentName("");
        setStudentClass("");
        setAdmissionNo("");
        setPortalPassword("");
        setParentPhone("");
        setStudentImageUrl("");
        setIsLoginMode(true); // Flip back to login mode
      } catch (err: any) {
        console.error("Supabase Save Error:", err);
        alert(err.message || "Failed to save profile record to database.");
      }
    }
    setLoading(false);
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/2348022228201", "_blank");
  };

  const handleApply = () => {
    const section = document.getElementById("portal-section");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background font-sans text-slate-800 antialiased">
      
      {/* 1. STICKY NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm" role="navigation" aria-label="Main navigation">
        <div className="container flex items-center justify-between py-4 px-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-black text-primary tracking-tight leading-none mb-0.5">MOSH DAY SCHOOL</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Best Grooming</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition">About</a>
            <a href="#why-us" className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition">Why Choose Us</a>
            <a href="#portal-section" className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition">Portal Access</a>
          </div>
          <Button onClick={handleWhatsApp} size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-sm text-xs px-4 py-2">
            Chat on WhatsApp
          </Button>
        </div>
      </nav>

      {/* 2. HERO IMAGE SHOWCASES (Beautifully Placed Overlays) */}
      <section className="pt-8 px-4 max-w-xl mx-auto space-y-6">
        {/* Card 1: Primary Image with Floating Badge */}
        <div className="relative pb-4">
          <div className="rounded-3xl overflow-hidden shadow-md border border-slate-100 bg-white">
            <img 
              src="https://i.ibb.co/Vpr1683K/IMG-20260528-WA0094.jpg" 
              alt="Happy children learning at Mosh Day School" 
              className="w-full h-56 object-cover"
            />
          </div>
          {/* Floating Quality Education Badge */}
          <div className="absolute bottom-0 left-3 bg-white py-2.5 px-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 max-w-[220px]">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs tracking-tight">Quality Education</h4>
              <p className="text-muted-foreground text-[10px] font-semibold">Since 2015</p>
            </div>
          </div>
        </div>

        {/* Card 2: Secondary Chess Learning Activity Image */}
        <div className="rounded-3xl overflow-hidden shadow-md border border-slate-100 bg-white">
          <img 
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/classroom-activities-gnLbegz26EbmTaT7toqMFZ.webp" 
            alt="Chess Training and Classroom Activities" 
            className="w-full h-56 object-cover"
          />
        </div>
      </section>

      {/* 3. ABOUT OUR SCHOOL SECTION */}
      <section id="about" className="py-12 px-4 max-w-4xl mx-auto mt-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 text-center">
          <h2 className="text-xl font-black text-primary uppercase tracking-wide">
            About Our School
          </h2>
          <div className="w-10 h-1 bg-amber-500 mx-auto rounded-full mt-2 mb-4"></div>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-medium">
            Mosh Day School is a premier educational institution dedicated to cultivating a love for learning, critical thinking, and character building in every pupil from early childhood.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mt-8 text-left">
            <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
                <Trophy className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-primary mb-1">Our Mission</h3>
              <p className="text-muted-foreground text-[11px] font-medium leading-relaxed">To provide a stimulating learning environment where children realize maximum potentials.</p>
            </div>
            <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-primary mb-1">Our Vision</h3>
              <p className="text-muted-foreground text-[11px] font-medium leading-relaxed">To be a foundational beacon of premium academic excellence and total child moral care.</p>
            </div>
            <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 mb-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-primary mb-1">Core Values</h3>
              <p className="text-muted-foreground text-[11px] font-medium leading-relaxed">Academic Excellence, Deep Moral Integrity, Diligent Innovation, Discipline.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE PORTAL SECTION */}
      <section id="portal-section" className="py-12 px-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid md:grid-cols-12 max-w-3xl mx-auto">
          
          {/* Left Column info badge */}
          <div className="md:col-span-5 bg-gradient-to-br from-primary to-primary/80 text-white p-8 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full">
                MDS Portal v2.0
              </span>
              <h2 className="text-xl font-bold mt-4 mb-2">Secure Gateway</h2>
              <p className="text-xs text-blue-100 leading-relaxed font-medium">
                Setup database profile fields seamlessly. Manage scores, report card entries, and check student dashboard data pipelines.
              </p>
            </div>
            <div className="mt-8 space-y-2 text-[11px] text-blue-100/90 font-semibold">
              <div className="flex items-center gap-2">✔ High Performance Realtime Schema</div>
              <div className="flex items-center gap-2">✔ Row-Level Security Enforced</div>
            </div>
          </div>

          {/* Right Column Fields */}
          <div className="md:col-span-7 p-6 sm:p-8">
            <h3 className="text-xl font-black text-primary text-center mb-0.5">
              {isLoginMode ? "Student Portal Login" : "Pupil Profile Registration"}
            </h3>
            <p className="text-muted-foreground text-xs text-center mb-6 font-medium">
              {isLoginMode ? "Enter details to access performance results." : "Setup backend database profiles seamlessly."}
            </p>
            
            <form onSubmit={handlePortalSubmit} className="space-y-4">
              {!isLoginMode && (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 block">Pupil Full Name</label>
                    <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="e.g. Chidi Adebayo" className="rounded-xl border-slate-200 text-xs py-2.5" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 block">Class Assignment</label>
                      <Input value={studentClass} onChange={(e) => setStudentClass(e.target.value)} placeholder="Primary 3 Gold" className="rounded-xl border-slate-200 text-xs py-2.5" required />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 block">Active Term</label>
                      <select value={term} onChange={(e) => setTerm(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium focus:outline-none">
                        <option>First Term</option>
                        <option>Second Term</option>
                        <option>Third Term</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 block">Parent Phone Number</label>
                    <Input value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="e.g. 0802222..." className="rounded-xl border-slate-200 text-xs py-2.5" required />
                  </div>
                </>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 block">Admission Number</label>
                <Input value={admissionNo} onChange={(e) => setAdmissionNo(e.target.value)} placeholder="e.g. MDS/2026/045" className="rounded-xl border-slate-200 text-xs py-2.5" required />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 block">Portal Password</label>
                <Input type="password" value={portalPassword} onChange={(e) => setPortalPassword(e.target.value)} placeholder="••••••••" className="rounded-xl border-slate-200 text-xs py-2.5" required />
              </div>

              {!isLoginMode && (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/50 relative transition-all">
                  {uploading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  ) : studentImageUrl ? (
                    <p className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                      Image Linked Successfully ✅
                    </p>
                  ) : (
                    <div className="text-center cursor-pointer py-1">
                      <Upload className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                      <p className="text-xs text-primary font-bold">Add Student Image</p>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  )}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-xs py-5 shadow mt-2 flex justify-center items-center">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isLoginMode ? "Login to Portal" : "Save Record"}
              </Button>
            </form>

            <div className="mt-5 text-center">
              <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-xs font-bold text-primary hover:underline transition">
                {isLoginMode ? "Switch to Admin: Register Pupil" : "Return to Student Portal Login"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US GRID (ALL 8 BEAUTIFUL SHADCN CARDS) */}
      <section id="why-us" className="py-12 px-4 max-w-4xl mx-auto space

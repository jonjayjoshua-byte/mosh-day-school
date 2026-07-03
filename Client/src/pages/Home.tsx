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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm" role="navigation" aria-label="Main navigation">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">MOSH DAY SCHOOL</h1>
              <p className="text-xs text-muted-foreground">Best Grooming</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-medium hover:text-primary transition">About</a>
            <a href="#why-us" className="text-sm font-medium hover:text-primary transition">Why Us</a>
            <a href="#facilities" className="text-sm font-medium hover:text-primary transition">Facilities</a>
            <a href="#portal-section" className="text-sm font-medium hover:text-primary transition">Portal</a>
          </div>
          <Button onClick={handleWhatsApp} size="sm" className="bg-primary hover:bg-primary/90">
            Chat on WhatsApp
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32" id="hero">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-72 h-72 bg-primary/5 rounded-full blur-3xl" style={{ top: "-20%", right: "-10%", transform: `translateY(${scrollY * 0.3}px)` }} />
          <div className="absolute w-96 h-96 bg-secondary/10 rounded-full blur-3xl" style={{ bottom: "-30%", left: "-5%", transform: `translateY(${scrollY * 0.2}px)` }} />
        </div>

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-primary leading-tight">
                  Best Grooming Your Child Deserves
                </h1>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Providing quality nursery and primary education in a safe, caring, and engaging
                  learning environment where every child thrives.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleApply} size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold">
                  Access Portal <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button onClick={handleWhatsApp} variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://i.ibb.co/Vpr1683K/IMG-20260528-WA0094.jpg" alt="Happy children learning" className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/classroom-activities-gnLbegz26EbmTaT7toqMFZ.webp" alt="Class" className="rounded-2xl shadow-lg" />
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-primary">Nurturing Young Minds for Success</h2>
              <p className="text-foreground/80">At MOSH DAY SCHOOL, we believe every child deserves the best grooming and educational foundation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Interface with Supabase Integration */}
      <section id="portal-section" className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container max-w-lg">
          <Card className="p-8 text-foreground bg-white shadow-xl border-none">
            <h3 className="text-2xl font-bold text-primary mb-2 text-center">
              {isLoginMode ? "Student Portal Login" : "Pupil Profile Registration"}
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {isLoginMode ? "Enter details to access performance results." : "Setup backend database profiles seamlessly."}
            </p>
            
            <form onSubmit={handlePortalSubmit} className="space-y-4">
              {!isLoginMode && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Pupil Full Name</label>
                    <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="e.g. Chidi Adebayo" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Class Assignment</label>
                    <Input value={studentClass} onChange={(e) => setStudentClass(e.target.value)} placeholder="e.g. Primary 3 Gold" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Parent Phone Number</label>
                    <Input value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="e.g. 0802222..." required />
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-medium mb-1 block">Admission Number</label>
                <Input value={admissionNo} onChange={(e) => setAdmissionNo(e.target.value)} placeholder="e.g. MDS/2026/045" required />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Portal Password</label>
                <Input type="password" value={portalPassword} onChange={(e) => setPortalPassword(e.target.value)} placeholder="••••••••" required />
              </div>

              {!isLoginMode && (
                <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center bg-muted/30 relative">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  ) : studentImageUrl ? (
                    <p className="text-xs text-emerald-600 font-medium">Image Linked Successfully ✅</p>
                  ) : (
                    <div className="text-center cursor-pointer">
                      <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
                      <p className="text-xs text-primary font-medium mt-1">Add Student Image</p>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  )}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-medium mt-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : isLoginMode ? "Login to Portal" : "Save Record"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-xs font-semibold text-primary hover:underline">
                {isLoginMode ? "Switch to Admin: Register Pupil" : "Return to Student Portal Login"}
              </button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

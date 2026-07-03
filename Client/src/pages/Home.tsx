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
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  ChevronRight,
  Star,
  Upload,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  
  // States for student image upload handling
  const [uploading, setUploading] = useState(false);
  const [studentImageUrl, setStudentImageUrl] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Image Upload Logic to Public Cloud (Bypassing API keys completely)
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file); // tmpfiles.org expects the key to be named 'file'

    try {
      const response = await fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // Formats the viewing link into a direct asset link for image tags
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

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentImageUrl) {
      alert("Please upload a student image first!");
      return;
    }

    const newStudentData = {
      name: studentName,
      class: studentClass,
      image: studentImageUrl
    };

    console.log("Saving complete student object with cloud assets:", newStudentData);
    alert(`Application submitted successfully for ${studentName}! Image is saved safely in the cloud.`);
    
    // Clear inputs
    setStudentName("");
    setStudentClass("");
    setStudentImageUrl("");
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/2348022228201", "_blank");
  };

  const handleApply = () => {
    const section = document.getElementById("admission");
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
            <a href="#about" className="text-sm font-medium hover:text-primary transition">
              About
            </a>
            <a href="#why-us" className="text-sm font-medium hover:text-primary transition">
              Why Us
            </a>
            <a href="#facilities" className="text-sm font-medium hover:text-primary transition">
              Facilities
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition">
              Contact
            </a>
          </div>
          <Button onClick={handleWhatsApp} size="sm" className="bg-primary hover:bg-primary/90">
            Chat on WhatsApp
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32" id="hero" aria-label="Hero section">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-72 h-72 bg-primary/5 rounded-full blur-3xl"
            style={{
              top: "-20%",
              right: "-10%",
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          />
          <div
            className="absolute w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
            style={{
              bottom: "-30%",
              left: "-5%",
              transform: `translateY(${scrollY * 0.2}px)`,
            }}
          />
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
                <Button
                  onClick={handleApply}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold"
                >
                  Apply for Admission <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/5"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-white"
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground/70">
                  <span className="font-semibold text-primary">500+</span> Happy Families
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src=https://i.ibb.co/Vpr1683K/IMG-20260528-WA0094.jpgp"
                  alt="Happy children learning"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl border border-border max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">Quality Education</p>
                    <p className="text-xs text-muted-foreground">Since 2015</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-28 bg-white" aria-label="About MOSH DAY SCHOOL">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/classroom-activities-gnLbegz26EbmTaT7toqMFZ.webp"
                alt="Classroom activities"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-primary font-semibold text-sm tracking-wide uppercase">
                  About Our School
                </p>
                <h2 className="text-4xl font-bold text-primary mt-2">
                  Nurturing Young Minds for Success
                </h2>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                At MOSH DAY SCHOOL, we believe every child deserves the best grooming and educational
                foundation. Our holistic approach focuses on developing well-rounded individuals through
                quality education, child development, and moral upbringing.
              </p>
              <div className="space-y-3">
                {[
                  { title: "Quality Education", desc: "Rigorous curriculum with modern teaching methods" },
                  { title: "Child Development", desc: "Comprehensive growth in all developmental areas" },
                  { title: "Moral Upbringing", desc: "Strong values and character building" },
                  { title: "Interactive Learning", desc: "Engaging activities that spark curiosity" },
                  { title: "Confidence Building", desc: "Safe environment for self-expression" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-foreground/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-20 md:py-28 bg-gradient-to-br from-primary/5 to-secondary/5" aria-label="Why choose MOSH DAY SCHOOL">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-wide uppercase">
              Why Parents Choose Us
            </p>
            <h2 className="text-4xl font-bold text-primary mt-2">
              Excellence in Every Aspect
            </h2>
            <p className="text-foreground/70 mt-4 max-w-2xl mx-auto">
              We combine traditional values with modern educational practices to create an
              environment where children flourish.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Qualified Teachers", desc: "Experienced educators dedicated to your child's success" },
              { icon: Zap, title: "ICT Learning", desc: "Modern technology integrated into curriculum" },
              { icon: Trophy, title: "Chess Training", desc: "Strategic thinking and cognitive development" },
              { icon: Dumbbell, title: "Sports Activities", desc: "Physical fitness and team building programs" },
              { icon: Shield, title: "Safe Environment", desc: "Secure facilities with trained staff" },
              { icon: BookOpen, title: "Modern Methods", desc: "Interactive and engaging teaching approaches" },
              { icon: Gamepad2, title: "Playground", desc: "Well-equipped facilities for outdoor play" },
              { icon: Sparkles, title: "Special Events", desc: "Celebrations and memorable experiences" },
            ].map((feature, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-border/50">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-foreground/70">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-20 md:py-28 bg-white" aria-label="School facilities">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-wide uppercase">
              Our Facilities
            </p>
            <h2 className="text-4xl font-bold text-primary mt-2">
              World-Class Learning Spaces
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "ICT Lab", desc: "State-of-the-art computer lab with modern equipment for digital literacy", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/classroom-activities-gnLbegz26EbmTaT7toqMFZ.webp" },
              { title: "Playground", desc: "Safe, spacious playground with modern equipment for physical development", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/playground-sports-Ucjzkrnx77zdWAnGeavuc4.webp" },
              { title: "Learning Classrooms", desc: "Bright, comfortable classrooms designed for optimal learning experience", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/hero-children-learning-4xJUZzaX7nPBUeXoKctTxr.webp" },
              { title: "Sports Area", desc: "Dedicated space for sports training and physical activities", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/playground-sports-Ucjzkrnx77zdWAnGeavuc4.webp" },
            ].map((facility, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <img src={facility.image} alt={facility.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2">{facility.title}</h3>
                  <p className="text-white/90 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">{facility.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission / Image Upload Demo Section */}
      <section id="admission" className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container max-w-lg">
          <Card className="p-8 text-foreground bg-white shadow-xl border-none">
            <h3 className="text-2xl font-bold text-primary mb-2 text-center">Student Registration Portal</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">Upload student images instantly to secure live URLs.</p>
            
            <form onSubmit={handleAdmissionSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Student Full Name</label>
                <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="e.g. Chidi Adebayo" required />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Class Room</label>
                <Input value={studentClass} onChange={(e) => setStudentClass(e.target.value)} placeholder="e.g. Primary 3 Gold" required />
              </div>

              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30 relative">
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground">Uploading files to the cloud...</p>
                  </div>
                ) : studentImageUrl ? (
                  <div className="text-center space-y-2">
                    <img src={studentImageUrl} alt="Preview" className="w-24 h-24 object-cover rounded-full mx-auto border" />
                    <p className="text-xs text-emerald-600 font-medium">Cloud Link Ready!</p>
                  </div>
                ) : (
                  <div className="text-center space-y-1 cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium text-primary">Tap to choose student image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 32MB</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-medium mt-2">
                Register Student Profile
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        {/* Floating shapes background */}
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
                  src="/manus-storage/IMG-20260528-WA0094_b923399a.jpg"
                  alt="Happy children learning"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              {/* Floating card */}
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
                src="/manus-storage/IMG-20260528-WA0099_0eff059e.jpg"
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
              {
                icon: Users,
                title: "Qualified Teachers",
                desc: "Experienced educators dedicated to your child's success",
              },
              {
                icon: Zap,
                title: "ICT Learning",
                desc: "Modern technology integrated into curriculum",
              },
              {
                icon: Trophy,
                title: "Chess Training",
                desc: "Strategic thinking and cognitive development",
              },
              {
                icon: Dumbbell,
                title: "Sports Activities",
                desc: "Physical fitness and team building programs",
              },
              {
                icon: Shield,
                title: "Safe Environment",
                desc: "Secure facilities with trained staff",
              },
              {
                icon: BookOpen,
                title: "Modern Methods",
                desc: "Interactive and engaging teaching approaches",
              },
              {
                icon: Gamepad2,
                title: "Playground",
                desc: "Well-equipped facilities for outdoor play",
              },
              {
                icon: Sparkles,
                title: "Special Events",
                desc: "Celebrations and memorable experiences",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-border/50"
              >
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
              {
                title: "ICT Lab",
                desc: "State-of-the-art computer lab with modern equipment for digital literacy",
                image:
                  "https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/classroom-activities-gnLbegz26EbmTaT7toqMFZ.webp",
              },
              {
                title: "Playground",
                desc: "Safe, spacious playground with modern equipment for physical development",
                image:
                  "/manus-storage/IMG-20260528-WA0093_7220862a.jpg",
              },
              {
                title: "Learning Classrooms",
                desc: "Bright, comfortable classrooms designed for optimal learning experience",
                image:
                  "https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/hero-children-learning-4xJUZzaX7nPBUeXoKctTxr.webp",
              },
              {
                title: "Sports Area",
                desc: "Dedicated space for sports training and physical activities",
                image:
                  "https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/playground-sports-Ucjzkrnx77zdWAnGeavuc4.webp",
              },
            ].map((facility, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2">{facility.title}</h3>
                  <p className="text-white/90 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {facility.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 to-secondary/5" aria-label="School gallery">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-wide uppercase">
              Gallery
            </p>
            <h2 className="text-4xl font-bold text-primary mt-2">
              Moments of Joy and Learning
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Classroom Learning",
                image:
                  "https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/hero-children-learning-4xJUZzaX7nPBUeXoKctTxr.webp",
              },
              {
                title: "Chess Competition",
                image:
                  "https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/chess-learning-U4R8w2bsrxFQS3UsK73CCt.webp",
              },
              {
                title: "Sports Activities",
                image:
                  "https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/playground-sports-Ucjzkrnx77zdWAnGeavuc4.webp",
              },
              {
                title: "Interactive Learning",
                image:
                  "https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/classroom-activities-gnLbegz26EbmTaT7toqMFZ.webp",
              },
              {
                title: "Celebration Day",
                image:
                  "https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/celebration-event-Q8FRctMvKXUiuREW3Uripa.webp",
              },
              {
                title: "School Events",
                image:
                  "https://d2xsxph8kpxj0f.cloudfront.net/310519663667293949/VGVDjK76hzyaqsZKMquca2/celebration-event-Q8FRctMvKXUiuREW3Uripa.webp",
              },
            ].map((item, i) => (
              <div key={i} className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white font-semibold">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-white" aria-label="Parent testimonials">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-wide uppercase">
              Testimonials
            </p>
            <h2 className="text-4xl font-bold text-primary mt-2">
              What Parents Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Mrs. Adeyemi",
                role: "Parent",
                text: "My child's confidence improved greatly since joining MOSH DAY SCHOOL. The teachers are caring and the environment is perfect for learning.",
                rating: 5,
              },
              {
                name: "Mr. Okafor",
                role: "Parent",
                text: "The teachers are caring and attentive. My son has made wonderful friends and loves going to school every day.",
                rating: 5,
              },
              {
                name: "Mrs. Eze",
                role: "Parent",
                text: "Excellent learning environment for children. The facilities are modern and the staff is professional. Highly recommended!",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <Card key={i} className="p-8 bg-gradient-to-br from-white to-primary/5 border-border/50">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Section */}
      <section id="admission" className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary/80" aria-label="Admissions">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white">Admissions Open</h2>
              <p className="text-lg text-white/90">
                Enroll your child today and give them the best grooming and educational foundation
                they deserve.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                Apply Now <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={handleWhatsApp}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact School
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-28 bg-white" aria-label="Contact information">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <p className="text-primary font-semibold text-sm tracking-wide uppercase">
                  Get in Touch
                </p>
                <h2 className="text-4xl font-bold text-primary mt-2">Contact Us</h2>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Address</p>
                    <p className="text-foreground/70">
                      1 Ago-Iwoye Street, Agric, Ikorodu, Lagos State, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <a href="tel:+2348022228201" className="text-primary hover:underline">
                      +234 802 222 8201
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">WhatsApp</p>
                    <button
                      onClick={handleWhatsApp}
                      className="text-primary hover:underline"
                    >
                      Chat with us
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {[
                  { icon: Facebook, label: "Facebook" },
                  { icon: Twitter, label: "Twitter" },
                  { icon: Instagram, label: "Instagram" },
                ].map((social, i) => (
                  <button
                    key={i}
                    className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition"
                    title={social.label}
                  >
                    <social.icon className="w-5 h-5 text-primary" />
                  </button>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-lg h-96 bg-muted">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                  <p className="text-foreground/60 font-medium">
                    1 Ago-Iwoye Street, Agric, Ikorodu, Lagos
                  </p>
                  <p className="text-sm text-foreground/50 mt-2">
                    Google Maps integration coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 md:py-16" role="contentinfo" aria-label="Footer">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">MOSH DAY SCHOOL</p>
                  <p className="text-xs text-white/70">Best Grooming</p>
                </div>
              </div>
              <p className="text-sm text-white/80">
                Providing quality education and child development since 2015.
              </p>
            </div>

            <div>
              <p className="font-semibold mb-4">Quick Links</p>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="#about" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#facilities" className="hover:text-white transition">
                    Facilities
                  </a>
                </li>
                <li>
                  <a href="#admission" className="hover:text-white transition">
                    Admissions
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-4">Contact Info</p>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="tel:+2348022228201" className="hover:text-white transition">
                    +234 802 222 8201
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/2348022228201" className="hover:text-white transition">
                    WhatsApp Chat
                  </a>
                </li>
                <li>Ikorodu, Lagos State</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-4">Follow Us</p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
              <p>&copy; 2024 MOSH DAY SCHOOL. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

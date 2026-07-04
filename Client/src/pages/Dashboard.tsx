import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BookOpen, 
  LogOut, 
  User, 
  Award, 
  CheckCircle,
  MessageSquare,
  Loader2
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [student, setStudent] = useState<any>(null);
  const [reportCard, setReportCard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    setLocation("/");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const admissionNo = params.get("admissionNo");

        if (!admissionNo) {
          setLocation("/");
          return;
        }

        // 1. Fetch Profile Data
        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("*")
          .eq("admission_no", admissionNo)
          .single();

        if (studentError) throw studentError;
        setStudent(studentData);

        // 2. Fetch Live Relational Grades Data
        const { data: gradesData, error: gradesError } = await supabase
          .from("grades")
          .select("*")
          .eq("admission_no", admissionNo)
          .order("subject", { ascending: true });

        if (gradesError) throw gradesError;
        setReportCard(gradesData || []);

      } catch (err) {
        console.error("Error loading dashboard data:", err);
        alert("Session expired or profile record not found.");
        setLocation("/");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-bold tracking-wide uppercase">Securing Profile Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 text-foreground antialiased selection:bg-primary/10">
      
      {/* 1. DASHBOARD HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-xs px-4 py-3.5">
        <div className="container mx-auto max-w-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-sm font-black tracking-tight text-primary uppercase">Portal</h1>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-destructive text-xs font-bold gap-1.5 px-2.5 rounded-xl h-8"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </Button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="container mx-auto px-4 py-6 max-w-md space-y-5">
        
        {/* 2. DYNAMIC STUDENT IDENTITY PROFILE CARD */}
        <Card className="p-4 rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/90 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
            <BookOpen className="w-40 h-40" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 overflow-hidden shrink-0 flex items-center justify-center">
              {student?.student_image_url ? (
                <img src={student.student_image_url} alt="Student avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-white/60" />
              )}
            </div>
            <div className="space-y-0.5 flex-1">
              <span className="text-[9px] uppercase tracking-widest text-white/70 font-bold bg-white/10 px-2 py-0.5 rounded-md">Verified Profile</span>
              <h2 className="text-base font-black tracking-tight leading-snug mt-1">{student?.full_name}</h2>
              <p className="text-[11px] text-white/80 font-medium">{student?.admission_no}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-white/10 text-center relative z-10">
            <div className="bg-white/5 rounded-xl py-1.5 px-2 border border-white/5">
              <p className="text-[9px] text-white/60 font-bold uppercase tracking-wider">Class</p>
              <p className="text-xs font-extrabold mt-0.5">{student?.class}</p>
            </div>
            <div className="bg-white/5 rounded-xl py-1.5 px-2 border border-white/5">
              <p className="text-[9px] text-white/60 font-bold uppercase tracking-wider">Active Term</p>
              <p className="text-xs font-extrabold mt-0.5">{student?.term}</p>
            </div>
          </div>
        </Card>

        {/* 3. LIVE PERFORMANCE CARD / REPORT CARD MATRICES */}
        <Card className="rounded-3xl border border-border shadow-xs bg-white overflow-hidden">
          <div className="px-4 pt-4 pb-2 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase text-primary tracking-wide">Academic Results</h3>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-100">Released</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-muted/40 border-b border-border/60">
                  <th className="py-2.5 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Subject</th>
                  <th className="py-2.5 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">CA</th>
                  <th className="py-2.5 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Exam</th>
                  <th className="py-2.5 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Tot</th>
                  <th className="py-2.5 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Grd</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs font-medium">
                {reportCard.length > 0 ? (
                  reportCard.map((row, idx) => {
                    const totalScore = (row.ca || 0) + (row.exam || 0);
                    return (
                      <tr key={idx} className="hover:bg-muted/10 transition-colors">
                        <td className="py-3 px-4 font-bold text-foreground max-w-[140px] truncate">{row.subject}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground font-semibold">{row.ca}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground font-semibold">{row.exam}</td>
                        <td className="py-3 px-2 text-center text-primary font-bold">{totalScore}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-block text-[10px] font-black w-6 h-6 leading-6 text-center rounded-lg ${
                            row.grade?.startsWith('A') 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {row.grade || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground font-bold tracking-wide uppercase">
                      No subject results uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 4. PERFORMANCE SUMMARY AND SIGN-OFF REMARKS */}
        <Card className="p-4 rounded-3xl border border-border shadow-xs bg-white space-y-3">
          <div className="flex items-center gap-2 border-b border-border/50 pb-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-black uppercase text-primary tracking-wide">Teacher's Remark</h3>
          </div>
          
          <div className="p-3 bg-muted/40 rounded-2xl border border-border/60">
            <p className="text-xs text-foreground/80 leading-relaxed font-medium">
              {reportCard.length > 0 
                ? `"${reportCard[0]?.remark || 'Keep up the brilliant momentum!'}"` 
                : '"Profile registered. Performance assessment matrix pending academic department configuration cycle."'}
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-[10px]">
              <div>
                <span className="font-bold block text-foreground">Mrs. F. Adegoke</span>
                <span className="text-muted-foreground font-semibold">Class Teacher Assessment</span>
              </div>
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
          </div>
        </Card>

      </main>

      {/* BRIEF DASHBOARD FOOTER */}
      <footer className="py-6 text-center text-[10px] text-muted-foreground font-medium">
        <p>Mosh Day School Portal Ecosystem &bull; &copy; 2026</p>
      </footer>

    </div>
  );
}

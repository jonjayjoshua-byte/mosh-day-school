import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BookOpen, 
  LogOut, 
  User, 
  Award, 
  CheckCircle,
  MessageSquare,
  Loader2,
  Printer
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

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const rawAdmissionNo = params.get("admissionNo");

        if (!rawAdmissionNo) {
          setLocation("/");
          return;
        }

        const admissionNo = decodeURIComponent(rawAdmissionNo);

        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("*")
          .ilike("admission_no", admissionNo)
          .single();

        if (studentError) throw studentError;
        setStudent(studentData);

        const { data: gradesData, error: gradesError } = await supabase
          .from("grades")
          .select("*")
          .ilike("admission_no", admissionNo)
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
    <div className="min-h-screen bg-muted/30 text-foreground antialiased selection:bg-primary/10 print:bg-white">
      
      {/* APP HEADER - HIDDEN ON PRINT */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-xs px-4 py-3.5 no-print">
        <div className="container mx-auto max-w-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-sm font-black tracking-tight text-primary uppercase">Portal</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <Button 
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="text-primary border-primary/20 hover:bg-primary/5 text-xs font-bold gap-1.5 px-2.5 rounded-xl h-8"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Report
            </Button>
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
        </div>
      </header>

      {/* --- PRESTIGIOUS PRINT ONLY HEADER --- */}
      <div className="print-only-header hidden text-center space-y-1 pt-6 mb-8 border-b-4 border-double border-primary pb-4">
        <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-primary tracking-tight uppercase leading-none">MOSH DAY SCHOOL</h1>
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Nursery &amp; Primary Education &bull; "Best Grooming"</p>
        <div className="pt-3">
          <span className="bg-primary/5 border border-primary/20 text-primary font-black px-4 py-1 text-xs rounded-full uppercase tracking-wider">
            Official Academic Evaluation Terminal Report
          </span>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="container mx-auto px-4 py-6 max-w-md space-y-5 print-container">
        
        {/* STUDENT METADATA SECTION */}
        <Card className="p-5 rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/90 text-white shadow-md relative overflow-hidden print-flat-profile">
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 no-print">
            <BookOpen className="w-40 h-40" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 overflow-hidden shrink-0 flex items-center justify-center print-avatar">
              {student?.student_image_url ? (
                <img src={student.student_image_url} alt="Student avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-white/60 print:text-slate-400" />
              )}
            </div>
            <div className="space-y-0.5 flex-1">
              <span className="text-[9px] uppercase tracking-widest text-white/70 font-bold bg-white/10 px-2 py-0.5 rounded-md no-print">Verified Profile</span>
              <h2 className="text-base font-black tracking-tight leading-snug mt-1 print:text-black">{student?.full_name}</h2>
              <p className="text-[11px] text-white/80 font-medium print:text-slate-600 font-mono">{student?.admission_no}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-white/10 text-center relative z-10 print:mt-4 print:pt-4 print:border-slate-200">
            <div className="bg-white/5 rounded-xl py-1.5 px-2 border border-white/5 print-box">
              <p className="text-[9px] text-white/60 font-bold uppercase tracking-wider print:text-slate-500">Class</p>
              <p className="text-xs font-extrabold mt-0.5 print:text-black">{student?.class}</p>
            </div>
            <div className="bg-white/5 rounded-xl py-1.5 px-2 border border-white/5 print-box">
              <p className="text-[9px] text-white/60 font-bold uppercase tracking-wider print:text-slate-500">Active Term</p>
              <p className="text-xs font-extrabold mt-0.5 print:text-black">{student?.term}</p>
            </div>
          </div>
        </Card>

        {/* RESULTS TABLE */}
        <Card className="rounded-3xl border border-border shadow-xs bg-white overflow-hidden print-table-card">
          <div className="px-4 pt-4 pb-2 border-b border-border/50 flex items-center justify-between no-print">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase text-primary tracking-wide">Academic Results</h3>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-100">Released</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left print:text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border/60 print:bg-slate-100 print:border-slate-300">
                  <th className="py-2.5 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider print:text-black print:font-black">Subject</th>
                  <th className="py-2.5 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center print:text-black print:font-black">CA (40)</th>
                  <th className="py-2.5 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center print:text-black print:font-black">Exam (60)</th>
                  <th className="py-2.5 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center print:text-black print:font-black">Total (100)</th>
                  <th className="py-2.5 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right print:text-black print:font-black">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs font-medium print:divide-slate-200">
                {reportCard.length > 0 ? (
                  reportCard.map((row, idx) => {
                    const totalScore = (row.ca || 0) + (row.exam || 0);
                    return (
                      <tr key={idx} className="hover:bg-muted/10 transition-colors print:hover:bg-transparent">
                        <td className="py-3 px-4 font-bold text-foreground print:text-black max-w-[140px] truncate">{row.subject}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground font-semibold print:text-slate-700">{row.ca}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground font-semibold print:text-slate-700">{row.exam}</td>
                        <td className="py-3 px-2 text-center text-primary font-black print:text-black">{totalScore}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-block text-[10px] font-black w-6 h-6 leading-6 text-center rounded-lg ${
                            row.grade?.startsWith('A') 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 print:bg-transparent print:text-emerald-700 print:border-none' 
                              : 'bg-amber-50 text-amber-600 border border-amber-100 print:bg-transparent print:text-amber-700 print:border-none'
                          } print:text-xs print:font-black`}>
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

        {/* TEACHER REMARK SECTION */}
        <Card className="p-4 rounded-3xl border border-border shadow-xs bg-white space-y-3 print:border-slate-200 print:p-0 print:shadow-none">
          <div className="flex items-center gap-2 border-b border-border/50 pb-2 no-print">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-black uppercase text-primary tracking-wide">Teacher's Remark</h3>
          </div>
          
          <div className="p-3 bg-muted/40 rounded-2xl border border-border/60 print:bg-transparent print:border-none print:p-2">
            <p className="text-xs text-foreground/80 italic font-medium print:text-black print:text-xs">
              {reportCard.length > 0 
                ? `"${reportCard[0]?.remark || 'Keep up the brilliant momentum!'}"` 
                : '"Profile registered. Performance assessment matrix pending academic department configuration cycle."'}
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-[10px] no-print">
              <div>
                <span className="font-bold block text-foreground">Mrs. F. Adegoke</span>
                <span className="text-muted-foreground font-semibold">Class Teacher Assessment</span>
              </div>
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
          </div>
        </Card>

        {/* --- BRAND NEW OFFICIAL SIGNATURE SIGNOFF STRIP FOR PRINT ONLY --- */}
        <div className="print-signoff hidden pt-12 grid grid-cols-2 gap-12 text-center text-xs font-bold text-black">
          <div className="space-y-8">
            <div className="border-b border-black w-40 mx-auto h-6"></div>
            <p className="uppercase text-[10px] tracking-wider text-slate-700">Mrs. F. Adegoke <br/><span className="text-[9px] font-medium text-slate-500 lowercase">Class Teacher</span></p>
          </div>
          <div className="space-y-8">
            <div className="border-b border-black w-40 mx-auto h-6"></div>
            <p className="uppercase text-[10px] tracking-wider text-slate-700">School Principal <br/><span className="text-[9px] font-medium text-slate-500 lowercase">Sign &amp; Stamp Seal</span></p>
          </div>
        </div>

      </main>

      {/* DASHBOARD FOOTER */}
      <footer className="py-6 text-center text-[10px] text-muted-foreground font-medium print:mt-16 print:border-t print:border-slate-200 print:text-slate-500">
        <p>Mosh Day School Portal Ecosystem &bull; &copy; 2026 All Rights Reserved.</p>
      </footer>

      {/* ENHANCED CSS INJECTION ENGINE */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .print-only-header {
            display: block !important;
          }
          .print-signoff {
            display: grid !important;
          }
          .print-container {
            max-w-4xl !important;
            width: 100% !important;
            padding: 0 2rem !important;
            margin: 0 auto !important;
          }
          .print-flat-profile {
            background: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            border-radius: 12px !important;
            padding: 1rem !important;
          }
          .print-avatar {
            border: 1px solid #cbd5e1 !important;
            background: #f8fafc !important;
          }
          .print-box {
            background: #f1f5f9 !important;
            border: 1px solid #cbd5e1 !important;
            color: #000000 !important;
          }
          .print-table-card {
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            border-radius: 12px !important;
          }
          th, td {
            border-bottom: 1px solid #cbd5e1 !important;
            padding: 0.75rem 1rem !important;
          }
        }
      `}} />

    </div>
  );
}

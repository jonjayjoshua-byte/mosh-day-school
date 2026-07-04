import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Plus, Award, Loader2, RefreshCw, Lock, Trash2, KeyRound, Save, X } from "lucide-react";

interface Student {
  admission_no: string;
  full_name: string;
  class: string;
  portal_password?: string;
  student_password?: string;
  parent_phone?: string;
  term?: string;
}

interface GradeRow {
  subject: string;
  ca: string;
  exam: string;
  grade: string;
}

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("All");

  // Global Term State
  const [activeTerm, setActiveTerm] = useState<string>("Third Term");

  // Registration states
  const [fullName, setFullName] = useState<string>("");
  const [admissionNo, setAdmissionNo] = useState<string>("");
  const [className, setClassName] = useState<string>("");
  const [parentPhone, setParentPhone] = useState<string>("");
  const [studentPassword, setStudentPassword] = useState<string>("");

  // Grade states
  const [selectedAdmNo, setSelectedAdmNo] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");
  const [overallRemark, setOverallRemark] = useState<string>("");
  const [gradeRows, setGradeRows] = useState<GradeRow[]>([{ subject: "", ca: "", exam: "", grade: "" }]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("students").select("*").order("full_name", { ascending: true });
      if (error) throw error;
      setStudents((data as Student[]) || []);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("settings").select("value").eq("key", "active_term").single();
      if (error) throw error;
      if (data) setActiveTerm(data.value);
    } catch (err) {
      console.error("Error loading active term settings:", err);
    }
  };

  useEffect(() => { 
    if (isAuthenticated) {
      fetchStudents(); 
      fetchSettings();
    }
  }, [isAuthenticated]);

  const calculateGrade = (ca: string, exam: string): string => {
    const total = (parseInt(ca) || 0) + (parseInt(exam) || 0);
    if (total >= 70) return "A";
    if (total >= 60) return "B";
    if (total >= 50) return "C";
    if (total >= 40) return "D";
    return "F";
  };

  const addRow = () => {
    setGradeRows([...gradeRows, { subject: "", ca: "", exam: "", grade: "" }]);
  };
  
  const removeRow = (index: number) => {
    const updated = gradeRows.filter((_, i) => i !== index);
    setGradeRows(updated);
  };
  
  const updateRow = (index: number, field: keyof GradeRow, value: string) => {
    const updated = [...gradeRows];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    
    if (field === "ca" || field === "exam") {
      updated[index].grade = calculateGrade(updated[index].ca, updated[index].exam);
    }
    
    setGradeRows(updated);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "moshadmin2026") {
      setIsAuthenticated(true);
    } else { 
      alert("Invalid Passkey!"); 
      setAdminPassword(""); 
    }
  };

  const handleUpdateTerm = async (newTerm: string) => {
    try {
      const { error } = await supabase.from("settings").update({ value: newTerm }).eq("key", "active_term");
      if (error) throw error;
      setActiveTerm(newTerm);
      alert(`Global active term updated to ${newTerm}`);
    } catch (err: any) {
      alert(`Error updating term: ${err.message}`);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("students").insert([{ 
        full_name: fullName.trim(), 
        admission_no: admissionNo.trim(), 
        class: className.trim(), 
        term: activeTerm, 
        parent_phone: parentPhone.trim(), 
        portal_password: studentPassword.trim(), 
        student_password: studentPassword.trim() 
      }]);
      
      if (error) throw error;
      
      alert("Student Registered!");
      setFullName(""); 
      setAdmissionNo(""); 
      setClassName(""); 
      setParentPhone(""); 
      setStudentPassword("");
      fetchStudents();
    } catch (err: any) { 
      alert(err.message); 
    }
  };

  const handleClearGrades = async (admNo: string) => {
    if (confirm("Are you sure you want to clear all published results for this student?")) {
      const { error } = await supabase.from("grades").delete().eq("admission_no", admNo);
      if (error) alert(error.message);
      else alert("Results cleared successfully!");
    }
  };

  const handlePublishAll = async () => {
    if (!selectedAdmNo || !teacherName) {
      return alert("Select student and enter teacher name!");
    }
    
    await supabase.from("grades").delete().eq("admission_no", selectedAdmNo);
    
    const payload = gradeRows.filter(r => r.subject !== "").map(r => ({
      admission_no: selectedAdmNo, 
      subject: r.subject, 
      ca: parseInt(r.ca) || 0,
      exam: parseInt(r.exam) || 0, 
      grade: r.grade.toUpperCase(),
      remark: overallRemark,
      teacher_name: teacherName
    }));
    
    const { error } = await supabase.from("grades").insert(payload);
    
    if (error) {
      alert(error.message);
    } else { 
      alert("Published successfully!"); 
      setGradeRows([{ subject: "", ca: "", exam: "", grade: "" }]);
      setOverallRemark("");
    }
  };

  const handleResetPassword = async (admNo: string, name: string) => {
    const newPassword = prompt(`New password for ${name}:`);
    if (newPassword) {
      await supabase.from("students").update({ 
        portal_password: newPassword, 
        student_password: newPassword 
      }).eq("admission_no", admNo);
      fetchStudents();
    }
  };

  const handleDeleteStudent = async (admNo: string) => {
    if (confirm("Delete student and all their data?")) {
      await supabase.from("grades").delete().eq("admission_no", admNo);
      await supabase.from("students").delete().eq("admission_no", admNo);
      fetchStudents();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-6 rounded-3xl text-center">
          <Lock className="w-10 h-10 mx-auto text-primary mb-4" />
          <Input 
            type="password" 
            value={adminPassword} 
            onChange={e => setAdminPassword(e.target.value)} 
            placeholder="Admin Passkey" 
            className="mb-3" 
          />
          <Button onClick={handleAdminLogin} className="w-full">Unlock Panel</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center pb-4 border-b">
          <h1 className="text-xl font-black text-primary uppercase">Admin Portal</h1>
          <Button onClick={fetchStudents} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" /> Reload
          </Button>
        </header>

        {/* Global Term Management Panel */}
        <Card className="p-5 rounded-3xl border bg-white shadow-sm">
          <h2 className="text-xs font-black uppercase text-primary mb-3">Global Active Calendar Control</h2>
          <div className="grid grid-cols-3 gap-2">
            {["First Term", "Second Term", "Third Term"].map((term) => (
              <Button 
                key={term}
                variant={activeTerm === term ? "default" : "outline"}
                onClick={() => handleUpdateTerm(term)}
                className="text-xs font-bold rounded-xl py-2"
              >
                {term}
              </Button>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Register Student Section */}
          <Card className="p-5 rounded-3xl border bg-white space-y-4">
            <h2 className="text-xs font-black uppercase text-primary border-b pb-2">Register Student</h2>
            <form onSubmit={handleCreateStudent} className="space-y-3">
              <Input placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
              <Input placeholder="Admission No" value={admissionNo} onChange={e => setAdmissionNo(e.target.value)} />
              <Input placeholder="Class" value={className} onChange={e => setClassName(e.target.value)} />
              <Input placeholder="Parent Phone" value={parentPhone} onChange={e => setParentPhone(e.target.value)} />
              <Input placeholder="Set Password" value={studentPassword} onChange={e => setStudentPassword(e.target.value)} />
              <div className="p-3 bg-muted/30 border border-dashed rounded-xl text-[11px] font-semibold text-muted-foreground">
                Automatic Assigned Cycle: <span className="text-primary font-black uppercase">{activeTerm}</span>
              </div>
              <Button type="submit" className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Student</Button>
            </form>
          </Card>

          {/* Bulk Subject Upload Section */}
          <Card className="p-5 rounded-3xl border bg-white space-y-4">
            <h2 className="text-xs font-black uppercase text-primary border-b pb-2 flex items-center gap-2">
              <Award className="w-4 h-4" /> Bulk Subject Upload
            </h2>
            <select value={selectedAdmNo} onChange={e => setSelectedAdmNo(e.target.value)} className="w-full border rounded-xl p-2 text-xs">
              <option value="">-- Select Student --</option>
              {students.map((s: Student) => (
                <option key={s.admission_no} value={s.admission_no}>
                  {s.full_name}
                </option>
              ))}
            </select>
            <Input placeholder="Teacher Name" value={teacherName} onChange={e => setTeacherName(e.target.value)} />
            <Input placeholder="Overall Teacher Remark" value={overallRemark} onChange={e => setOverallRemark(e.target.value)} />
            
            <div className="space-y-2">
              {gradeRows.map((row, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="grid grid-cols-4 gap-2 flex-grow">
                    <Input placeholder="Subj" value={row.subject} onChange={e => updateRow(i, "subject", e.target.value)} className="text-[10px]" />
                    <Input placeholder="CA" value={row.ca} onChange={e => updateRow(i, "ca", e.target.value)} className="text-[10px]" />
                    <Input placeholder="Ex" value={row.exam} onChange={e => updateRow(i, "exam", e.target.value)} className="text-[10px]" />
                    <Input placeholder="Gr" value={row.grade} readOnly className="text-[10px] bg-muted/30" />
                  </div>
                  <Button onClick={() => removeRow(i)} variant="ghost" size="sm" className="text-red-500 p-2">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addRow} variant="outline" size="sm" className="w-full text-xs">+ Add Subject Row</Button>
            </div>
            <Button onClick={handlePublishAll} className="w-full bg-emerald-600 text-white">
              <Save className="w-4 h-4 mr-2" /> Publish All Subjects
            </Button>
          </Card>
        </div>

        {/* System Directory Section */}
        <Card className="p-5 rounded-3xl border bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
            <h2 className="text-xs font-black uppercase text-primary">System Directory</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <Input 
                placeholder="Search name/adm..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="text-xs"
              />
              <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="border rounded-xl px-3 text-xs bg-white">
                <option value="All">All Classes</option>
                <option value="Kindergarten">Kindergarten</option>
                <option value="Nursery 1">Nursery 1</option>
                <option value="Nursery 2">Nursery 2</option>
                <option value="Primary 1">Primary 1</option>
                <option value="Primary 2">Primary 2</option>
                <option value="Primary 3">Primary 3</option>
                <option value="Primary 4">Primary 4</option>
                <option value="Primary 5">Primary 5</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin w-6 h-6 text-primary" />
            </div>
          ) : (
            <div className="divide-y text-xs">
              {students
                .filter((s: Student) => 
                  (classFilter === "All" || s.class === classFilter) &&
                  ((s.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                   (s.admission_no || "").toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((s: Student) => (
                  <div key={s.admission_no} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold">{s.full_name}</p>
                      <p className="text-[10px] text-muted-foreground">{s.admission_no} • {s.class} • Pass: {s.portal_password || ""}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button onClick={() => handleClearGrades(s.admission_no)} size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4 text-orange-500" />
                      </Button>
                      <Button onClick={() => handleResetPassword(s.admission_no, s.full_name || "")} size="sm" variant="ghost">
                        <KeyRound className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button onClick={() => handleDeleteStudent(s.admission_no)} size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

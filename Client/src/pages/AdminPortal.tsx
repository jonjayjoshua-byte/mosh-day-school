import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Plus, User, Award, Loader2, RefreshCw, Lock, Trash2 } from "lucide-react";

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [fullName, setFullName] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [className, setClassName] = useState("");
  const [term, setTerm] = useState("Third Term");
  const [parentPhone, setParentPhone] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  const [selectedAdmNo, setSelectedAdmNo] = useState("");
  const [subject, setSubject] = useState("");
  const [caScore, setCaScore] = useState("");
  const [examScore, setExamScore] = useState("");
  const [grade, setGrade] = useState("");
  const [teacherRemark, setTeacherRemark] = useState("");
  const [teacherName, setTeacherName] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("students").select("*").order("full_name", { ascending: true });
      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchStudents();
  }, [isAuthenticated]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "moshadmin2026") setIsAuthenticated(true);
    else { alert("Invalid Admin Gateway Passkey!"); setAdminPassword(""); }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !admissionNo || !className || !parentPhone || !studentPassword) {
      return alert("Fill all fields, including Phone and Student Password!");
    }
    try {
      const { error } = await supabase.from("students").insert([{ 
        full_name: fullName.trim(), 
        admission_no: admissionNo.trim(), 
        class: className.trim(), 
        term, 
        parent_phone: parentPhone.trim(), 
        student_password: studentPassword.trim() 
      }]);
      if (error) throw error;
      alert("Student Registered successfully!");
      setFullName(""); setAdmissionNo(""); setClassName(""); setParentPhone(""); setStudentPassword("");
      fetchStudents();
    } catch (err: any) { alert(err.message); }
  };

  const handleUploadGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmNo || !subject || !caScore || !examScore || !grade || !teacherRemark || !teacherName) {
      return alert("Fill all fields!");
    }
    try {
      const { error } = await supabase.from("grades").insert([{
        admission_no: selectedAdmNo.trim(), subject: subject.trim(), ca: parseInt(caScore),
        exam: parseInt(examScore), grade: grade.trim().toUpperCase(), remark: teacherRemark.trim(), teacher_name: teacherName.trim()
      }]);
      if (error) throw error;
      alert("Grade added successfully!");
      setSubject(""); setCaScore(""); setExamScore(""); setGrade(""); setTeacherRemark("");
    } catch (err: any) { alert(err.message); }
  };

  const handleClearScores = async (admNo: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await supabase.from("grades").delete().eq("admission_no", admNo.trim());
      alert("Scores wiped!");
      await fetchStudents();
    } catch (err: any) { alert(err.message); }
  };

  const handlePromoteOrChange = async (admNo: string, currentClass: string, currentTerm: string) => {
    const newClass = prompt("Enter new Class:", currentClass);
    const newTerm = prompt("Enter new Term:", currentTerm);
    if (newClass === null && newTerm === null) return;
    try {
      const updates: any = {};
      if (newClass?.trim()) updates.class = newClass.trim();
      if (newTerm?.trim()) updates.term = newTerm.trim();
      await supabase.from("students").update(updates).eq("admission_no", admNo.trim());
      alert("Updated!");
      await fetchStudents();
    } catch (err: any) { alert(err.message); }
  };

  const handleDeleteStudent = async (admNo: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      await supabase.from("grades").delete().eq("admission_no", admNo.trim());
      await supabase.from("students").delete().eq("admission_no", admNo.trim());
      alert("Deleted!");
      await fetchStudents();
    } catch (err: any) { alert(err.message); }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 rounded-3xl border bg-white shadow-sm text-center">
          <h1 className="text-lg font-black text-primary mb-5 uppercase">Admin Gate Lock</h1>
          <form onSubmit={handleAdminLogin} className="space-y-3">
            <Input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Password" />
            <Button type="submit" className="w-full">Unlock</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b pb-4">
          <h1 className="text-xl font-black text-primary uppercase">Mosh Day School</h1>
          <Button onClick={fetchStudents} size="sm"><RefreshCw className="w-4 h-4 mr-2" /> Reload</Button>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-5 rounded-3xl border bg-white space-y-4">
            <h2 className="text-xs font-black uppercase text-primary border-b pb-2">Register Student</h2>
            <form onSubmit={handleCreateStudent} className="space-y-3">
              <Input placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
              <Input placeholder="Admission No" value={admissionNo} onChange={e => setAdmissionNo(e.target.value)} />
              <Input placeholder="Class" value={className} onChange={e => setClassName(e.target.value)} />
              <Input placeholder="Parent Phone" value={parentPhone} onChange={e => setParentPhone(e.target.value)} />
              <Input placeholder="Set Student Password" value={studentPassword} onChange={e => setStudentPassword(e.target.value)} />
              <Button type="submit" className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Student</Button>
            </form>
          </Card>

          <Card className="p-5 rounded-3xl border bg-white space-y-4">
            <h2 className="text-xs font-black uppercase text-primary border-b pb-2">Upload Scores</h2>
            <form onSubmit={handleUploadGrade} className="space-y-3">
              <select value={selectedAdmNo} onChange={e => setSelectedAdmNo(e.target.value)} className="w-full border rounded-xl p-2 text-xs">
                <option value="">-- Select Student --</option>
                {students.map(s => <option key={s.admission_no} value={s.admission_no}>{s.full_name}</option>)}
              </select>
              <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="CA" value={caScore} onChange={e => setCaScore(e.target.value)} />
                <Input placeholder="Exam" value={examScore} onChange={e => setExamScore(e.target.value)} />
                <Input placeholder="Grade" value={grade} onChange={e => setGrade(e.target.value)} />
              </div>
              <Input placeholder="Teacher Name" value={teacherName} onChange={e => setTeacherName(e.target.value)} />
              <Input placeholder="Remark" value={teacherRemark} onChange={e => setTeacherRemark(e.target.value)} />
              <Button type="submit" className="w-full">Publish</Button>
            </form>
          </Card>
        </div>

        <Card className="p-5 rounded-3xl border bg-white">
          <h2 className="text-xs font-black uppercase text-primary mb-3">System Directory</h2>
          {loading ? <Loader2 className="animate-spin mx-auto" /> : (
            <div className="divide-y text-xs">
              {students.map(s => (
                <div key={s.admission_no} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold">{s.full_name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.admission_no} • {s.class}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button onClick={() => handlePromoteOrChange(s.admission_no, s.class, s.term)} size="sm" variant="outline">Edit</Button>
                    <Button onClick={() => handleDeleteStudent(s.admission_no, s.full_name)} size="sm" variant="destructive"><Trash2 className="w-3 h-3" /></Button>
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

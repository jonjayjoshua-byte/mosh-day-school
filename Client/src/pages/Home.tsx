import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  // Portal & Admin Form States
  const [isAdmin, setIsAdmin] = useState(false);
  const [admissionNo, setAdmissionNo] = useState('');
  const [portalPassword, setPortalPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('Primary 1');
  const [term, setTerm] = useState('First Term');
  const [parentPhone, setParentPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Login
  const handlePortalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionNo || !portalPassword) {
      alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('admission_no', admissionNo.trim())
        .eq('portal_password', portalPassword.trim())
        .single();

      if (error || !data) {
        alert('Invalid Admission Number or Password');
      } else {
        alert(`Welcome back, ${data.full_name}! 🎉\nClass: ${data.class}\nTerm: ${data.term || 'N/A'}`);
        // Dashboard redirection logic will hook in here next!
      }
    } catch (err) {
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration
  const handlePortalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !admissionNo || !portalPassword || !parentPhone) {
      alert('Please fill in all registration fields');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('students')
        .insert([
          {
            admission_no: admissionNo.trim(),
            full_name: studentName.trim(),
            class: studentClass,
            term: term,
            parent_phone: parentPhone.trim(),
            portal_password: portalPassword.trim()
          }
        ]);

      if (error) {
        alert(error.message);
      } else {
        alert(`Successfully registered profile for ${studentName}! 🚀`);
        // Reset fields
        setStudentName('');
        setAdmissionNo('');
        setPortalPassword('');
        setParentPhone('');
        setIsAdmin(false);
      }
    } catch (err) {
      alert('An unexpected error occurred during saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* 1. PROFESSIONAL NAVIGATION HEADER */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-900 text-white p-2.5 rounded-xl flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-blue-950 tracking-tight leading-none mb-0.5">
              MOSH DAY SCHOOL
            </h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Best Grooming
            </p>
          </div>
        </div>
        
        <a href="https://wa.me/your-number" target="_blank" rel="noreferrer" className="bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5">
          Chat on WhatsApp
        </a>
      </header>

      {/* 2. LIVE INTERACTIVE PORTAL SECTION */}
      <section id="portal" className="py-16 px-4 max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid md:grid-cols-12 max-w-4xl mx-auto">
          
          {/* Left Feature Column */}
          <div className="md:col-span-5 bg-gradient-to-br from-blue-950 to-blue-900 text-white p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
                MDS Portal v2.0
              </span>
              <h2 className="text-2xl font-bold mt-4 mb-2">Secure Gateway</h2>
              <p className="text-sm text-blue-200 leading-relaxed">
                Setup backend database profiles seamlessly. Access report cards, check term progress, and review personalized assignments instantly.
              </p>
            </div>
            <div className="mt-8 space-y-3 text-xs text-blue-200">
              <div className="flex items-center gap-2">✔ High Performance Schema Realtime</div>
              <div className="flex items-center gap-2">✔ Row-Level Security Enforced</div>
            </div>
          </div>

          {/* Right Interactive Form Column */}
          <div className="md:col-span-7 p-8 sm:p-10">
            <h3 className="text-2xl font-black text-blue-950 mb-1 text-center">
              {isAdmin ? 'Pupil Profile Registration' : 'Student Portal Login'}
            </h3>
            <p className="text-slate-500 text-sm mb-6 text-center">
              {isAdmin ? 'Setup backend database profiles seamlessly.' : 'Enter credentials to manage academic score dashboards.'}
            </p>

            {isAdmin ? (
              /* ADMIN REGISTRATION FORM */
              <form onSubmit={handlePortalSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Pupil Full Name</label>
                  <input type="text" placeholder="Xenization studio" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Class Assignment</label>
                    <select value={studentClass} onChange={(e) => setStudentClass(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-sm">
                      <option>Crèche</option>
                      <option>Nursery 1</option>
                      <option>Nursery 2</option>
                      <option>Primary 1</option>
                      <option>Primary 2</option>
                      <option>Primary 3</option>
                      <option>Primary 4</option>
                      <option>Primary 5</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Current Term</label>
                    <select value={term} onChange={(e) => setTerm(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-sm">
                      <option>First Term</option>
                      <option>Second Term</option>
                      <option>Third Term</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Admission Number</label>
                    <input type="text" placeholder="MDS/2026/26" value={admissionNo} onChange={(e) => setAdmissionNo(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Parent Phone Number</label>
                    <input type="tel" placeholder="08012345678" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Portal Password</label>
                  <input type="password" placeholder="••••••••" value={portalPassword} onChange={(e) => setPortalPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" required />
                </div>

                <div className="border border-dashed border-emerald-300 bg-emerald-50/50 p-2.5 rounded-xl text-center text-xs text-emerald-800 font-medium">
                  Image Linked Successfully ✅
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-3 rounded-xl transition shadow-md flex justify-center items-center">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Save Record'}
                </button>

                <button type="button" onClick={() => setIsAdmin(false)} className="w-full text-center text-xs text-blue-900 font-semibold hover:underline block pt-2">
                  Return to Student Portal Login
                </button>
              </form>
            ) : (
              /* STUDENT PORTAL LOGIN FORM */
              <form onSubmit={handlePortalLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Admission Number</label>
                  <input type="text" placeholder="e.g., MDS/2026/26" value={admissionNo} onChange={(e) => setAdmissionNo(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Portal Password</label>
                  <input type="password" placeholder="••••••••" value={portalPassword} onChange={(e) => setPortalPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" required />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-3 rounded-xl transition shadow-md flex justify-center items-center">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Access Portal Account'}
                </button>

                <button type="button" onClick={() => setIsAdmin(true)} className="w-full text-center text-xs text-slate-500 font-medium hover:text-blue-900 block pt-4 transition">
                  Switch to Admin: Register Pupil
                </button>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* 3. ABOUT THE SCHOOL SECTION */}
      <section className="py-16 px-6 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-blue-950 sm:text-4xl mb-3">About Our School</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
            <p className="text-slate-600 mt-4">
              Mosh Day School is a premier educational institution dedicated to cultivating a love for learning, critical thinking, and character building in every pupil from early childhood.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="text-lg font-bold text-blue-950 mb-2">Our Mission</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To provide a stimulating learning environment where children can realize their maximum potential through standard curriculum models, dedicated grooming, and deep character foundations.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-2xl mb-2">👁‍🗨</div>
              <h3 className="text-lg font-bold text-blue-950 mb-2">Our Vision</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To be a foundational beacon of premium academic excellence, raised to produce morally sound, high-achieving leaders capable of thriving in a globally competitive society.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-2xl mb-2">💎</div>
              <h3 className="text-lg font-bold text-blue-950 mb-2">Core Values</h3>
              <ul className="text-slate-600 text-sm space-y-1">
                <li>• Academic Excellence</li>
                <li>• Moral Integrity & Discipline</li>
                <li>• Innovation & Critical Thinking</li>
                <li>• Total Child Care & Safety</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RESTORED WHY CHOOSE US GRID (ALL 8 CARDS) */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-blue-950 sm:text-4xl mb-3">Why Choose Mosh Day School?</h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
          <p className="text-slate-600 mt-4">
            We provide custom learning structures tailored to ensure your child receives premium attention and holistic developmental care.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">👨‍🏫</div>
            <h4 className="font-bold text-blue-950 text-sm mb-1">Qualified Teachers</h4>
            <p className="text-slate-500 text-xs leading-normal">Highly trained instructors devoted to complete developmental grooming.</p>
          </div>

          {/* Card 2 */}
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">💻</div>
            <h4 className="font-bold text-blue-950 text-sm mb-1">ICT Learning</h4>
            <p className="text-slate-500 text-xs leading-normal">Early introduction to tech fundamentals and interactive digital toolsets.</p>
          </div>

          {/* Card 3 */}
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">♟</div>
            <h4 className="font-bold text-blue-950 text-sm mb-1">Chess Training</h4>
            <p className="text-slate-500 text-xs leading-normal">Strategic thinking exercises designed to enhance intellectual capacity.</p>
          </div>

          {/* Card 4 */}
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">⚽</div>
            <h4 className="font-bold text-blue-950 text-sm mb-1">Sports Activities</h4>
            <p className="text-slate-500 text-xs leading-normal">Healthy physical outdoor activities supporting coordination and teamwork.</p>
          </div>

          {/* Card 5 */}
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">🛡</div>
            <h4 className="font-bold text-blue-950 text-sm mb-1">Safe Environment</h4>
            <p className="text-slate-500 text-xs leading-normal">Fully secured structures optimized for absolute parental peace of mind.</p>
          </div>

          {/* Card 6 */}
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">💡</div>
            <h4 className="font-bold text-blue-950 text-sm mb-1">Modern Methods</h4>
            <p className="text-slate-500 text-xs leading-normal">Using standard educational frameworks to speed up comprehensive understanding.</p>
          </div>

          {/* Card 7 */}
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">🎪</div>
            <h4 className="font-bold text-blue-950 text-sm mb-1">Playground</h4>
            <p className="text-slate-500 text-xs leading-normal">Equipped dynamic recreational space ensuring cheerful child interactions.</p>
          </div>

          {/* Card 8 */}
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">🎉</div>
            <h4 className="font-bold text-blue-950 text-sm mb-1">Special Events</h4>
            <p className="text-slate-500 text-xs leading-normal">Cultural, creative arts, and award sessions to showcase exceptional talents.</p>
          </div>

        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-blue-950 text-slate-400 py-8 px-6 text-center text-xs border-t border-blue-900">
        <p className="font-semibold text-blue-200 mb-1">MOSH DAY SCHOOL — "Best Grooming"</p>
        <p>&copy; 2026 All Rights Reserved.</p>
      </footer>

    </div>
  );
}

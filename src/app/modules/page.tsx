"use client";

import Link from "next/link";
import { ArrowLeft, Play, FileText, CheckCircle, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { getProgressData, UserProgressData } from "../../utils/progress";

export default function Modules() {
  const [data, setData] = useState<UserProgressData | null>(null);

  useEffect(() => {
    setData(getProgressData());
  }, []);

  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat modul...</div>;

  const mod1 = data.modules["dasar-asuransi"];
  const mod2 = data.modules["handling-objection"];
  const mod3 = data.modules["roleplay-premi"];

  const renderModuleLink = (mod: any, path: string, icon: any, title: string, desc: string) => {
    const isLocked = mod?.status === "locked";
    const isCompleted = mod?.status === "completed";

    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', opacity: isLocked ? 0.6 : 1, padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem', backgroundColor: isCompleted ? '#f8fafc' : 'var(--surface)' }}>
         <div style={{ padding: '1rem', backgroundColor: isLocked ? '#E5E7EB' : '#DEF7EC', borderRadius: '0.5rem', color: isLocked ? '#9CA3AF' : '#10B981' }}>
            {isLocked ? <Lock /> : icon}
         </div>
         <div style={{ flex: 1 }}>
            <h4 style={{ fontWeight: 600 }}>{title}</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{desc}</p>
            
            {isCompleted ? (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={14}/> Selesai (Skor: {mod.score})
                </span>
                <Link href={path} style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'underline' }}>Ulangi Modul</Link>
              </div>
            ) : isLocked ? (
              <span style={{ fontSize: '0.8rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem' }}>
                Selesaikan modul sebelumnya untuk membuka.
              </span>
            ) : (
              <Link href={path} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Mulai Pembelajaran
              </Link>
            )}
         </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem', minHeight: '100vh' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 500, marginBottom: '1rem' }}>
          <ArrowLeft size={20} /> Kembali ke Dashboard
        </Link>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Pusat Pelatihan Modul</h1>
        <p style={{ color: 'var(--text-muted)' }}>Materi disusun dari level pemula hingga lanjutan.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Beginner */}
        <section className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <h2>Level Dasar (Beginner)</h2>
            {mod1?.status === 'completed' ? (
              <div className="badge badge-success">Selesai</div>
            ) : (
              <div className="badge badge-warning">Progres Terbuka</div>
            )}
          </div>
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
            {renderModuleLink(mod1, "/training/dasar-asuransi", <FileText />, "1. Dasar-Dasar Asuransi Jiwa", "Materi bacaan PDF mengenai prinsip asuransi.")}
          </div>
        </section>

        {/* Intermediate */}
        <section className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <h2>Level Menengah (Intermediate)</h2>
            {mod3?.status === 'completed' ? (
              <div className="badge badge-success">Selesai</div>
            ) : mod2?.status !== 'locked' ? (
              <div className="badge badge-warning">Sedang Berjalan</div>
            ) : (
              <div className="badge" style={{ backgroundColor: '#E5E7EB', color: '#6B7280' }}>Terkunci</div>
            )}
          </div>
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
            {renderModuleLink(mod2, "/training/handling-objection", <Play />, "2. Teknik Handling Objection", "Video strategi menjawab keberatan.")}
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', border: '1px solid var(--primary)', borderRadius: '0.5rem', backgroundColor: mod3?.status === 'completed' ? '#f8fafc' : '#f0f9ff', opacity: mod3?.status === 'locked' ? 0.6 : 1 }}>
               <div style={{ padding: '1rem', backgroundColor: mod3?.status === 'locked' ? '#E5E7EB' : 'var(--primary)', color: mod3?.status === 'locked' ? '#9CA3AF' : 'white', borderRadius: '0.5rem' }}>
                  {mod3?.status === 'locked' ? <Lock /> : <Play />}
               </div>
               <div>
                  <h4 style={{ fontWeight: 600 }}>3. Latihan Roleplay AI: Premi Mahal</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Simulasi langsung dengan bot nasabah (Heygen).</p>
                  {mod3?.status === 'completed' ? (
                     <div style={{ marginTop: '0.5rem' }}>
                       <span style={{ fontSize: '0.8rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14}/> Selesai (Skor: {mod3.score})
                       </span>
                       <Link href="/roleplay" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'underline' }}>Latih Ulang Roleplay</Link>
                     </div>
                  ) : mod3?.status === 'locked' ? (
                     <span style={{ fontSize: '0.8rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem' }}>
                        Selesaikan Modul 2 untuk membuka.
                     </span>
                  ) : (
                     <Link href="/roleplay" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', marginTop: '0.5rem' }}>Mulai Roleplay AI</Link>
                  )}
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

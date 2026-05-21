"use client";

import Link from "next/link";
import styles from "./dashboard.module.css";
import { BookOpen, Trophy, Clock, Star, PlayCircle, CheckCircle, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { getProgressData, UserProgressData } from "../../utils/progress";

export default function Dashboard() {
  const [data, setData] = useState<UserProgressData | null>(null);

  useEffect(() => {
    setData(getProgressData());
  }, []);

  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat dashboard...</div>;

  const modArray = Object.values(data.modules);
  const completedCount = modArray.filter(m => m.status === 'completed').length;
  
  // Calculate average score if any
  const scoredMods = modArray.filter(m => m.score !== null);
  const avgScore = scoredMods.length > 0 ? Math.round(scoredMods.reduce((acc, curr) => acc + (curr.score || 0), 0) / scoredMods.length) : 0;

  const stats = [
    { label: "Modul Selesai", value: `${completedCount}/3`, icon: <BookOpen color="#10B981" />, bg: "#DEF7EC" },
    { label: "Level Saat Ini", value: completedCount === 3 ? "Advanced" : completedCount >= 1 ? "Intermediate" : "Beginner", icon: <Trophy color="#F59E0B" />, bg: "#FEF3C7" },
    { label: "Waktu Belajar", value: completedCount > 0 ? "2 Jam" : "0 Jam", icon: <Clock color="#3B82F6" />, bg: "#DBEAFE" },
    { label: "Skor Roleplay (Rata-rata)", value: scoredMods.length > 0 ? `${avgScore}/100` : "-", icon: <Star color="#8B5CF6" />, bg: "#EDE9FE" },
  ];

  const renderModuleCard = (modData: any, title: string, desc: string) => {
    const isLocked = modData?.status === 'locked';
    return (
      <div className={`card ${styles.moduleItem}`} style={{ opacity: isLocked ? 0.6 : 1 }}>
        <div>
          <div className={styles.moduleMeta}>
            <h4 className={styles.moduleTitle}>{title}</h4>
            {modData?.status === 'completed' && <span className="badge badge-success"><CheckCircle size={14} style={{marginRight: '4px'}}/> Selesai</span>}
            {modData?.status === 'in-progress' && <span className="badge badge-warning">Terbuka</span>}
            {isLocked && <span className="badge" style={{ backgroundColor: '#E5E7EB', color: '#6B7280' }}>Terkunci</span>}
          </div>
          <p className={styles.moduleDesc}>{desc}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${modData?.progress || 0}%`, backgroundColor: modData?.status === 'completed' ? '#10B981' : 'var(--primary)' }}></div>
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{modData?.progress || 0}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard Agen</h1>
          <p style={{ color: 'var(--text-muted)' }}>Selamat datang kembali, Budi Santoso. Lanjutkan progres belajarmu!</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/modules" className="btn btn-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
            <BookOpen size={20} /> Lihat Semua Modul
          </Link>
          <Link href="/roleplay" className="btn btn-primary">
            <PlayCircle size={20} /> Mulai Roleplay AI
          </Link>
        </div>
      </header>

      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div key={idx} className={`card ${styles.statCard}`}>
            <div className={styles.statIcon} style={{ backgroundColor: stat.bg }}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <h4>{stat.label}</h4>
              <p>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        <section>
          <div className={styles.sectionHeader}>
            <h3>Pembelajaran Anda</h3>
            <Link href="/modules" style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '0.875rem' }}>Buka Modul Center</Link>
          </div>
          <div className={styles.moduleList}>
            {renderModuleCard(data.modules["dasar-asuransi"], "1. Dasar-Dasar Asuransi Jiwa", "Memahami konsep perlindungan dasar.")}
            {renderModuleCard(data.modules["handling-objection"], "2. Teknik Handling Objection", "Video strategi menjawab keberatan umum nasabah.")}
            {renderModuleCard(data.modules["roleplay-premi"], "3. Simulasi Roleplay: Premi Mahal", "Latihan praktis langsung dengan avatar AI Heygen.")}
          </div>
        </section>

        <section>
          <div className={`card`} style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={20} color="var(--accent)" /> Leaderboard Nasional
            </h3>
            <div className={styles.leaderboardList}>
              {[
                { name: "Agus Pratama", score: "9,850" },
                { name: "Siti Rahmawati", score: "9,200" },
                { name: "Budi Santoso", score: "8,950" }, // Current User
                { name: "Diana Putri", score: "8,100" },
                { name: "Eko Prasetyo", score: "7,800" },
              ].map((user, idx) => (
                <div key={idx} className={styles.leaderboardItem} style={{ border: idx === 2 ? '2px solid var(--primary)' : 'none' }}>
                  <span className={styles.leaderboardRank}>{idx + 1}</span>
                  <span className={styles.leaderboardUser}>{user.name} {idx === 2 ? "(Anda)" : ""}</span>
                  <span className={styles.leaderboardScore}>{user.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Dashboard Footer */}
      <footer style={{ marginTop: '4rem', paddingTop: '2rem', paddingBottom: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '1.2rem' }}>API</div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ lineHeight: '1.1', fontWeight: 700, color: 'var(--text-main)' }}>Aksi Protect</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1' }}>Indonesia</span>
          </div>
        </div>
        
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
          Email: <a href="mailto:support@aksiprotect.com" style={{ color: 'var(--primary)', textDecoration: 'none' }}>support@aksiprotect.com</a>
        </div>

        <Link href="/" className="btn btn-outline" style={{ borderColor: 'var(--border)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Home size={16} /> Kembali ke Beranda
        </Link>
      </footer>
    </div>
  );
}

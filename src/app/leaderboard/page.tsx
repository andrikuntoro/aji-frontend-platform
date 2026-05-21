import Link from "next/link";
import { ArrowLeft, Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import styles from "./leaderboard.module.css";

export default function LeaderboardPage() {
  const leaderboardData = [
    { rank: 1, name: "Agus Pratama", company: "Prudential", points: "9,850", progress: "up" },
    { rank: 2, name: "Siti Rahmawati", company: "Allianz", points: "9,200", progress: "up" },
    { rank: 3, name: "Budi Santoso (Anda)", company: "Manulife", points: "8,950", progress: "same" },
    { rank: 4, name: "Diana Putri", company: "AIA", points: "8,100", progress: "down" },
    { rank: 5, name: "Eko Prasetyo", company: "Sequis Life", points: "7,800", progress: "up" },
    { rank: 6, name: "Maya Indriani", company: "FWD", points: "7,500", progress: "down" },
    { rank: 7, name: "Reza Mahendra", company: "Prudential", points: "7,100", progress: "up" },
    { rank: 8, name: "Kevin Sanjaya", company: "Allianz", points: "6,950", progress: "same" },
  ];

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <Link href="/#features" className="btn btn-outline" style={{ display: 'inline-flex', marginBottom: '2rem' }}>
          <ArrowLeft size={20} /> Kembali
        </Link>
        
        <div className={styles.leaderboardCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <Trophy size={40} color="var(--accent)" />
            <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>Leaderboard Aksi Protect Indonesia</h1>
          </div>

          <div className={styles.leaderboardWrapper}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Header Row */}
              <div className={`${styles.leaderboardGrid} ${styles.leaderboardHeader}`}>
                <div>Rank</div>
                <div>Nama Agen</div>
                <div>Perusahaan</div>
                <div style={{ textAlign: 'right' }}>Points</div>
                <div style={{ textAlign: 'center' }}>Status</div>
              </div>

              {/* Leaderboard Items */}
              {leaderboardData.map((user) => {
                const isCurrentUser = user.rank === 3;
                return (
                  <div 
                    key={user.rank} 
                    className={`${styles.leaderboardGrid} ${styles.leaderboardItem}`}
                    style={{ 
                      backgroundColor: isCurrentUser ? 'rgba(15, 76, 129, 0.05)' : 'var(--surface-alt)', 
                      border: isCurrentUser ? '2px solid var(--primary)' : '1px solid transparent',
                      boxShadow: isCurrentUser ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{user.rank}</div>
                    
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.name}
                    </div>
                    
                    <div style={{ color: 'var(--text-muted)' }}>
                      {user.company}
                    </div>
                    
                    <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent)', fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                      {user.points} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>pts</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {user.progress === 'up' && <TrendingUp size={20} color="var(--secondary)" />}
                      {user.progress === 'down' && <TrendingDown size={20} color="var(--error)" />}
                      {user.progress === 'same' && <Minus size={20} color="var(--text-muted)" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Share Buttons */}
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Bagikan pencapaian Anda ke kolega:</span>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#E1306C', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                Bagikan ke Instagram
              </button>
              <button className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0077b5', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                Bagikan ke LinkedIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

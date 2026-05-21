import { lazy } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { Mic, ShieldCheck, MessageSquare, Image as ImageIcon, FileText, CheckCircle2, TrendingUp, Trophy, Play, Award, Target, PieChart, FileBarChart } from "lucide-react";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>API</div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ lineHeight: '1.1' }}>Aksi Protect</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1' }}>Indonesia</span>
          </div>
        </div>
        <div className={styles.navLinks}>
          <Link href="#about" className={styles.navItem}>Tentang Kami</Link>
          <Link href="#features" className={styles.navItem}>Fitur</Link>
          <Link href="#pricing" className={styles.navItem}>Harga</Link>
          <Link href="/login" className="btn btn-outline" style={{ border: 'none', color: 'var(--text-main)', marginLeft: '1rem' }}>Masuk</Link>
          <Link href="/register" className="btn btn-primary">Daftar Sekarang</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <div className="badge badge-warning" style={{ marginBottom: '1.5rem', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1rem' }}>
              Platform Gabungan Agen Asuransi se-Indonesia
            </div>
            <h1 className={styles.heroTitle}>Tingkatkan Kapabilitas Menjual Anda Bersama Aksi Protect Indonesia</h1>
            <p className={styles.heroSubtitle}>
              Belajar, berbagi metode unggulan, dan berkompetisi di satu platform. Kami adalah pusat pelatihan interaktif yang dilengkapi dengan simulasi Roleplay AI untuk menjamin kesuksesan setiap agen asuransi di Indonesia.
            </p>
            <div className={styles.heroActions}>
              <Link href="/register" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Bergabung Gratis
              </Link>
              <Link href="#features" className="btn btn-outline" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
             <div className={styles.mockup}>
               <div className={styles.mockupHeader}>
                 <div className={styles.dots}><span></span><span></span><span></span></div>
                 <div className={styles.mockupTitle}>Sesi Roleplay Aktif - Bapak Budi</div>
               </div>
               <div className={styles.mockupContent}>
                 <div className={styles.videoPlaceholder} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")' }}>
                   <div className={styles.videoOverlay}>
                     <Play size={14} fill="currentColor" /> Live AI Video
                   </div>
                 </div>
                 <div className={styles.chatBubbleAi}>
                   "Wah, premi 1.5 juta per bulan itu masih terlalu mahal untuk saya. Lagipula saya merasa belum butuh asuransi saat ini, masih sehat terus kok."
                 </div>
                 <div className={styles.chatBubbleUser}>
                   <Mic className={styles.pulseMic} size={20} />
                   <span>"Baik Bapak Budi, saya... "</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* Partners Section */}
      <section className={styles.partnersBg}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Dipercaya oleh agen asuransi dari berbagai perusahaan ternama di Indonesia</h2>
          <div className={styles.partnerGrid}>
            <div className={styles.partnerLogo}>Prudential</div>
            <div className={styles.partnerLogo}>Allianz</div>
            <div className={styles.partnerLogo}>AIA</div>
            <div className={styles.partnerLogo}>Manulife</div>
            <div className={styles.partnerLogo}>Sequis Life</div>
            <div className={styles.partnerLogo}>FWD</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.section} style={{ backgroundColor: 'var(--surface)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <ShieldCheck size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
            <h2 className={styles.sectionTitle}>Apa itu Aksi Protect Indonesia?</h2>
            <p className={styles.sectionSubtitle} style={{ maxWidth: '800px', margin: '0 auto' }}>
              <b>Aksi Protect Indonesia</b> adalah platform interaktif dan komprehensif yang dirancang khusus untuk seluruh agen asuransi jiwa di Indonesia. Kami menyediakan wadah bagi agen untuk berkolaborasi, bertukar metode penjualan yang sukses, dan secara aktif berlatih menghadapi nasabah menggunakan teknologi <b>Simulasi AI (Roleplay)</b>. Tujuan kami jelas: meningkatkan kapabilitas Anda agar selalu siap di setiap kesempatan penjualan.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`${styles.section} ${styles.featuresBg}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Modul Pelatihan Interaktif AI</h2>
          <p className={styles.sectionSubtitle}>Elevasi performa penjualan Anda dengan bimbingan dan simulasi berbasis kecerdasan buatan yang komprehensif.</p>
          
          <div className={styles.featureGridCustom}>
            {/* Left Column for Hero Features */}
            <div className={styles.heroFeaturesCol}>
              {/* Feature 1 (Hero Feature) */}
              <div className={`${styles.featureCard} ${styles.featureCardHero}`}>
                <div className={styles.featureIcon} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <FileBarChart size={32} color="white" />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>Laporan & Penilaian yang Dapat Disesuaikan</h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '1.5rem', flex: 1, fontSize: '1.1rem' }}>
                  Kurangi waktu adaptasi dengan umpan balik instan. Gunakan template bawaan atau buat parameter penilaian Anda sendiri (customizable report) untuk mengevaluasi agen pada keterampilan yang mendorong performa penjualan.
                </p>
                <Link href="/dashboard" style={{ color: 'var(--accent)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  Sesuaikan Laporan Anda &rarr;
                </Link>
              </div>

              {/* Feature 2 (Hero Feature) */}
              <div className={`${styles.featureCard} ${styles.featureCardHero}`}>
                <div className={styles.featureIcon} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <Mic size={32} color="white" />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>Simulasi Nasabah Super Realistis</h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '1.5rem', flex: 1, fontSize: '1.1rem' }}>
                  Berlatih dengan skenario yang didasarkan pada produk nyata, profil nasabah, dan penolakan di lapangan, sehingga tim Anda siap saat menghadapi situasi sebenarnya secara langsung.
                </p>
                <Link href="/roleplay" style={{ color: 'var(--accent)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  Coba Simulasi Interaktif &rarr;
                </Link>
              </div>
            </div>

            {/* Right Column for Regular Features */}
            <div className={styles.regularFeaturesCol}>
              {/* Feature 3 */}
              <div className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <MessageSquare size={32} color="var(--secondary)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Bimbingan Real-time</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1 }}>
                  Tingkatkan konversi tim Anda di berbagai alur kerja dengan panduan real-time yang memberikan saran kontekstual dan personal, tepat pada saat paling dibutuhkan.
                </p>
                <Link href="/roleplay" style={{ color: 'var(--secondary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  Mulai Bimbingan &rarr;
                </Link>
              </div>

              {/* Feature 4 */}
              <div className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                  <Target size={32} color="var(--accent)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Skenario Khusus Realita Lapangan</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1 }}>
                  Baik saat menutup kesepakatan atau menyelesaikan masalah, setiap skenario mencerminkan alur kerja nyata Anda, memastikan agen tampil dengan kejelasan dan konsistensi.
                </p>
                <Link href="/modules" style={{ color: 'var(--accent)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  Jelajahi Skenario &rarr;
                </Link>
              </div>

              {/* Feature 5 */}
              <div className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ backgroundColor: 'rgba(15, 76, 129, 0.1)' }}>
                  <PieChart size={32} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Pelatihan Tertarget Berbasis Data</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1 }}>
                  Ganti pelatihan generik dengan wawasan yang menyoroti kebutuhan individu. Lacak kemajuan, temukan celah, dan sesuaikan bimbingan yang memberikan hasil nyata.
                </p>
                <Link href="/dashboard" style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  Cek Data Performa &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`${styles.section} ${styles.pricingBg}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Investasi untuk Kemampuan Anda</h2>
          <p className={styles.sectionSubtitle}>Mulai gratis, tingkatkan kapabilitas dengan Roleplay Premium secara fleksibel.</p>
          
          <div className={styles.pricingGrid}>
            {/* Free Tier */}
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Daftar Gratis</h3>
                <div className={styles.pricingPrice}>Rp 0</div>
                <p style={{ color: 'var(--text-muted)' }}>Coba langsung pengalaman Aksi Protect.</p>
              </div>
              <div className={styles.pricingList}>
                <div className={styles.pricingListItem}><CheckCircle2 color="var(--secondary)" size={20} /> Akses ke Artikel & Galeri</div>
                <div className={styles.pricingListItem}><CheckCircle2 color="var(--secondary)" size={20} /> Baca Posting Story Agen</div>
                <div className={styles.pricingListItem}><CheckCircle2 color="var(--secondary)" size={20} /> <strong>Free Roleplay 3 Kali</strong></div>
              </div>
              <Link href="/register" className="btn btn-outline" style={{ padding: '1rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
                Mulai Gratis
              </Link>
            </div>

            {/* Token Topup Tier */}
            <div className={`${styles.pricingCard} ${styles.pricingCardPopular}`}>
              <div className={styles.pricingBadge}>Populer</div>
              <div className={styles.pricingHeader}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Top up Token</h3>
                <div className={styles.pricingPrice}>Pay as you go</div>
                <p style={{ color: 'var(--text-muted)' }}>Beli token sesuai kebutuhan untuk sesi lanjutan.</p>
              </div>
              <div className={styles.pricingList}>
                <div className={styles.pricingListItem}><CheckCircle2 color="var(--secondary)" size={20} /> Akses ke semua fitur komunitas</div>
                <div className={styles.pricingListItem}><CheckCircle2 color="var(--secondary)" size={20} /> <strong>Roleplay AI Tanpa Batas (per token)</strong></div>
                <div className={styles.pricingListItem}><CheckCircle2 color="var(--secondary)" size={20} /> Simulasi kasus Hard Objection</div>
                <div className={styles.pricingListItem}><CheckCircle2 color="var(--secondary)" size={20} /> Skor dan Laporan Analitik Mendalam</div>
              </div>
              <Link href="/topup" className="btn btn-primary" style={{ padding: '1rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
                Beli Token Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem 0', borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface-alt)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              &copy; 2026 Aksi Protect Indonesia. Platform Gabungan Agen Asuransi.
            </div>
            <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>
              Email: support@aksiprotect.com
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Didukung Penuh Oleh:</span>
            <img src="https://aaji.or.id/Content/images/repository/header-logo-aaji.png" alt="Logo AAJI" style={{ height: '45px', objectFit: 'contain' }} />
          </div>
        </div>
      </footer>
    </div>
  );
}

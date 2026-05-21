import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function ArticlesPage() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '100vh' }}>
      <Link href="/" className="btn btn-outline" style={{ display: 'inline-flex', marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Kembali ke Beranda
      </Link>
      
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <FileText size={64} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Artikel Asuransi</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Kumpulan artikel, tips penjualan, dan berita terkini mengenai industri asuransi di Indonesia.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        {/* Placeholder Articles */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="card" style={{ display: 'flex', padding: '1.5rem', gap: '1.5rem', flexDirection: 'row' }}>
            <div style={{ width: '150px', height: '100px', backgroundColor: 'var(--surface-alt)', borderRadius: '0.5rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Thumbnail
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Memahami Produk Asuransi Dwiguna (Endowment)</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Panduan komprehensif bagi agen untuk menjelaskan apa itu asuransi dwiguna dan bagaimana ia berbeda dari asuransi tradisional.
              </p>
              <Link href="#" style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Baca Selengkapnya &rarr;</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

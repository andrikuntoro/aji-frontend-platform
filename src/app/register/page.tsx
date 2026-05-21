import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Register() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ShieldCheck size={48} color="var(--primary)" style={{ margin: '0 auto' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem' }}>Mulai Akselerasi</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Daftar sebagai Agen Asuransi</p>
        </div>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Nama Lengkap</label>
            <input type="text" className="input-field" placeholder="Budi Santoso" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email</label>
            <input type="email" className="input-field" placeholder="budi@agency.com" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Perusahaan / Agency</label>
            <input type="text" className="input-field" placeholder="PT Asuransi Sejahtera" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Nomor Lisensi AAJI (Opsional)</label>
            <input type="text" className="input-field" placeholder="12345678" />
          </div>
          
          <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
            Daftar & Masuk Dashboard
          </Link>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Sudah punya akun? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}

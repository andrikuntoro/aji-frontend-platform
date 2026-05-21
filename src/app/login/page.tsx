import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Login() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ShieldCheck size={48} color="var(--primary)" style={{ margin: '0 auto' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem' }}>Selamat Datang</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Masuk untuk melanjutkan belajar</p>
        </div>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email</label>
            <input type="email" className="input-field" placeholder="budi@agency.com" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Password</label>
            <input type="password" className="input-field" placeholder="••••••••" />
          </div>
          
          <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
            Masuk
          </Link>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Belum punya akun? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}

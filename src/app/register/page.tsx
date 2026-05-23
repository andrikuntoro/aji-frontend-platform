"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [license, setLicense] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const trimmedEmail = email.trim().toLowerCase();
      // Get existing registered users list
      const existing = JSON.parse(localStorage.getItem("aji_registered_users") || "[]");
      
      // Prevent duplicates
      if (!existing.some((u: any) => u.email === trimmedEmail)) {
        existing.push({
          name: fullName,
          email: trimmedEmail,
          company,
          license,
          role: "member"
        });
        localStorage.setItem("aji_registered_users", JSON.stringify(existing));
      }

      setIsLoading(false);
      // Redirect to login page with registration success query param
      router.push(`/login?registered=true&email=${encodeURIComponent(trimmedEmail)}`);
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ShieldCheck size={48} color="var(--primary)" style={{ margin: '0 auto' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem' }}>Mulai Akselerasi</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Daftar sebagai Agen Asuransi</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Nama Lengkap</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field"
              placeholder="Budi Santoso"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="budi@agency.com"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Perusahaan / Agency</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="input-field"
              placeholder="PT Asuransi Sejahtera"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Nomor Lisensi AAJI (Opsional)</label>
            <input
              type="text"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="input-field"
              placeholder="12345678"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              marginTop: '1rem',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  border: '2px solid #ffffff',
                  borderTopColor: 'transparent',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <span>Mendaftarkan...</span>
              </>
            ) : (
              "Daftar & Ajukan Akses"
            )}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Sudah punya akun? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}


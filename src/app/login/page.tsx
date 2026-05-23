"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";

const BACKEND_URL = "https://aji-ai-roleplay--aji-ai-roleplay-2026.asia-southeast1.hosted.app";

function LoginFormFields() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Prefill email and show success if redirected from registration
  useEffect(() => {
    const isRegistered = searchParams.get("registered");
    const regEmail = searchParams.get("email");
    if (isRegistered === "true") {
      setSuccess("Registrasi Berhasil! Pendaftaran AAJI Anda telah diterima. Silakan masuk.");
    }
    if (regEmail) {
      setEmail(regEmail);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    setTimeout(() => {
      const trimmedEmail = email.trim().toLowerCase();
      const registeredList = JSON.parse(localStorage.getItem("aji_registered_users") || "[]");

      if (isRegistering) {
        if (registeredList.some((u: any) => u.email === trimmedEmail) || trimmedEmail === "member@aji.com" || trimmedEmail === "admin@aji.com") {
          setError("Email ini sudah terdaftar.");
          setIsLoading(false);
          return;
        }
        const newUser = { name, email: trimmedEmail, password };
        localStorage.setItem("aji_registered_users", JSON.stringify([...registeredList, newUser]));
        setIsRegistering(false);
        setSuccess("Registrasi Berhasil! Pendaftaran AAJI Anda telah diterima. Silakan masuk.");
        setPassword("");
        setIsLoading(false);
      } else {
        const isCustomMember = registeredList.some((u: any) => u.email === trimmedEmail && u.password === password);
        
        if (trimmedEmail === "admin@aji.com" && password === "admin123") {
          localStorage.setItem("aji_user", JSON.stringify({ email: trimmedEmail, role: "superadmin" }));
          window.location.href = `${BACKEND_URL}/admin`;
        } else if (
          (trimmedEmail === "member@aji.com" && password === "member123") || 
          isCustomMember
        ) {
          localStorage.setItem("aji_user", JSON.stringify({ email: trimmedEmail, role: "member" }));
          router.push("/dashboard");
        } else {
          setError("Kredensial tidak valid. Silakan gunakan email dan password yang benar.");
          setIsLoading(false);
        }
      }
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {success && (
        <div style={{
          borderRadius: '0.75rem',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          padding: '0.75rem',
          fontSize: '0.8rem',
          color: '#a7f3d0',
          fontWeight: 500
        }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{
          borderRadius: '0.75rem',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          padding: '0.75rem',
          fontSize: '0.8rem',
          color: '#fca5a5'
        }}>
          {error}
        </div>
      )}

      {isRegistering && (
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Nama Lengkap</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Nama Anda"
            required={isRegistering}
          />
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          placeholder="admin@aji.com atau member@aji.com"
          required
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          placeholder="••••••••"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary"
        style={{
          marginTop: '0.5rem',
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
            <span>Memproses...</span>
          </>
        ) : (
          isRegistering ? "Daftar Sekarang" : "Masuk"
        )}
      </button>

      <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.85rem' }}>
        {isRegistering ? (
          <span style={{ color: 'var(--text-muted)' }}>
            Sudah punya akun? <button type="button" onClick={() => {setIsRegistering(false); setError(null); setSuccess(null);}} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Masuk</button>
          </span>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>
            Belum punya akun? <button type="button" onClick={() => {setIsRegistering(true); setError(null); setSuccess(null);}} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Daftar AAJI</button>
          </span>
        )}
      </div>
    </form>
  );
}

export default function Login() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <ShieldCheck size={48} color="var(--primary)" style={{ margin: '0 auto' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem' }}>Portal AAJI</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sistem Akses Member & Superadmin</p>
        </div>
        
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          </div>
        }>
          <LoginFormFields />
        </Suspense>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          <div>Superadmin: <strong>admin@aji.com</strong> (admin123)</div>
          <div>Member: <strong>member@aji.com</strong> (member123)</div>
        </div>
      </div>
    </div>
  );
}


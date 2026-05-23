"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

const BACKEND_URL = "https://aji-ai-roleplay--aji-ai-roleplay-2026.asia-southeast1.hosted.app";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate authenticating
    setTimeout(() => {
      const trimmedEmail = email.trim().toLowerCase();
      
      if (trimmedEmail === "admin@aji.com" && password === "admin123") {
        localStorage.setItem("aji_user", JSON.stringify({ email: trimmedEmail, role: "superadmin" }));
        window.location.href = `${BACKEND_URL}/admin`;
      } else if (trimmedEmail === "member@aji.com" && password === "member123") {
        localStorage.setItem("aji_user", JSON.stringify({ email: trimmedEmail, role: "member" }));
        router.push("/dashboard");
      } else {
        setError("Kredensial tidak valid. Silakan gunakan admin@aji.com atau member@aji.com.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ShieldCheck size={48} color="var(--primary)" style={{ margin: '0 auto' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem' }}>Selamat Datang</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Masuk untuk melanjutkan belajar</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                <span>Memproses...</span>
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          <div>Superadmin: <strong>admin@aji.com</strong> (admin123)</div>
          <div>Member: <strong>member@aji.com</strong> (member123)</div>
        </div>
      </div>
    </div>
  );
}


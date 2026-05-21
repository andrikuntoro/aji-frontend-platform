"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function StoryPage() {
  const [story, setStory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!story.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setStory("");
    }, 1500);
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '100vh' }}>
      <Link href="/" className="btn btn-outline" style={{ display: 'inline-flex', marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Kembali ke Beranda
      </Link>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <MessageSquare size={64} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>User Posting Story</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Platform berbagi pengalaman dan cerita sukses dari sesama agen asuransi di seluruh Indonesia.
        </p>
      </div>

      {/* Posting Form Section */}
      <div className="card" style={{ maxWidth: '700px', margin: '0 auto 4rem', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Bagikan Cerita Anda</h2>
        
        {submitted ? (
          <div style={{ backgroundColor: '#DEF7EC', color: '#03543F', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CheckCircle2 size={24} />
            <div>
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Berhasil Dikirim!</strong>
              <span>Cerita Anda telah kami terima dan sedang menunggu persetujuan (Approval) dari Admin sebelum ditayangkan secara live.</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Ceritakan pengalaman closing polis, teknik handling objection yang berhasil, atau keluh kesah Anda di lapangan hari ini..."
              rows={5}
              className="input-field"
              style={{ width: '100%', marginBottom: '1rem', resize: 'vertical' }}
              disabled={isSubmitting}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                * Postingan Anda memerlukan persetujuan Admin agar tidak mengandung unsur SARA.
              </span>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting || !story.trim()}
              >
                {isSubmitting ? "Mengirim..." : <><Send size={18} /> Posting Cerita</>}
              </button>
            </div>
          </form>
        )}
      </div>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', textAlign: 'center' }}>Story Terbaru</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Placeholder Stories */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--border)', flexShrink: 0 }}></div>
              <div>
                <h3 style={{ fontSize: '1rem', margin: 0 }}>Agen Sukses {item}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2 jam yang lalu</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
              "Hari ini berhasil closing polis unit link senilai 100 juta dengan teknik handling objection yang saya pelajari minggu lalu! Terima kasih rekan-rekan untuk tipsnya..."
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

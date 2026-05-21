"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, UploadCloud, CheckCircle2 } from "lucide-react";

export default function GalleryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFileName("");
    }, 1500);
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '100vh' }}>
      <Link href="/" className="btn btn-outline" style={{ display: 'inline-flex', marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Kembali ke Beranda
      </Link>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <ImageIcon size={64} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Galeri Foto</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Dokumentasi kegiatan, penghargaan, dan acara pertemuan agen asuransi dari Sabang sampai Merauke.
        </p>
      </div>

      {/* Upload Photo Form Section */}
      <div className="card" style={{ maxWidth: '700px', margin: '0 auto 4rem', padding: '2rem', backgroundColor: 'var(--surface)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Unggah Momen Anda</h2>
        
        {submitted ? (
          <div style={{ backgroundColor: '#DEF7EC', color: '#03543F', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CheckCircle2 size={24} />
            <div>
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Foto Berhasil Diunggah!</strong>
              <span>Terima kasih telah berkontribusi. Foto Anda sedang menunggu validasi (Approval) Admin sebelum tayang di Galeri Live.</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ border: '2px dashed var(--border)', borderRadius: '1rem', padding: '3rem 2rem', textAlign: 'center', backgroundColor: 'var(--surface-alt)', cursor: 'pointer', position: 'relative' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                disabled={isSubmitting}
              />
              <UploadCloud size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>{fileName ? fileName : "Pilih atau Tarik Foto Kesini"}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Format: JPG, PNG maksimal 5MB.</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                * Publikasi memerlukan persetujuan Admin Aksi Protect.
              </span>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting || !fileName}
              >
                {isSubmitting ? "Mengunggah..." : "Unggah Foto"}
              </button>
            </div>
          </form>
        )}
      </div>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', textAlign: 'center' }}>Galeri Live</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Placeholder Gallery */}
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="card" style={{ overflow: 'hidden', height: '250px', backgroundColor: 'var(--surface-alt)', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Foto Kegiatan {item}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

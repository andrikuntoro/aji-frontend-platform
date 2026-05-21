"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, QrCode, Building, CheckCircle } from "lucide-react";

export default function TopupPage() {
  const packages = [
    { id: 1, tokens: 3, price: 30000, label: "3 Token Premium", stringPrice: "Rp 30.000" },
    { id: 2, tokens: 10, price: 100000, label: "10 Token Premium", stringPrice: "Rp 100.000" }
  ];

  const [selectedPackage, setSelectedPackage] = useState(packages[0]);
  const [selectedMethod, setSelectedMethod] = useState("qris");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <Link href="/#pricing" className="btn btn-outline" style={{ display: 'inline-flex', marginBottom: '2rem' }}>
          <ArrowLeft size={20} /> Kembali
        </Link>
        
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Top up Token Roleplay</h1>
            <p style={{ color: 'var(--text-muted)' }}>Selesaikan pembayaran untuk menambah token Anda</p>
          </div>

          {!isSuccess ? (
            <>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Pilih Paket Token</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                {packages.map(pkg => (
                  <button 
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    style={{ flex: 1, padding: '1.5rem', borderRadius: '0.5rem', border: selectedPackage.id === pkg.id ? '2px solid var(--primary)' : '2px solid var(--border)', backgroundColor: selectedPackage.id === pkg.id ? 'rgba(15, 76, 129, 0.05)' : 'var(--surface)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{pkg.label}</div>
                    <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.25rem' }}>{pkg.stringPrice}</div>
                  </button>
                ))}
              </div>

              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Pilih Metode Pembayaran</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <button 
                  onClick={() => setSelectedMethod("qris")}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '0.5rem', border: `2px solid ${selectedMethod === 'qris' ? 'var(--primary)' : 'var(--border)'}`, backgroundColor: 'var(--surface)', cursor: 'pointer', textAlign: 'left' }}
                >
                  <QrCode size={24} color={selectedMethod === 'qris' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: selectedMethod === 'qris' ? 600 : 400 }}>QRIS (E-Wallet & Mobile Banking)</div>
                  </div>
                  {selectedMethod === 'qris' && <CheckCircle size={20} color="var(--primary)" />}
                </button>
                
                <button 
                  onClick={() => setSelectedMethod("va")}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '0.5rem', border: `2px solid ${selectedMethod === 'va' ? 'var(--primary)' : 'var(--border)'}`, backgroundColor: 'var(--surface)', cursor: 'pointer', textAlign: 'left' }}
                >
                  <Building size={24} color={selectedMethod === 'va' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: selectedMethod === 'va' ? 600 : 400 }}>Virtual Account (Transfer Bank)</div>
                  </div>
                  {selectedMethod === 'va' && <CheckCircle size={20} color="var(--primary)" />}
                </button>

                <button 
                  onClick={() => setSelectedMethod("transfer")}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '0.5rem', border: `2px solid ${selectedMethod === 'transfer' ? 'var(--primary)' : 'var(--border)'}`, backgroundColor: 'var(--surface)', cursor: 'pointer', textAlign: 'left' }}
                >
                  <CreditCard size={24} color={selectedMethod === 'transfer' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: selectedMethod === 'transfer' ? 600 : 400 }}>Transfer Bank Manual</div>
                  </div>
                  {selectedMethod === 'transfer' && <CheckCircle size={20} color="var(--primary)" />}
                </button>
              </div>

              <div style={{ backgroundColor: 'var(--surface-alt)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total Pembayaran</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{selectedPackage.stringPrice}</div>
              </div>

              <button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', justifyContent: 'center' }}
              >
                {isProcessing ? "Memproses..." : "Bayar Sekarang"}
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <CheckCircle size={80} color="var(--secondary)" style={{ margin: '0 auto 1.5rem' }} />
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Pembayaran Berhasil!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Terima kasih, {selectedPackage.tokens} Token Premium telah ditambahkan ke akun Anda.
              </p>
              <Link href="/roleplay" className="btn btn-primary" style={{ display: 'inline-flex', padding: '1rem 2rem' }}>
                Mulai Roleplay Sekarang
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

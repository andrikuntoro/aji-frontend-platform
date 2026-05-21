"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle, Video } from "lucide-react";
import { saveModuleScore } from "../../../utils/progress";
import styles from "./training.module.css";

// Mock content database
const TRAINING_DATA: Record<string, any> = {
  "dasar-asuransi": {
    title: "1. Dasar-Dasar Asuransi Jiwa",
    type: "text",
    content: "Asuransi jiwa adalah kontrak antara pemegang polis dan perusahaan asuransi, dimana perusahaan asuransi berjanji untuk membayarkan sejumlah uang (uang pertanggungan) kepada penerima manfaat yang ditunjuk apabila tertanggung meninggal dunia. Tujuan utamanya adalah memberikan perlindungan finansial bagi keluarga yang ditinggalkan.",
    quiz: [
      { q: "Apa tujuan utama dari asuransi jiwa?", options: ["Investasi saham", "Perlindungan finansial keluarga", "Membayar pajak", "Pinjaman bank"], answer: 1 },
      { q: "Siapa yang menerima pembayaran saat tertanggung meninggal?", options: ["Agen Asuransi", "Rumah Sakit", "Penerima Manfaat", "Pemerintah"], answer: 2 },
    ]
  },
  "handling-objection": {
    title: "3. Teknik Handling Objection (Pemula)",
    type: "video",
    content: "Berikut adalah video instruksional tentang bagaimana merespon penolakan dari prospek dengan metode 3F (Feel, Felt, Found).",
    quiz: [
      { q: "Apa kepanjangan dari metode 3F?", options: ["Fast, Furious, Finish", "Feel, Felt, Found", "Find, Fix, Forget", "Follow, Focus, Final"], answer: 1 },
      { q: "Apa sikap terbaik saat menghadapi penolakan?", options: ["Marah", "Berdebat", "Mendengarkan & Empati", "Meninggalkan prospek"], answer: 2 },
    ]
  }
};

export default function TrainingViewer() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const modData = TRAINING_DATA[id];

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!modData) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2>Modul tidak ditemukan</h2>
        <Link href="/modules" className="btn btn-outline" style={{ marginTop: '1rem' }}>Kembali ke Modul</Link>
      </div>
    );
  }

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < modData.quiz.length) {
      alert("Harap jawab semua pertanyaan kuis!");
      return;
    }
    
    let correct = 0;
    modData.quiz.forEach((q: any, idx: number) => {
      if (answers[idx] === q.answer) correct++;
    });
    
    const finalScore = Math.round((correct / modData.quiz.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
    
    // Save to local storage
    saveModuleScore(id, finalScore);
  };

  const finishTraining = () => {
    router.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/modules" style={{ color: 'var(--text-main)' }}>
            <ArrowLeft size={24} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             {modData.type === 'video' ? <Video size={20} color="var(--primary)" /> : <BookOpen size={20} color="var(--primary)" />}
             <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{modData.title}</h1>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Content View */}
        <section className={`card ${styles.contentSection}`}>
          {modData.type === 'video' && (
            <div className={styles.videoPlaceholder}>
              <div className={styles.playIconWrapper}>
                <Video size={48} color="white" />
              </div>
              <p>Simulasi Video Player</p>
            </div>
          )}
          
          <div style={{ marginTop: '2rem', lineHeight: '1.8', fontSize: '1.1rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Materi Inti</h2>
            <p>{modData.content}</p>
          </div>
        </section>

        {/* Quiz View */}
        <section className={`card ${styles.quizSection}`}>
          <h2>Post-Test Module</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Kerjakan kuis singkat ini untuk memvalidasi pemahaman Anda dan menyelesaikan modul.
          </p>

          <div className={styles.quizList}>
            {modData.quiz.map((q: any, qIdx: number) => (
              <div key={qIdx} className={styles.questionCard}>
                <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{qIdx + 1}. {q.q}</p>
                <div className={styles.options}>
                  {q.options.map((opt: string, optIdx: number) => {
                    const isSelected = answers[qIdx] === optIdx;
                    const isCorrect = q.answer === optIdx;
                    
                    let optionClass = styles.option;
                    if (isSelected) optionClass += ` ${styles.optionSelected}`;
                    if (submitted) {
                      if (isCorrect) optionClass += ` ${styles.optionCorrect}`;
                      else if (isSelected && !isCorrect) optionClass += ` ${styles.optionWrong}`;
                    }

                    return (
                      <div 
                        key={optIdx} 
                        className={optionClass}
                        onClick={() => handleOptionSelect(qIdx, optIdx)}
                      >
                         <div className={styles.radioCircle}>
                            {isSelected && <div className={styles.radioInner} />}
                         </div>
                         {opt}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {!submitted ? (
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }} onClick={handleSubmit}>
              Kirim & Lihat Hasil
            </button>
          ) : (
            <div className={styles.resultBox}>
              <CheckCircle size={48} color="#10B981" />
              <h3>Kuis Diselesaikan!</h3>
              <div className={styles.scoreDisplay}>Skor Anda: {score}</div>
              <p>Nilai telah disimpan ke sistem.</p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={finishTraining}>
                Kembali ke Dashboard
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

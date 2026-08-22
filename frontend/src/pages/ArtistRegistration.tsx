import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ChevronDown, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// ==========================================
// CONSTANTS & HELPERS
// ==========================================
const ARTIST_CATEGORIES = [
  { id: 'music', label: 'Music', icon: '🎸' },
  { id: 'singing', label: 'Singing', icon: '🎤' },
  { id: 'rap', label: 'Rap', icon: '🔥' },
  { id: 'beatboxing', label: 'Beatboxing', icon: '🎧' },
  { id: 'poetry', label: 'Poetry / Spoken Word', icon: '📖' },
  { id: 'comedy', label: 'Stand-up Comedy', icon: '🎭' },
  { id: 'dance', label: 'Dance', icon: '💃' },
  { id: 'storytelling', label: 'Storytelling', icon: '🗣️' },
  { id: 'other', label: 'Other', icon: '✨' },
];

const UPI_OPTIONS = [
  { id: 'phonepe', name: 'PhonePe', color: '#5f259f', icon: 'P' },
  { id: 'gpay', name: 'Google Pay', color: '#ea4335', icon: 'G' },
  { id: 'paytm', name: 'Paytm', color: '#00baf2', icon: 'P' },
  { id: 'qr', name: 'Any UPI App (QR)', color: '#ffd700', icon: '₹' },
];

// Helper to check if URL is a valid Instagram link
const isValidInstagramUrl = (url: string) => {
  if (!url) return false;
  // Very basic regex to ensure it contains instagram.com
  return /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/.test(url);
};

// Helper to calculate age
const calculateAge = (day: string, month: string, year: string) => {
  if (!day || !month || !year) return null;
  const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const ArtistRegistration: React.FC = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');

  // Page locked to 100vh with inner scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    artistName: '',
    whatsapp: '',
    phone: '',
    email: '',
    instagram: '',
    // Step 2
    category: '',
    setDetails: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    ageDeclaration: false,
    // Step 3
    paymentScreenshot: null as File | null,
    paymentScreenshotBase64: '',
    txnId: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("File is too large! Please upload an image smaller than 1MB.");
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, paymentScreenshot: file, paymentScreenshotBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep1 = () => {
    let newErrors: any = {};
    if (!formData.fullName) newErrors.fullName = 'Required';
    if (!formData.artistName) newErrors.artistName = 'Required';
    if (!formData.whatsapp || formData.whatsapp.length < 10) newErrors.whatsapp = 'Valid 10-digit number required';
    if (!formData.email || !formData.email.includes('@')) newErrors.email = 'Valid email required';
    if (!isValidInstagramUrl(formData.instagram)) newErrors.instagram = 'Valid Instagram profile URL required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setStep(2);
    }
  };

  const handleNextStep2 = () => {
    let newErrors: any = {};
    if (!formData.category) newErrors.category = 'Required';
    if (!formData.setDetails) newErrors.setDetails = 'Required';
    if (!formData.dobDay || !formData.dobMonth || !formData.dobYear) newErrors.dob = 'Required';
    
    const age = calculateAge(formData.dobDay, formData.dobMonth, formData.dobYear);
    if (age !== null && age < 21) {
      newErrors.age = 'Oops, underage! This stage is strictly 21+.';
    } else if (!formData.ageDeclaration) {
      newErrors.declaration = 'You must declare your age is 21+.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setStep(3);
    }
  };

  const handleNextStep3 = () => {
    let newErrors: any = {};
    if (!formData.txnId || formData.txnId.length < 5) newErrors.txnId = 'Valid transaction ID required';
    if (!formData.paymentScreenshot) newErrors.screenshot = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setStep(4);
    }
  };

  const handleSubmit = async () => {
    // Submit to backend
    setIsSubmitting(true);
    try {
      const payload: any = {
        name: formData.fullName,
        phone: formData.whatsapp,
        email: formData.email,
        instagramLink: formData.instagram,
        age: parseInt(formData.dobYear) ? new Date().getFullYear() - parseInt(formData.dobYear) : 0,
        status: 'PENDING_APPROVAL',
        paymentScreenshotUrl: formData.paymentScreenshotBase64,
        performanceTrack: formData.setDetails,
        lineupOrder: 0
      };
      
      if (eventId) {
        payload.event = { id: parseInt(eventId) };
      }

      await axios.post(`${API_URL}/api/public/leads`, payload);
      setStep(5); // Success Screen
    } catch (err) {
      alert("Something went wrong with submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', height: '100vh', width: '100vw', paddingTop: '80px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Top Progress Bar */}
      {step < 5 && (
        <div style={{ width: '100%', maxWidth: '800px', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', width: '100%', gap: '8px' }}>
            {[1, 2, 3, 4].map(s => (
              <div key={s} style={{ height: '3px', flex: 1, background: s <= step ? '#ffd700' : 'rgba(255,255,255,0.1)', borderRadius: '3px', transition: 'background 0.5s ease' }} />
            ))}
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.6)' }}>
            STEP {step} OF 4 — {
              step === 1 ? "YOUR DETAILS" :
              step === 2 ? "YOUR ACT" :
              step === 3 ? "ENTRY FEE" :
              "THE RIDER"
            }
          </span>
        </div>
      )}

      {/* Main Form Container */}
      <AnimatePresence mode="wait">
        
        {/* ======================= STEP 1 ======================= */}
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ width: '100%', maxWidth: '800px', padding: '0 1.5rem 4rem 1.5rem' }}
          >
            <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '2.5rem', width: '100%', boxSizing: 'border-box' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', marginBottom: '0.5rem', color: '#fff' }}>
                WHO'S ON THE <span style={{ color: '#ffd700' }}>MIC?</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
                Perform. Be seen. Get recognized. Start with who you are.
              </p>

              <Input label="Full Name" required value={formData.fullName} placeholder="Your real name" error={errors.fullName} onChange={(e:any) => setFormData({...formData, fullName: e.target.value})} />
              <Input label="Stage / Artist Name" required value={formData.artistName} placeholder="What the crowd will chant" error={errors.artistName} onChange={(e:any) => setFormData({...formData, artistName: e.target.value})} />
              
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <Input label="Whatsapp Number" required value={formData.whatsapp} placeholder="10-digit number" error={errors.whatsapp} onChange={(e:any) => setFormData({...formData, whatsapp: e.target.value})} />
                <Input label="Phone (If Different)" value={formData.phone} placeholder="Optional" onChange={(e:any) => setFormData({...formData, phone: e.target.value})} />
              </div>

              <Input label="Email" type="email" required value={formData.email} placeholder="you@email.com" error={errors.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} />
              <Input label="Instagram Profile Link" required value={formData.instagram} placeholder="https://instagram.com/yourhandle" error={errors.instagram} onChange={(e:any) => setFormData({...formData, instagram: e.target.value})} />

              <button 
                onClick={handleNextStep1}
                style={{ width: '100%', padding: '16px', background: '#ffd700', color: '#000', fontSize: '1rem', fontWeight: 800, borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '1rem', transition: 'all 0.3s ease' }}
              >
                CONTINUE →
              </button>
            </div>
          </motion.div>
        )}

        {/* ======================= STEP 2 ======================= */}
        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ width: '100%', maxWidth: '800px', padding: '0 1.5rem 4rem 1.5rem' }}
          >
            <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '2.5rem', width: '100%', boxSizing: 'border-box' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', marginBottom: '0.5rem', color: '#fff' }}>
                YOUR <span style={{ color: '#ffd700' }}>ACT</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
                Pick your lane and tell us about your set.
              </p>

              {/* Categories */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff', display: 'block', marginBottom: '1rem' }}>
                  Type of Artist <span style={{ color: '#ff3333' }}>*</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                  {ARTIST_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setFormData({...formData, category: cat.id})}
                      style={{
                        padding: '10px 20px',
                        background: formData.category === cat.id ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                        border: `1px solid ${formData.category === cat.id ? '#ffd700' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '30px',
                        color: formData.category === cat.id ? '#ffd700' : '#fff',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <span>{cat.icon}</span> {cat.label}
                    </button>
                  ))}
                </div>
                {errors.category && <span style={{ color: '#ff3333', fontSize: '0.75rem', marginTop: '8px', display: 'block' }}>{errors.category}</span>}
              </div>

              {/* Textarea */}
              <div style={{ marginBottom: '3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff', display: 'block', marginBottom: '1rem' }}>
                  Your Set / Tracks <span style={{ color: '#ff3333' }}>*</span>
                </label>
                <textarea
                  value={formData.setDetails}
                  onChange={(e) => setFormData({...formData, setDetails: e.target.value})}
                  placeholder="e.g. 2 original tracks — 'Midnight' & 'Rewind'. ~6 min set."
                  style={{
                    width: '100%',
                    height: '150px',
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${errors.setDetails ? '#ff3333' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '8px',
                    padding: '16px',
                    color: '#fff',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'none',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#ffd700'; }}
                  onBlur={(e) => { if(!errors.setDetails) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>

              {/* Age Check */}
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', marginBottom: '0.5rem', color: '#ffd700' }}>
                  AGE CHECK
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  This stage is strictly 21+.
                </p>

                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff', display: 'block', marginBottom: '1rem' }}>
                  Date of Birth <span style={{ color: '#ff3333' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <select value={formData.dobDay} onChange={e => setFormData({...formData, dobDay: e.target.value})} style={selectStyle}>
                    <option value="">Day</option>
                    {Array.from({length: 31}, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select value={formData.dobMonth} onChange={e => setFormData({...formData, dobMonth: e.target.value})} style={selectStyle}>
                    <option value="">Month</option>
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                  <select value={formData.dobYear} onChange={e => setFormData({...formData, dobYear: e.target.value})} style={selectStyle}>
                    <option value="">Year</option>
                    {Array.from({length: 50}, (_, i) => new Date().getFullYear() - 15 - i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>

                <div style={{ background: errors.age ? 'rgba(255, 51, 51, 0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${errors.age ? '#ff3333' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', padding: '1rem' }}>
                  <p style={{ color: errors.age ? '#ff3333' : 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {errors.age ? errors.age : "Enter your date of birth above to confirm eligibility."}
                  </p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.ageDeclaration} 
                      onChange={e => setFormData({...formData, ageDeclaration: e.target.checked})} 
                      disabled={!!errors.age}
                      style={{ width: '18px', height: '18px', accentColor: '#ffd700' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#fff' }}>I declare I am 21 years or older and will carry a valid photo ID for verification.</span>
                  </label>
                  {errors.declaration && <p style={{ color: '#ff3333', fontSize: '0.75rem', marginTop: '0.5rem' }}>{errors.declaration}</p>}
                </div>

              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: '16px', background: 'transparent', color: '#fff', fontSize: '1rem', fontWeight: 800, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
                  ← BACK
                </button>
                <button 
                  onClick={handleNextStep2}
                  disabled={!!errors.age}
                  style={{ flex: 2, padding: '16px', background: errors.age ? 'rgba(255,215,0,0.3)' : '#ffd700', color: '#000', fontSize: '1rem', fontWeight: 800, borderRadius: '8px', border: 'none', cursor: errors.age ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease' }}
                >
                  CONTINUE →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= STEP 3 ======================= */}
        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ width: '100%', maxWidth: '800px', padding: '0 1.5rem 4rem 1.5rem' }}
          >
            <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
              
              {/* Header Box */}
              <div style={{ padding: '1.5rem 2rem', background: 'rgba(255,215,0,0.05)', borderBottom: '1px solid rgba(255,215,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: '"Outfit", sans-serif', margin: 0, color: '#fff' }}>WTM 5.0 ENTRY</h2>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffd700' }}>₹789</span>
              </div>

              <div style={{ padding: '2rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '1rem' }}>
                  PAY WITH UPI
                </label>

                {/* UPI Options */}
                <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
                  {UPI_OPTIONS.map((opt, i) => (
                    <div key={opt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem', borderBottom: i < UPI_OPTIONS.length -1 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: opt.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: opt.id==='qr'?'#000':'#fff' }}>
                          {opt.icon}
                        </div>
                        <span style={{ fontWeight: 600, color: '#fff' }}>{opt.name}</span>
                      </div>
                      <ChevronDown size={18} color="rgba(255,255,255,0.3)" />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '2.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#ffd700' }}>🔒</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Secured by Razorpay-style UX</span>
                </div>

                {/* Upload Box */}
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff', display: 'block', marginBottom: '1rem' }}>
                  PAYMENT SCREENSHOT <span style={{ color: '#ff3333' }}>*</span>
                </label>
                
                <div style={{ 
                  border: `1px dashed ${errors.screenshot ? '#ff3333' : '#ffd700'}`, 
                  borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center', background: 'rgba(255,215,0,0.02)', marginBottom: '1rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                }}>
                  <Camera size={32} color={errors.screenshot ? '#ff3333' : '#ffd700'} />
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                    {formData.paymentScreenshot ? formData.paymentScreenshot.name : "UPLOAD SCREENSHOT"}
                  </h4>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>JPEG/PNG</span>
                </div>
                {errors.screenshot && <span style={{ color: '#ff3333', fontSize: '0.75rem', display: 'block', marginBottom: '1rem' }}>{errors.screenshot}</span>}

                <div style={{ position: 'relative', width: '100%', marginBottom: '2.5rem' }}>
                  <input type="file" accept="image/png, image/jpeg" onChange={handleScreenshotUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                  <button style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', color: '#ffd700', fontSize: '0.9rem', fontWeight: 800, borderRadius: '8px', border: '1px solid rgba(255,215,0,0.3)', pointerEvents: 'none' }}>
                    📁 CHOOSE FILE
                  </button>
                </div>

                <Input label="UPI TRANSACTION / REFERENCE ID" required value={formData.txnId} placeholder="12-digit ref or auto-filled" error={errors.txnId} onChange={(e:any) => setFormData({...formData, txnId: e.target.value})} />

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                  <button onClick={() => setStep(2)} style={{ flex: 1, padding: '16px', background: 'transparent', color: '#fff', fontSize: '1rem', fontWeight: 800, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
                    ← BACK
                  </button>
                  <button 
                    onClick={handleNextStep3}
                    style={{ flex: 2, padding: '16px', background: '#ffd700', color: '#000', fontSize: '1rem', fontWeight: 800, borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}
                  >
                    CONTINUE →
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= STEP 4 (REVIEW) ======================= */}
        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ width: '100%', maxWidth: '800px', padding: '0 1.5rem 4rem 1.5rem' }}
          >
            <div style={{ background: '#0d0d0d', border: '1px dashed #ffd700', borderRadius: '16px', padding: '3rem 2.5rem', width: '100%', boxSizing: 'border-box' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: '#ffd700', fontSize: '1.2rem', marginBottom: '1rem' }}>
                  Ladies & gentlemen... tonight, from the world of {ARTIST_CATEGORIES.find(c => c.id === formData.category)?.label.toLowerCase()}...
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, fontFamily: '"Outfit", sans-serif', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  GIVE IT UP FOR {formData.artistName}!
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', letterSpacing: '3px', marginTop: '1rem', textTransform: 'uppercase' }}>
                  WHAT THE MIC 5.0 - SKYHY LIVE - 09 AUG 2026
                </p>
              </div>

              <div style={{ borderTop: '1px dashed rgba(255,215,0,0.3)', margin: '2rem -2.5rem', padding: '2rem 2.5rem 0' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '2px', color: '#ffd700', marginBottom: '2rem', textTransform: 'uppercase' }}>
                  THE RIDER — CHECK BEFORE YOU SUBMIT
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <ReviewRow label="FULL NAME" value={formData.fullName.toUpperCase()} />
                  <ReviewRow label="ARTIST NAME" value={formData.artistName.toUpperCase()} />
                  <ReviewRow label="WHATSAPP" value={formData.whatsapp} />
                  <ReviewRow label="PHONE" value={formData.phone || formData.whatsapp} />
                  <ReviewRow label="EMAIL" value={formData.email} />
                  <ReviewRow label="INSTAGRAM" value={formData.instagram} />
                  <ReviewRow label="CATEGORY" value={ARTIST_CATEGORIES.find(c => c.id === formData.category)?.label || ''} />
                  <ReviewRow label="SET / TRACKS" value={formData.setDetails} />
                  <ReviewRow label="DATE OF BIRTH" value={`${formData.dobYear}-${formData.dobMonth}-${formData.dobDay}`} />
                  <ReviewRow label="TXN ID" value={formData.txnId} />
                  <ReviewRow label="SCREENSHOT" value={formData.paymentScreenshot?.name || ''} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                <button onClick={() => setStep(3)} style={{ flex: 1, padding: '16px', background: 'transparent', color: '#fff', fontSize: '1rem', fontWeight: 800, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
                  ← BACK
                </button>
                <button 
                  onClick={handleSubmit}
                  style={{ flex: 2, padding: '16px', background: '#ffd700', color: '#000', fontSize: '1rem', fontWeight: 800, borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}
                >
                  SUBMIT ENROLLMENT ✓
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* ======================= STEP 5 (SUCCESS) ======================= */}
        {step === 5 && (
          <motion.div 
            key="step5"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ width: '100%', maxWidth: '600px', padding: '0 1.5rem', textAlign: 'center' }}
          >
            <div style={{ background: 'rgba(0, 230, 118, 0.05)', border: '1px solid rgba(0, 230, 118, 0.2)', borderRadius: '24px', padding: '4rem 2rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#00e676', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <Check size={40} color="#000" strokeWidth={3} />
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', color: '#fff', marginBottom: '1rem' }}>
                YOU'RE ON THE <span style={{ color: '#00e676' }}>LIST!</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Your enrollment is secured. We will verify your payment and WhatsApp you the finalized stage timings.
              </p>
              <button onClick={() => window.location.href='/'} style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', fontWeight: 800, borderRadius: '30px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
                ← RETURN TO HOME
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
              zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.2)', borderTopColor: '#ffd700', borderRadius: '50%', marginBottom: '1rem' }}
            />
            <span style={{ color: '#ffd700', fontWeight: 700, letterSpacing: '2px', fontSize: '0.85rem' }}>UPLOADING DETAILS...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-components

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, error }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem', flex: 1 }}>
    <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff' }}>
      {label} {required && <span style={{ color: '#ff3333' }}>*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${error ? '#ff3333' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '8px',
        padding: '14px 16px',
        color: '#fff',
        fontSize: '1rem',
        outline: 'none',
        transition: 'all 0.3s ease',
        width: '100%',
        boxSizing: 'border-box'
      }}
      onFocus={(e) => {
        if (!error) e.target.style.borderColor = '#ffd700';
        e.target.style.background = 'rgba(255,255,255,0.05)';
      }}
      onBlur={(e) => {
        if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.1)';
        e.target.style.background = 'rgba(255,255,255,0.02)';
      }}
    />
    {error && <span style={{ color: '#ff3333', fontSize: '0.75rem' }}>{error}</span>}
  </div>
);

const selectStyle = {
  flex: 1,
  padding: '14px',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '1rem',
  outline: 'none',
  appearance: 'none' as const,
  WebkitAppearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 1rem top 50%',
  backgroundSize: '0.65rem auto'
};

const ReviewRow = ({ label, value }: { label: string, value: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%' }}>
    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', flexShrink: 0, paddingRight: '1rem' }}>{label}</span>
    <div style={{ flex: 1, borderBottom: '1px dotted rgba(255,255,255,0.1)', margin: '0 10px', alignSelf: 'center' }} />
    <span style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 500, textAlign: 'right' }}>{value}</span>
  </div>
);

export default ArtistRegistration;

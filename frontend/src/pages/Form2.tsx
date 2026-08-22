import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;

const Input = ({ label, required, placeholder, value, onChange, type = 'text', error }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginBottom: '1.5rem' }}>
    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>
      {label} {required && <span style={{ color: '#ff3333' }}>*</span>}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: '100%', padding: '16px', background: 'transparent', border: `1px solid ${error ? '#ff3333' : 'rgba(255,255,255,0.2)'}`, borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none', minHeight: '120px' }}
      />
    ) : (
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: '100%', padding: '16px', background: 'transparent', border: `1px solid ${error ? '#ff3333' : 'rgba(255,255,255,0.2)'}`, borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }}
      />
    )}
    {error && <span style={{ color: '#ff3333', fontSize: '0.75rem' }}>{error}</span>}
  </div>
);

const Form2 = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: '',
    selfIntro: '',
    audioTrackBase64: '',
    audioTrackFile: null as File | null
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large! Please upload an audio file smaller than 5MB.");
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, audioTrackFile: file, audioTrackBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    let newErrors: any = {};
    if (!formData.phone) newErrors.phone = 'Required';
    if (!formData.selfIntro) newErrors.selfIntro = 'Required';
    if (!formData.audioTrackBase64) newErrors.audio = 'Audio track is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/public/leads/${id}/form2`, {
        phone: formData.phone,
        selfIntro: formData.selfIntro,
        audioTrackUrl: formData.audioTrackBase64
      });
      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong with submission.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Spot Confirmed!</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Your audio track and intro have been sent to the organizers.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', width: '100vw', paddingTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: '"Inter", sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '600px', padding: '0 20px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>Confirm Your Spot</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Please provide your self introduction and performance track to finalize your booking.</p>

        <Input label="CONFIRM WHATSAPP NUMBER" required value={formData.phone} placeholder="+91 0000000000" error={errors.phone} onChange={(e:any) => setFormData({...formData, phone: e.target.value})} />
        
        <Input label="SELF INTRODUCTION" type="textarea" required value={formData.selfIntro} placeholder="Tell the audience a bit about yourself..." error={errors.selfIntro} onChange={(e:any) => setFormData({...formData, selfIntro: e.target.value})} />
        
        <div style={{ marginBottom: '2.5rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
            PERFORMANCE TRACK (AUDIO) <span style={{ color: '#ff3333' }}>*</span>
          </label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input type="file" accept="audio/*" onChange={handleAudioUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
            <button style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', color: formData.audioTrackFile ? '#25D366' : '#ffd700', fontSize: '0.9rem', fontWeight: 800, borderRadius: '8px', border: `1px solid ${errors.audio ? '#ff3333' : 'rgba(255,215,0,0.3)'}`, pointerEvents: 'none' }}>
              {formData.audioTrackFile ? `🎵 ${formData.audioTrackFile.name}` : '📁 UPLOAD AUDIO (MAX 5MB)'}
            </button>
          </div>
          {errors.audio && <span style={{ color: '#ff3333', fontSize: '0.75rem', display: 'block', marginTop: '8px' }}>{errors.audio}</span>}
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: '16px', background: '#ffd700', color: '#000', fontSize: '1rem', fontWeight: 800, borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'SUBMITTING...' : 'CONFIRM SPOT →'}
        </button>

      </motion.div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
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
            <span style={{ color: '#ffd700', fontWeight: 700, letterSpacing: '2px', fontSize: '0.85rem' }}>UPLOADING AUDIO...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Form2;

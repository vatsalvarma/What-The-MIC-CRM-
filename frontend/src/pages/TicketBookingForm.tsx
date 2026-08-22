import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;

const Input = ({ label, required, placeholder, value, onChange, type = 'text', error }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginBottom: '1.5rem' }}>
    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>
      {label} {required && <span style={{ color: '#ff3333' }}>*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${error ? '#ff3333' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '8px',
        padding: '14px 16px',
        color: '#fff',
        fontSize: '1rem',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box'
      }}
      onFocus={e => e.target.style.borderColor = '#ffd700'}
      onBlur={e => { if(!error) e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
    />
    {error && <span style={{ color: '#ff3333', fontSize: '0.75rem' }}>{error}</span>}
  </div>
);

const TicketBookingForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    screenshotFile: null as File | null,
    screenshotBase64: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large! Max 2MB.");
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, screenshotFile: file, screenshotBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    let newErrors: any = {};
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.phone || formData.phone.length < 10) newErrors.phone = 'Valid 10-digit number required';
    if (!formData.email || !formData.email.includes('@')) newErrors.email = 'Valid email required';
    if (!formData.screenshotBase64) newErrors.screenshot = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await axios.post(`${API_URL}/api/public/bookings`, {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        paymentScreenshotUrl: formData.screenshotBase64,
        event: { id: eventId },
        quantity: 1,
        status: 'PENDING_APPROVAL'
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', background: 'rgba(0, 230, 118, 0.05)', border: '1px solid rgba(0, 230, 118, 0.2)', borderRadius: '24px', padding: '4rem 2rem', maxWidth: '500px', margin: '0 20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#00e676', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <Check size={40} color="#000" strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>TICKET BOOKED!</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your booking request has been received. Our team will verify the payment and confirm your ticket shortly.
          </p>
          <button onClick={() => navigate('/book-events')} style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', fontWeight: 800, borderRadius: '30px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
            ← BACK TO EVENTS
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', width: '100vw', paddingTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: '"Inter", sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '600px', padding: '0 20px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>Book Ticket</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Enter your details and upload your payment screenshot to secure your spot.</p>

        <Input label="FULL NAME" required value={formData.name} placeholder="John Doe" error={errors.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} />
        <Input label="WHATSAPP NUMBER" required value={formData.phone} placeholder="10-digit number" error={errors.phone} onChange={(e:any) => setFormData({...formData, phone: e.target.value})} />
        <Input label="EMAIL ADDRESS" type="email" required value={formData.email} placeholder="john@example.com" error={errors.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} />
        
        <div style={{ marginBottom: '2.5rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
            PAYMENT SCREENSHOT <span style={{ color: '#ff3333' }}>*</span>
          </label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
            <button style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', color: formData.screenshotFile ? '#25D366' : '#ffd700', fontSize: '0.9rem', fontWeight: 800, borderRadius: '8px', border: `1px solid ${errors.screenshot ? '#ff3333' : 'rgba(255,215,0,0.3)'}`, pointerEvents: 'none' }}>
              {formData.screenshotFile ? `📸 ${formData.screenshotFile.name}` : '📁 UPLOAD SCREENSHOT (MAX 2MB)'}
            </button>
          </div>
          {errors.screenshot && <span style={{ color: '#ff3333', fontSize: '0.75rem', display: 'block', marginTop: '8px' }}>{errors.screenshot}</span>}
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '16px', background: '#ffd700', color: '#000', fontSize: '1rem', fontWeight: 800, borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? 'PROCESSING...' : 'SUBMIT BOOKING →'}
        </button>

      </motion.div>

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
            <span style={{ color: '#ffd700', fontWeight: 700, letterSpacing: '2px', fontSize: '0.85rem' }}>BOOKING TICKET...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TicketBookingForm;

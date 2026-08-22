import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Image as ImageIcon, ChevronDown, Plus, Trash2, Calendar as CalendarIcon, MapPin, Search, Paperclip, Video, Ticket } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;

const UploadBox = ({ title, desc, height = '120px', icon: Icon = null, dark = false, onChange, bgImage }: any) => (
  <label style={{
    height, borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    background: bgImage ? `url(${bgImage}) center/cover no-repeat` : (dark ? '#0f172a' : '#f8fafc'),
    border: bgImage ? 'none' : '1px dashed #cbd5e1',
    color: dark || bgImage ? '#fff' : '#64748b',
    textAlign: 'center', padding: '1rem',
    position: 'relative', overflow: 'hidden',
    transition: 'all 0.2s',
    textShadow: bgImage ? '0 2px 4px rgba(0,0,0,0.8)' : 'none'
  }}>
    <input type="file" accept="image/*" onChange={onChange} style={{ display: 'none' }} />
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: bgImage ? 'rgba(0,0,0,0.5)' : 'transparent', padding: '8px 16px', borderRadius: '12px' }}>
      {Icon && <Icon size={24} color={dark || bgImage ? '#fff' : '#94a3b8'} style={{ marginBottom: '8px' }} />}
      {title && <div style={{ fontSize: '0.85rem', fontWeight: 700, color: dark || bgImage ? '#fff' : '#334155', marginBottom: '4px' }}>{title}</div>}
      {desc && <div style={{ fontSize: '0.7rem', color: dark || bgImage ? '#e2e8f0' : '#64748b', lineHeight: 1.4 }}>{desc}</div>}
    </div>
  </label>
);

const Pill = ({ label, active = false, onClick = () => {} }: any) => (
  <button 
    onClick={(e) => { e.preventDefault(); onClick(); }}
    style={{
      padding: '8px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
      background: active ? '#047857' : '#fff',
      color: active ? '#fff' : '#3f3f46',
      border: `1px solid ${active ? '#047857' : '#e4e4e7'}`,
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap'
    }}
  >
    {label}
  </button>
);

const FormInput = ({ placeholder, icon: Icon = null, type = 'text', value, onChange }: any) => (
  <div style={{ position: 'relative', width: '100%', marginBottom: '16px' }}>
    {Icon && <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}><Icon size={18} color="#94a3b8" /></div>}
    <input 
      type={type} placeholder={placeholder} value={value} onChange={onChange}
      style={{
        width: '100%', padding: `12px 16px 12px ${Icon ? '44px' : '16px'}`,
        border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '0.9rem', color: '#18181b', outline: 'none', boxSizing: 'border-box'
      }}
    />
  </div>
);

const FormTextarea = ({ placeholder, height = '80px', value, onChange }: any) => (
  <textarea 
    placeholder={placeholder} value={value} onChange={onChange}
    style={{
      width: '100%', padding: '12px 16px', minHeight: height, marginBottom: '16px',
      border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '0.9rem', color: '#18181b', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
      fontFamily: 'inherit'
    }}
  />
);

const SectionLabel = ({ text }: { text: string }) => (
  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#71717a', marginBottom: '8px', marginTop: '16px' }}>{text}</div>
);

const CreateEventForm = ({ onCancel }: { onCancel: () => void }) => {
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Customization States (for the enrollment form)
  const [formFields, setFormFields] = useState({
    fullName: true,
    artistName: true,
    whatsapp: true,
    email: true,
    instagram: true,
    actDetails: true,
    ageCheck: true,
    payment: true
  });
  
  const [artistTypes, setArtistTypes] = useState(['Music', 'Singing', 'Rap', 'Beatboxing', 'Poetry / Spoken Word', 'Stand-up Comedy', 'Dance', 'Storytelling', 'Other']);
  const [newArtistType, setNewArtistType] = useState('');

  const handleAddArtistType = () => {
    if (newArtistType.trim() && !artistTypes.includes(newArtistType.trim())) {
      setArtistTypes([...artistTypes, newArtistType.trim()]);
      setNewArtistType('');
    }
  };

  const removeArtistType = (type: string) => {
    setArtistTypes(artistTypes.filter(t => t !== type));
  };

  const handleBannerUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Image size must be less than 1MB to prevent server timeout. Please compress your image before uploading.");
        e.target.value = ''; // Reset input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Drop the Z and milliseconds so Spring Boot's LocalDateTime parser accepts it without errors
    const eventDate = dateStr && timeStr ? `${dateStr}T${timeStr}:00` : new Date().toISOString().slice(0, 19);
    const eventPayload = {
      name: title,
      venue: venue,
      eventDate: eventDate,
      price: price === '' ? 0 : Number(price),
      cat: 'EVENT',
      color: '#ffd700',
      description: 'Event created by admin',
      bannerUrl: bannerUrl,
      closed: false
      // In a real backend, we'd also send the formFields and artistTypes to save the custom form configuration
    };

    try {
      const response = await fetch(`${API_URL}/api/admin/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error saving event: ${errorText}`);
        throw new Error('Failed to save');
      }
      
      onCancel(); // Close form on success
      // Note: AdminDashboard should ideally refresh the list here
    } catch (e: any) {
      console.error(e);
      alert('Network or Server Error: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArray = (arr: string[], item: string, setArr: any) => {
    if (arr.includes(item)) setArr(arr.filter(i => i !== item));
    else setArr([...arr, item]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{ 
        background: '#fff', borderRadius: '16px', border: '1px solid #f4f4f5', 
        padding: '32px', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)',
        maxWidth: '900px', margin: '0 auto', color: '#18181b'
      }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>New ticketed event</h2>

      {/* SINGLE LANDSCAPE UPLOAD (as requested) */}
      <div style={{ marginBottom: '24px' }}>
        <UploadBox 
          icon={ImageIcon} 
          title={bannerUrl ? 'Change Banner' : '+ Upload Event Banner'} 
          desc="For best results across all cards and sliders, use a 1200x675px landscape image (16:9 ratio)." 
          height="200px"
          bgImage={bannerUrl}
          onChange={handleBannerUpload}
        />
      </div>

      <FormInput icon={Ticket} placeholder="Event title" value={title} onChange={(e: any) => setTitle(e.target.value)} />
      
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <FormInput icon={MapPin} placeholder="Glasswings Original — hosted by us" value={venue} onChange={(e: any) => setVenue(e.target.value)} />
        <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}><ChevronDown size={18} color="#94a3b8" /></div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <div>
          <SectionLabel text="Date" />
          <FormInput placeholder="" type="date" value={dateStr} onChange={(e: any) => setDateStr(e.target.value)} />
        </div>
        <div>
          <SectionLabel text="Start time (HH:MM)" />
          <FormInput placeholder="" type="time" value={timeStr} onChange={(e: any) => setTimeStr(e.target.value)} />
        </div>
        <div>
          <SectionLabel text="Price (₹)" />
          <FormInput placeholder="" type="number" value={price} onChange={(e: any) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} />
        </div>
      </div>

      <div style={{ height: '1px', background: '#e4e4e7', margin: '32px 0' }} />

      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Customize Enrollment Form</h2>
      <p style={{ fontSize: '0.85rem', color: '#71717a', marginBottom: '24px' }}>Toggle which fields artists need to fill out when enrolling for this specific event.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        {Object.entries({
          fullName: 'Full Name',
          artistName: 'Stage / Artist Name',
          whatsapp: 'WhatsApp Number',
          email: 'Email Address',
          instagram: 'Instagram Profile Link',
          actDetails: 'Your Set / Tracks (Act Details)',
          ageCheck: 'Age Check (21+ Declaration)',
          payment: 'Payment (UPI Upload)'
        }).map(([key, label]) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: '#18181b', padding: '12px', border: '1px solid #e4e4e7', borderRadius: '8px', cursor: 'pointer', background: formFields[key as keyof typeof formFields] ? '#f0fdf4' : '#fff', borderColor: formFields[key as keyof typeof formFields] ? '#16a34a' : '#e4e4e7' }}>
            <input 
              type="checkbox" 
              checked={formFields[key as keyof typeof formFields]}
              onChange={() => setFormFields(prev => ({ ...prev, [key]: !prev[key as keyof typeof formFields] }))}
              style={{ width: '18px', height: '18px', accentColor: '#047857' }} 
            />
            <span style={{ fontWeight: 600 }}>{label}</span>
          </label>
        ))}
      </div>

      <SectionLabel text="Configure Artist Types (Add/Remove)" />
      <p style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '16px' }}>Customize the options available in the 'Type of Artist' selection for this event.</p>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {artistTypes.map(type => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', background: '#fff', border: '1px solid #e4e4e7', fontSize: '0.8rem', fontWeight: 600 }}>
            {type}
            <Trash2 size={14} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => removeArtistType(type)} />
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        <input 
          type="text" placeholder="Add new artist type (e.g. Magician)" 
          value={newArtistType} onChange={e => setNewArtistType(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '0.85rem', flex: 1, outline: 'none' }}
          onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); handleAddArtistType(); } }}
        />
        <button onClick={(e) => { e.preventDefault(); handleAddArtistType(); }} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#047857', color: '#fff', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Add Type</button>
      </div>

      {/* Footer Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <button onClick={(e) => { e.preventDefault(); onCancel(); }} style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e4e4e7', background: '#fff', color: '#18181b', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Cancel</button>
        <button onClick={(e) => { e.preventDefault(); handleSubmit(); }} disabled={isSubmitting} style={{ padding: '16px', borderRadius: '12px', border: 'none', background: '#047857', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>{isSubmitting ? 'Creating...' : 'Create'}</button>
      </div>

    </motion.div>
  );
};

export default CreateEventForm;

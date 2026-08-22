import React, { useState, useEffect } from 'react';
import { GripVertical, X, CheckCircle, Smartphone, MapPin, AudioLines, RefreshCw, LogIn, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;

const HostDashboard: React.FC = () => {
  const [token, setToken] = useState(localStorage.getItem('host_token') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/host/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        localStorage.setItem('host_token', data.token);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Backend might be down.');
    }
    setLoading(false);
  };

  const fetchLeads = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Add a tiny artificial delay so the UI loader is visible to the user
      await new Promise(r => setTimeout(r, 800));
      const res = await fetch(`${API_URL}/api/host/stage-leads`);
      if (res.ok) {
        const data = await res.json();
        // Sort by lineupOrder, nulls at the end
        data.sort((a: any, b: any) => {
          if (a.lineupOrder === null && b.lineupOrder !== null) return 1;
          if (a.lineupOrder !== null && b.lineupOrder === null) return -1;
          if (a.lineupOrder !== null && b.lineupOrder !== null) return a.lineupOrder - b.lineupOrder;
          return a.id - b.id;
        });
        setLeads(data);
      } else {
        if(res.status === 401) {
          setToken('');
          localStorage.removeItem('host_token');
        }
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchLeads();
    }
  }, [token]);

  // Drag and Drop Logic
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newLeads = [...leads];
    const draggedItem = newLeads[draggedIndex];
    newLeads.splice(draggedIndex, 1);
    newLeads.splice(dropIndex, 0, draggedItem);
    
    setLeads(newLeads);
    setDraggedIndex(null);

    // Save order to backend
    const leadIds = newLeads.map(l => l.id);
    try {
      await fetch(`${API_URL}/api/host/leads/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadIds)
      });
    } catch (err) {
      console.error("Failed to save order", err);
    }
  };

  if (!token) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#18181b', padding: '3rem', borderRadius: '16px', border: '1px solid #27272a', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: '#ffd700', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <LogIn size={28} color="#000" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>Host Access</h2>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '2rem' }}>Enter the host password to manage the stage.</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '1rem', background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', outline: 'none', marginBottom: '1rem' }}
            />
            {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'left', marginBottom: '1rem' }}>{error}</p>}
            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '1rem', background: '#ffd700', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: '0.2s', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Authenticating...' : 'Login to Dashboard'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Stage Control</h1>
          <p style={{ color: '#a1a1aa', marginTop: '0.5rem' }}>Drag and drop to reorder the live lineup. Click for details.</p>
        </div>
        <button 
          onClick={fetchLeads}
          style={{ background: '#27272a', border: 'none', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '300px' }}>
        
        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: -20,
                background: 'rgba(9, 9, 11, 0.5)',
                backdropFilter: 'blur(8px)',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '16px'
              }}
            >
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ width: '50px', height: '50px', border: '4px solid rgba(255, 215, 0, 0.2)', borderTopColor: '#ffd700', borderRadius: '50%' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {leads.map((lead, index) => (
            <motion.div 
              layout
              key={lead.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e: any) => handleDragOver(e, index)}
              onDrop={(e: any) => handleDrop(e, index)}
              onClick={() => setSelectedLead(lead)}
              style={{ 
                background: draggedIndex === index ? '#27272a' : '#18181b', 
                border: '1px solid #27272a', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                cursor: 'grab',
                boxShadow: draggedIndex === index ? '0 10px 20px rgba(0,0,0,0.5)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#27272a', borderRadius: '6px', color: '#a1a1aa', fontWeight: 800 }}>
                {index + 1}
              </div>
              
              <GripVertical size={20} color="#52525b" />
              
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{lead.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '4px' }}>{lead.instagramLink || 'No Instagram'}</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#eab308' }}>{lead.performanceTrack || 'Track Pending'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '4px' }}>Stage Ready</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {leads.length === 0 && !loading && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#71717a', background: '#18181b', borderRadius: '12px', border: '1px dashed #27272a' }}>
            No stage-ready leads available.
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedLead(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              style={{ position: 'relative', width: '100%', maxWidth: '500px', background: '#18181b', borderRadius: '24px', overflow: 'hidden', border: '1px solid #27272a' }}
            >
              <div style={{ padding: '2rem', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ padding: '4px 8px', background: '#dcfce7', color: '#16a34a', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>STAGE READY</span>
                  </div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>{selectedLead.name}</h3>
                  <p style={{ color: '#eab308', margin: '4px 0 0 0', fontWeight: 600 }}>{selectedLead.instagramLink}</p>
                </div>
                <button onClick={() => setSelectedLead(null)} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>
              
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Performance Track</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><AudioLines size={18} color="#eab308" /> {selectedLead.performanceTrack || 'Not specified'}</div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Contact Info</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}><Smartphone size={16} color="#a1a1aa" /> {selectedLead.phone}</div>
                    <div style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>{selectedLead.email}</div>
                  </div>
                </div>

                {selectedLead.selfIntro && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Artist Intro</div>
                    <div style={{ padding: '1rem', background: '#09090b', borderRadius: '8px', fontSize: '0.9rem', color: '#e4e4e7', lineHeight: '1.5' }}>
                      "{selectedLead.selfIntro}"
                    </div>
                  </div>
                )}

                {selectedLead.audioTrackUrl && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Audio Track</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <audio controls src={selectedLead.audioTrackUrl} style={{ flex: 1, height: '40px' }} />
                      <a 
                        href={selectedLead.audioTrackUrl} 
                        download 
                        title="Download Track"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: '#27272a', borderRadius: '8px', color: '#fff', textDecoration: 'none' }}
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HostDashboard;

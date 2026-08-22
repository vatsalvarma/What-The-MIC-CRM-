import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Calendar, Users, BookOpen, HelpCircle, 
  Plus, Download, TrendingUp, BarChart3, PieChart, 
  Activity, CheckCircle2, MessageSquare, MoreHorizontal,
  ChevronDown, Ticket, RefreshCw, Menu, X
} from 'lucide-react';
import html2canvas from 'html2canvas';
import OverviewDashboard from '../components/OverviewDashboard';
import CreateEventForm from '../components/CreateEventForm';
import TicketTemplate from '../components/TicketTemplate';

const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;

// ==========================================
// SUBCOMPONENTS
// ==========================================
const SidebarItem = ({ icon: Icon, label, active = false, onClick }: any) => (
  <div 
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '1rem', padding: '12px 16px',
      borderRadius: '8px', cursor: 'pointer',
      background: active ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
      color: active ? '#ffd700' : '#94a3b8',
      fontWeight: active ? 600 : 500,
      marginBottom: '4px',
      transition: 'all 0.2s ease',
      borderLeft: active ? '3px solid #ffd700' : '3px solid transparent'
    }}
  >
    <Icon size={20} color={active ? '#ffd700' : '#94a3b8'} />
    <span style={{ flex: 1 }}>{label}</span>
  </div>
);

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const duration = 1000;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  return <span>{displayValue}</span>;
};

const MetricCard = ({ title, mainValue, subText, icon: Icon, delay = 0, multiStats = null }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(255, 215, 0, 0.15)' }}
    style={{
      background: '#0a0a0a',
      border: '1px solid #27272a',
      borderRadius: '12px',
      padding: '1.5rem',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
      {Icon && <Icon size={100} color="#ffd700" />}
    </div>
    
    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '1rem', zIndex: 10 }}>{title}</h3>
    
    {multiStats ? (
      <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
        {multiStats.map((stat: any, i: number) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffd700', lineHeight: 1 }}>{stat.value}</span>
            <span style={{ fontSize: '0.7rem', color: '#71717a', marginTop: '4px' }}>{stat.label}</span>
          </div>
        ))}
      </div>
    ) : (
      <div style={{ zIndex: 10 }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffd700', lineHeight: 1, marginBottom: '0.5rem' }}>{mainValue}</div>
        <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{subText}</div>
      </div>
    )}
  </motion.div>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING_APPROVAL': return { bg: '#e0e7ff', text: '#4338ca' };
    case 'APPROVED': return { bg: '#dcfce7', text: '#166534' };
    case 'STAGE_READY': return { bg: '#fce7f3', text: '#9d174d' }; // Pink/Magenta for Stage Ready
    case 'REJECTED': return { bg: '#fee2e2', text: '#991b1b' };
    default: return { bg: '#f3f4f6', text: '#374151' };
  }
};

const LeadRow = ({ lead, index }: any) => {
  const colors = getStatusColor(lead.status);
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
      style={{
        display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1.5fr 1fr 1fr',
        padding: '16px 20px',
        borderBottom: '1px solid #f4f4f5',
        alignItems: 'center',
        fontSize: '0.85rem',
        color: '#3f3f46',
        background: index % 2 === 0 ? '#fafafa' : '#ffffff',
        cursor: 'pointer',
      }}
    >
      <div style={{ color: '#18181b' }}>{lead.name}</div>
      <div style={{ color: '#71717a' }}>{lead.email}</div>
      <div>
        <span style={{ 
          background: colors.bg, color: colors.text, padding: '4px 10px', 
          borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', gap: '4px'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.text }} />
          {lead.status === 'PENDING_APPROVAL' ? 'PENDING' : lead.status}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.6rem', color: '#71717a' }}>
          {lead.owner ? lead.owner.substring(0, 2).toUpperCase() : 'WTM'}
        </div>
        {lead.owner || 'System'}
      </div>
      <div style={{ color: '#71717a' }}>{lead.source || 'Form'}</div>
      <div style={{ color: '#71717a' }}>{lead.created || new Date().toLocaleDateString()}</div>
    </motion.div>
  );
};

const ActivityItem = ({ activity, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
    style={{
      display: 'flex', gap: '12px', padding: '16px 0',
      borderBottom: '1px solid #f4f4f5'
    }}
  >
    <div style={{ 
      width: '32px', height: '32px', borderRadius: '8px', 
      background: '#fafafa', border: '1px solid #e4e4e7',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <MessageSquare size={14} color="#71717a" />
    </div>
    <div>
      <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#18181b', marginBottom: '4px' }}>
        {activity.text}
      </div>
      <div style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
        {activity.time}
      </div>
    </div>
  </motion.div>
);

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'events', icon: Calendar, label: 'Events' },
    { id: 'leads', icon: Users, label: 'Leads' },
    { id: 'offline', icon: Plus, label: 'Offline Leads' },
    { id: 'bookings', icon: Ticket, label: 'Bookings' },
    { id: 'offline-booking', icon: Plus, label: 'Offline Booking' },
    { id: 'host', icon: CheckCircle2, label: 'Host Access' },
    { id: 'faqs', icon: HelpCircle, label: 'FAQs' },
  ];

  const recentLeads = [
    { name: 'John Smith', email: 'john.smith@techcorp.com', status: 'New', owner: 'Demo Sales', source: 'Form', created: '10/25/2026' },
    { name: 'Sarah Johnson', email: 'sarah.j@innovate.io', status: 'New', owner: 'Demo Sales', source: 'Manual', created: '10/25/2026' },
    { name: 'James Anderson', email: 'james.a@finance.com', status: 'New', owner: 'Demo Sales', source: 'Form', created: '10/24/2026' },
    { name: 'Emily Rodriguez', email: 'emily.r@designco.co', status: 'New', owner: 'Demo Sales', source: 'Form', created: '10/24/2026' },
    { name: 'Michael Chen', email: 'm.chen@startup.net', status: 'New', owner: 'Demo Sales', source: 'Chat', created: '10/23/2026' },
  ];

  const activities = [
    { text: 'John Smith initiated chat', time: 'less than a minute ago' },
    { text: 'James Anderson initiated chat', time: 'less than a minute ago' },
    { text: 'Emily Rodriguez initiated chat', time: 'less than a minute ago' },
    { text: 'Sarah Johnson initiated chat', time: 'less than a minute ago' },
  ];

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [adminEvents, setAdminEvents] = useState<any[]>([]);
  const [adminLeads, setAdminLeads] = useState<any[]>([]);
  const [adminBookings, setAdminBookings] = useState<any[]>([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);

  // Offline feature state
  const [offlineSelectedEvent, setOfflineSelectedEvent] = useState<any | null>(null);
  const [offlineForm, setOfflineForm] = useState({ name: '', phone: '', instagramLink: '', paymentScreenshotUrl: '' });
  const [offlineLoading, setOfflineLoading] = useState(false);

  // Offline Booking feature state
  const [offlineBookingSelectedEvent, setOfflineBookingSelectedEvent] = useState<any | null>(null);
  const [offlineBookingForm, setOfflineBookingForm] = useState({ customerName: '', customerPhone: '', customerEmail: 'offline@wtm.com', quantity: 1, paymentScreenshotUrl: '' });
  const [offlineBookingLoading, setOfflineBookingLoading] = useState(false);

  // Host Access Feature State
  const [hostPassLoading, setHostPassLoading] = useState(false);
  const [hostNewPass, setHostNewPass] = useState('');

  const handleResetHostPassword = async () => {
    setHostPassLoading(true);
    setHostNewPass('');
    // Generate random password
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let newPass = '';
    for (let i = 0; i < 10; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    try {
      const res = await fetch(`${API_URL}/api/admin/leads/host/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPass })
      });
      if (res.ok) {
        // Mock a small delay for animation
        setTimeout(() => {
          setHostNewPass(newPass);
          setHostPassLoading(false);
        }, 1500);
      } else {
        setHostPassLoading(false);
        alert("Failed to reset password");
      }
    } catch (e) {
      setHostPassLoading(false);
      console.error(e);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/events`);
      if (res.ok) {
        const data = await res.json();
        setAdminEvents(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/bookings`);
      if (res.ok) {
        const data = await res.json();
        setAdminBookings(data.sort((a: any, b: any) => b.id - a.id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/leads`);
      if (res.ok) {
        const data = await res.json();
        // Sort descending by ID to ensure newest are always at top
        setAdminLeads(data.sort((a: any, b: any) => b.id - a.id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (!isCreateEventOpen) {
      fetchEvents();
      fetchLeads();
      fetchBookings();
    }
  }, [isCreateEventOpen]);

  const submitOfflineLead = async () => {
    if (!offlineSelectedEvent || !offlineForm.name || !offlineForm.phone) {
      alert("Please fill out name and phone number.");
      return;
    }
    setOfflineLoading(true);
    try {
      const payload = {
        name: offlineForm.name,
        phone: offlineForm.phone,
        email: 'offline@wtm.com', // dummy
        age: 18, // dummy
        instagramLink: offlineForm.instagramLink,
        paymentScreenshotUrl: offlineForm.paymentScreenshotUrl,
        event: { id: offlineSelectedEvent.id }
      };
      
      const res = await fetch(`${API_URL}/api/public/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert("Offline Lead Generated Successfully!");
        setOfflineForm({ name: '', phone: '', instagramLink: '', paymentScreenshotUrl: '' });
        setOfflineSelectedEvent(null);
        fetchLeads(); // refresh leads
      } else {
        alert("Failed to submit lead.");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting lead.");
    } finally {
      setOfflineLoading(false);
    }
  };

  const submitOfflineBooking = async () => {
    if (!offlineBookingSelectedEvent || !offlineBookingForm.customerName || !offlineBookingForm.customerPhone) {
      alert("Please fill out name and phone number.");
      return;
    }
    setOfflineBookingLoading(true);
    try {
      const payload = {
        customerName: offlineBookingForm.customerName,
        customerPhone: offlineBookingForm.customerPhone,
        customerEmail: offlineBookingForm.customerEmail,
        quantity: offlineBookingForm.quantity,
        paymentScreenshotUrl: offlineBookingForm.paymentScreenshotUrl,
        event: { id: offlineBookingSelectedEvent.id },
        status: 'APPROVED' // Auto-approve offline walk-ins
      };
      
      const res = await fetch(`${API_URL}/api/public/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert("Offline Booking Generated Successfully!");
        setOfflineBookingForm({ customerName: '', customerPhone: '', customerEmail: 'offline@wtm.com', quantity: 1, paymentScreenshotUrl: '' });
        setOfflineBookingSelectedEvent(null);
        fetchBookings(); // refresh bookings
      } else {
        alert("Failed to submit booking.");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting booking.");
    } finally {
      setOfflineBookingLoading(false);
    }
  };

  const updateBookingStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/bookings/${id}/status?status=${status}`, { method: 'PUT' });
      if (res.ok) {
        setAdminBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
        
        if (status === 'APPROVED' && selectedBooking) {
          const ticketElement = document.getElementById('ticket-template');
          if (ticketElement) {
            ticketElement.style.display = 'flex';
            const canvas = await html2canvas(ticketElement, { backgroundColor: '#0a0a0a', scale: 2 });
            ticketElement.style.display = 'none';

            canvas.toBlob(async (blob) => {
              if (blob) {
                try {
                  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
                  alert('Ticket generated and copied to clipboard! Redirecting to WhatsApp...');
                  let phone = selectedBooking.customerPhone.replace(/\D/g, '');
                  if (phone.length === 10) phone = '91' + phone;
                  const message = encodeURIComponent(`Hi ${selectedBooking.customerName},\n\nYour booking for *${selectedBooking.event?.name}* is confirmed!\n\nI have attached your official digital ticket. See you there!`);
                  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                } catch (err) {
                  console.error("Clipboard error:", err);
                  alert("Failed to copy image to clipboard.");
                }
              }
            }, 'image/png');
          }
        }
        
        setSelectedBooking(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateLeadStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/leads/${id}/status?status=${status}`, { method: 'PUT' });
      if (res.ok) {
        setAdminLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        
        if (status === 'APPROVED' && selectedLead?.phone) {
          const msg = encodeURIComponent(`Hey ${selectedLead.name}! You've been approved to perform at ${selectedLead.event?.name || 'our upcoming event'}. Please fill this form to confirm your spot: http://localhost:5173/form2/${id}`);
          window.open(`https://wa.me/${selectedLead.phone}?text=${msg}`, '_blank');
        }
        
        setSelectedLead(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleEventComplete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/events/${id}/complete`, { method: 'PUT' });
      if (res.ok) {
        setAdminEvents(prev => prev.map(e => e.id === id ? { ...e, closed: true } : e));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteEvent = async (id: number) => {
    setDeletingEventId(id);
    try {
      const res = await fetch(`${API_URL}/api/admin/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAdminEvents(prev => prev.filter(e => e.id !== id));
      } else {
        alert("Failed to delete event. Please try again.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingEventId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', background: '#000', color: '#ffd700', fontFamily: '"Inter", sans-serif' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#111', padding: '40px', borderRadius: '16px', border: '1px solid #333', textAlign: 'center', width: '350px' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#000' }}>W</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Admin Access</h2>
          <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '24px' }}>Enter the master password to continue</p>
          <input 
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
            onKeyDown={e => { if(e.key === 'Enter' && passwordInput === 'admin123') setIsAuthenticated(true); }}
            style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', marginBottom: '16px', boxSizing: 'border-box', outline: 'none' }}
          />
          <button 
            onClick={() => { if(passwordInput === 'admin123') setIsAuthenticated(true); else alert('Incorrect password'); }}
            style={{ width: '100%', padding: '12px', background: '#ffd700', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
          >
            Unlock Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', background: '#f8fafc', overflow: 'hidden', fontFamily: '"Inter", sans-serif', position: 'relative' }}>
      
      {/* MOBILE BACKDROP */}
      {isMobile && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}

      {/* LEFT SIDEBAR (Black & Gold) */}
      <aside style={{ 
        width: '260px', background: '#000000', borderRight: '1px solid #27272a', 
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        position: isMobile ? 'fixed' : 'relative',
        left: isMobile ? (isSidebarOpen ? 0 : '-100%') : 0,
        top: 0, bottom: 0, zIndex: 50,
        transition: 'left 0.3s ease'
      }}>
        {/* LOGO AREA */}
        <div style={{ padding: '2rem 1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#000', fontWeight: 900, fontFamily: '"Outfit", sans-serif' }}>M</span>
            </div>
            <h1 style={{ fontFamily: '"Outfit", sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '1px' }}>
              Admin<span style={{ color: '#ffd700' }}>.</span>
            </h1>
          </div>
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <X size={24} />
            </button>
          )}
        </div>
        
        {/* NAVIGATION */}
        <nav style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '4px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#52525b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', paddingLeft: '16px' }}>
            Menu
          </div>
          {navItems.map(item => (
            <SidebarItem 
              key={item.id}
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.id && !isCreateEventOpen} 
              onClick={() => {
                setActiveTab(item.id);
                setIsCreateEventOpen(false);
                if (isMobile) setIsSidebarOpen(false);
              }}
            />
          ))}
        </nav>

        {/* BOTTOM PROFILE */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
            AD
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>System Admin</div>
            <div style={{ color: '#71717a', fontSize: '0.75rem' }}>admin@themic.com</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#ffffff' }}>
        
        {/* TOP HEADER */}
        <header style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: isMobile ? '16px 20px' : '24px 32px', borderBottom: '1px solid #f4f4f5', background: '#ffffff' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
                <Menu size={24} color="#18181b" />
              </button>
            )}
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 800, color: '#18181b', margin: 0, fontFamily: '"Outfit", sans-serif' }}
            >
              {navItems.find(i => i.id === activeTab)?.label} Dashboard
            </motion.h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateEventOpen(true)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                background: '#000000', color: '#ffd700', 
                padding: isMobile ? '8px 12px' : '10px 20px', borderRadius: '30px', 
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                border: '1px solid #ffd700',
                boxShadow: '0 4px 15px -3px rgba(255, 215, 0, 0.15)'
              }}
            >
              <Plus size={16} /> {!isMobile && 'Create Event'}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: '#18181b' }}
              whileTap={{ scale: 0.98 }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                background: '#000000', color: '#ffffff', 
                padding: isMobile ? '8px 12px' : '10px 20px', borderRadius: '30px', 
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                border: '1px solid #27272a'
              }}
            >
              <Download size={16} /> {!isMobile && 'Import CSV'}
            </motion.button>
          </div>
        </header>

        {/* SCROLLABLE VIEWPORT */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: isMobile ? '16px' : '32px' }}>
          
          {isCreateEventOpen ? (
            <AnimatePresence mode="wait">
              <CreateEventForm onCancel={() => setIsCreateEventOpen(false)} />
            </AnimatePresence>
          ) : activeTab === 'leads' ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key="leads-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ maxWidth: '1400px', margin: '0 auto' }}
              >
                
                {/* SECTION 1: METRICS */}
                <div style={{ marginBottom: '1.5rem', minHeight: '160px' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#18181b', marginBottom: '1rem' }}>Leads Overview</h2>
                  {isLoadingLeads ? (
                    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        style={{ width: '30px', height: '30px', border: '3px solid #e4e4e7', borderTopColor: '#3b82f6', borderRadius: '50%' }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)', gap: '16px' }}>
                      <MetricCard 
                        delay={0.1} icon={TrendingUp}
                        title="Total Leads" mainValue={<AnimatedNumber value={adminLeads.length} />} subText="All time applications" 
                      />
                      <MetricCard 
                        delay={0.2} icon={PieChart}
                        title="Pending Leads" mainValue={<AnimatedNumber value={adminLeads.filter(l => l.status === 'PENDING_APPROVAL').length} />} subText="Awaiting review" 
                      />
                      <MetricCard 
                        delay={0.3} icon={CheckCircle2}
                        title="Approved Leads" mainValue={<AnimatedNumber value={adminLeads.filter(l => l.status === 'APPROVED').length} />} subText="Accepted artists" 
                      />
                      <MetricCard 
                        delay={0.4} icon={Activity}
                        title="New Stage Leads" mainValue={<AnimatedNumber value={adminLeads.filter(l => l.status === 'STAGE_READY').length} />} subText="Recent onboarding" 
                      />
                      <MetricCard 
                        delay={0.5} icon={BarChart3}
                        title="Total Stage Leads" mainValue={<AnimatedNumber value={adminLeads.filter(l => l.status === 'STAGE_READY').length} />} subText="Fully onboarded" 
                      />
                    </div>
                  )}
                </div>

                {/* SECTION 2: LEADS TABLE & ACTIVITY */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 350px', gap: '24px' }}>
                  
                  {/* LEFT: RECENT LEADS TABLE */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f4f4f5', padding: '24px', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)', overflowX: 'auto' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', minWidth: isMobile ? '800px' : 'auto' }}>
                      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#18181b', margin: 0 }}>Recent Leads</h2>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3b82f6', cursor: 'pointer' }}>View All</span>
                    </div>

                    <div style={{ minWidth: isMobile ? '800px' : 'auto' }}>
                      {/* Table Header */}
                      <div style={{ 
                        display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1fr', 
                        padding: '0 20px 12px 20px', 
                        borderBottom: '1px solid #e4e4e7',
                        fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.5px'
                      }}>
                        <div>Name</div>
                        <div>Instagram</div>
                      <div>WhatsApp</div>
                      <div>Event</div>
                      <div>Status</div>
                    </div>

                    {/* Table Body */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {isLoadingLeads ? (
                        <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
                          <motion.div 
                            animate={{ rotate: 360 }} 
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            style={{ width: '30px', height: '30px', border: '3px solid #f4f4f5', borderTopColor: '#3b82f6', borderRadius: '50%' }}
                          />
                        </div>
                      ) : adminLeads.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: '#a1a1aa' }}>No leads found.</div>
                      ) : (
                        adminLeads.map((lead, i) => (
                          <motion.div 
                            key={lead.id} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 + (i * 0.05) }}
                            onClick={() => setSelectedLead(lead)}
                            style={{
                              display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1fr', 
                              padding: '16px 20px', alignItems: 'center', cursor: 'pointer',
                              borderBottom: '1px solid #f4f4f5', transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ color: '#18181b' }}>{lead.name}</div>
                            <div style={{ color: '#71717a', fontSize: '0.85rem' }}>
                              {lead.instagramLink ? <a href={lead.instagramLink} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{color: '#E1306C'}}>View Profile</a> : 'N/A'}
                            </div>
                            <div style={{ color: '#71717a', fontSize: '0.85rem' }}>
                              <a href={`https://wa.me/${lead.phone}`} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{color: '#25D366'}}>{lead.phone}</a>
                            </div>
                            <div style={{ color: '#71717a', fontSize: '0.85rem' }}>{lead.event ? lead.event.name : 'Unknown'}</div>
                            <div>
                              <span style={{ 
                                padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                                background: getStatusColor(lead.status).bg,
                                color: getStatusColor(lead.status).text
                              }}>
                                {lead.status === 'PENDING_APPROVAL' ? 'PENDING' : lead.status}
                              </span>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                  </motion.div>

                  {/* RIGHT: ACTIVITY FEED -> STAGE LEADS */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f4f4f5', padding: '24px', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#18181b', margin: 0 }}>Stage Leads</h2>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3b82f6', cursor: 'pointer' }}>View All</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {adminLeads.filter(l => l.status === 'STAGE_READY').length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#a1a1aa', padding: '20px' }}>No stage leads yet.</div>
                      ) : (
                        adminLeads.filter(l => l.status === 'STAGE_READY').map((lead, i) => (
                          <motion.div 
                            key={lead.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            onClick={() => setSelectedLead(lead)}
                            style={{
                              padding: '16px', borderBottom: '1px solid #f4f4f5',
                              cursor: 'pointer', transition: 'background 0.2s',
                              display: 'flex', gap: '12px', alignItems: 'center'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                              {lead.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ color: '#18181b', fontSize: '0.9rem' }}>{lead.name}</div>
                              <div style={{ color: '#71717a', fontSize: '0.8rem' }}>{lead.event?.name} • 🎵 Audio Track Ready</div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>

                </div>

              </motion.div>
            </AnimatePresence>
          ) : activeTab === 'overview' ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key="overview-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <OverviewDashboard />
              </motion.div>
            </AnimatePresence>
          ) : activeTab === 'events' ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key="events-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ maxWidth: '1200px', margin: '0 auto' }}
              >
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f4f4f5', padding: '24px', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181b', margin: 0 }}>Manage Events</h2>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#71717a' }}>{adminEvents.length} Events Total</span>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <div style={{ minWidth: isMobile ? '800px' : 'auto' }}>
                      {/* Table Header */}
                      <div style={{ 
                        display: 'grid', gridTemplateColumns: '3fr 3fr 2fr 1fr', 
                        padding: '0 20px 12px 20px', 
                        borderBottom: '1px solid #e4e4e7',
                        fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.5px'
                      }}>
                        <div>Event Name</div>
                        <div>Venue</div>
                        <div>Category & Price</div>
                        <div style={{ textAlign: 'right' }}>Actions</div>
                      </div>

                      {/* Table Body */}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {adminEvents.length > 0 ? (
                      adminEvents.map((event, index) => (
                        <motion.div 
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          style={{
                            display: 'grid', gridTemplateColumns: '3fr 3fr 2fr 1fr',
                            padding: '16px 20px',
                            borderBottom: '1px solid #f4f4f5',
                            alignItems: 'center',
                            fontSize: '0.9rem',
                            background: event.completed ? '#f9fafb' : (index % 2 === 0 ? '#fafafa' : '#ffffff'),
                            opacity: event.completed ? 0.6 : 1,
                          }}
                        >
                          <div style={{ fontWeight: 700, color: '#18181b', textDecoration: event.closed ? 'line-through' : 'none' }}>
                            {event.name}
                          </div>
                          <div style={{ color: '#71717a', textDecoration: event.closed ? 'line-through' : 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} /> 
                            {new Date(event.eventDate).toLocaleDateString()} &middot; {event.venue}
                          </div>
                          <div>
                            <span style={{ 
                              background: `${event.color}15`, color: event.color, padding: '4px 10px', 
                              borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800,
                              display: 'inline-flex', alignItems: 'center',
                              textDecoration: event.closed ? 'line-through' : 'none'
                            }}>
                              {event.cat}
                            </span>
                            <span style={{ marginLeft: '10px', fontWeight: 600, color: '#3f3f46', textDecoration: event.closed ? 'line-through' : 'none' }}>₹{event.price}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleEventComplete(event.id)}
                              title="Mark as complete"
                              style={{ 
                                background: event.closed ? '#16a34a' : '#f4f4f5', 
                                color: event.closed ? '#fff' : '#71717a', 
                                border: 'none', width: '32px', height: '32px', borderRadius: '8px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
                              }}
                            >
                              <CheckCircle2 size={16} />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: deletingEventId === event.id ? 1 : 1.1, backgroundColor: deletingEventId === event.id ? '#f4f4f5' : '#fee2e2', color: deletingEventId === event.id ? '#71717a' : '#ef4444' }}
                              whileTap={{ scale: deletingEventId === event.id ? 1 : 0.9 }}
                              onClick={() => {
                                if (deletingEventId !== event.id) {
                                  deleteEvent(event.id);
                                }
                              }}
                              title="Delete event"
                              style={{ 
                                background: '#f4f4f5', color: '#71717a', 
                                border: 'none', width: '32px', height: '32px', borderRadius: '8px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: deletingEventId === event.id ? 'default' : 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              {deletingEventId === event.id ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                  <RefreshCw size={14} />
                                </motion.div>
                              ) : (
                                <span style={{ fontWeight: 800 }}>X</span>
                              )}
                            </motion.button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div style={{ padding: '24px', textAlign: 'center', color: '#a1a1aa' }}>No events found.</div>
                    )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : activeTab === 'bookings' ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key="bookings-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ maxWidth: '1400px', margin: '0 auto' }}
              >
                
                {/* SECTION 1: METRICS */}
                <div style={{ marginBottom: '1.5rem', minHeight: '160px' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#18181b', marginBottom: '1rem' }}>Bookings Overview</h2>
                  {isLoadingBookings ? (
                    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        style={{ width: '30px', height: '30px', border: '3px solid #e4e4e7', borderTopColor: '#3b82f6', borderRadius: '50%' }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
                      <MetricCard 
                        delay={0.1} icon={Ticket}
                        title="Total Bookings" mainValue={<AnimatedNumber value={adminBookings.length} />} subText="All time tickets sold" 
                      />
                      <MetricCard 
                        delay={0.2} icon={PieChart}
                        title="Pending Bookings" mainValue={<AnimatedNumber value={adminBookings.filter(b => b.status === 'PENDING_APPROVAL').length} />} subText="Awaiting review" 
                      />
                      <MetricCard 
                        delay={0.3} icon={CheckCircle2}
                        title="Accepted Bookings" mainValue={<AnimatedNumber value={adminBookings.filter(b => b.status === 'APPROVED').length} />} subText="Verified payments" 
                      />
                    </div>
                  )}
                </div>

                {/* SECTION 2: CONTENT SPLIT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* RECENT BOOKINGS TABLE */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f4f4f5', padding: '24px', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#18181b', margin: 0 }}>Recent Bookings</h2>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3b82f6', cursor: 'pointer' }}>View All Bookings</span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <div style={{ minWidth: isMobile ? '800px' : 'auto' }}>
                        <div style={{ 
                          display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', 
                          padding: '0 20px 12px 20px', 
                          borderBottom: '1px solid #e4e4e7',
                      fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.5px'
                    }}>
                      <div>Name</div>
                      <div>Contact</div>
                      <div>Event</div>
                      <div>Status</div>
                      <div>Date</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {adminBookings.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: '#a1a1aa' }}>No bookings found.</div>
                      ) : (
                        adminBookings.map((booking, i) => (
                          <motion.div 
                            key={booking.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                            onClick={() => setSelectedBooking(booking)}
                            style={{
                              display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                              padding: '16px 20px',
                              borderBottom: '1px solid #f4f4f5',
                              alignItems: 'center',
                              fontSize: '0.85rem',
                              color: '#3f3f46',
                              background: i % 2 === 0 ? '#fafafa' : '#ffffff',
                              cursor: 'pointer',
                            }}
                          >
                            <div style={{ fontWeight: 600, color: '#18181b' }}>{booking.customerName}</div>
                            <div style={{ color: '#71717a' }}>{booking.customerPhone} <br/> {booking.customerEmail}</div>
                            <div style={{ color: '#71717a', fontWeight: 500 }}>{booking.event?.name}</div>
                            <div>
                              <span style={{ 
                                background: booking.status === 'APPROVED' ? '#dcfce7' : booking.status === 'REJECTED' ? '#fee2e2' : '#fef9c3', 
                                color: booking.status === 'APPROVED' ? '#166534' : booking.status === 'REJECTED' ? '#991b1b' : '#854d0e', 
                                padding: '4px 10px', 
                                borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700,
                              }}>
                                {booking.status === 'PENDING_APPROVAL' ? 'PENDING' : booking.status}
                              </span>
                            </div>
                            <div style={{ color: '#a1a1aa' }}>
                              {new Date(booking.bookingTime).toLocaleDateString()}
                            </div>
                          </motion.div>
                        ))
                      )}
                      </div>
                    </div>
                  </div>
                  </motion.div>

                </div>

              </motion.div>
            </AnimatePresence>
          ) : activeTab === 'offline' ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key="offline-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ background: '#ffffff', borderRadius: '16px', minHeight: '600px', padding: '32px' }}
              >
                {!offlineSelectedEvent ? (
                  <>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#18181b', marginBottom: '1.5rem' }}>Select Event for Offline Enrollment</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                      {adminEvents.map(event => (
                        <div 
                          key={event.id}
                          onClick={() => setOfflineSelectedEvent(event)}
                          style={{ 
                            border: '1px solid #e4e4e7', borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa'
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#ffd700'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = '#e4e4e7'}
                        >
                          <div style={{ width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                            <img src={event.bannerUrl || 'https://images.unsplash.com/photo-1540039155733-d7696d54af58?auto=format&fit=crop&q=80'} alt={event.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <h3 style={{ margin: '0 0 8px 0', color: '#18181b', fontSize: '1.1rem', fontWeight: 700 }}>{event.name}</h3>
                          <p style={{ margin: 0, color: '#71717a', fontSize: '0.85rem' }}>{new Date(event.eventDate).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                      <button 
                        onClick={() => setOfflineSelectedEvent(null)}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e4e4e7', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
                      >
                        ← Back
                      </button>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#18181b', margin: 0 }}>Enroll for {offlineSelectedEvent.name}</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#3f3f46', marginBottom: '8px' }}>Full Name *</label>
                        <input type="text" value={offlineForm.name} onChange={e => setOfflineForm({...offlineForm, name: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e4e4e7', borderRadius: '8px', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#3f3f46', marginBottom: '8px' }}>WhatsApp Number *</label>
                        <input type="text" value={offlineForm.phone} onChange={e => setOfflineForm({...offlineForm, phone: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e4e4e7', borderRadius: '8px', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#3f3f46', marginBottom: '8px' }}>Instagram Link</label>
                        <input type="text" value={offlineForm.instagramLink} onChange={e => setOfflineForm({...offlineForm, instagramLink: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e4e4e7', borderRadius: '8px', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#3f3f46', marginBottom: '8px' }}>Payment Screenshot</label>
                        <input type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setOfflineForm({...offlineForm, paymentScreenshotUrl: reader.result as string});
                            reader.readAsDataURL(file);
                          }
                        }} style={{ width: '100%', padding: '12px', border: '1px solid #e4e4e7', borderRadius: '8px', outline: 'none', background: '#fafafa' }} />
                      </div>
                      <button 
                        onClick={submitOfflineLead}
                        disabled={offlineLoading}
                        style={{ width: '100%', padding: '16px', background: '#ffd700', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', marginTop: '16px', cursor: offlineLoading ? 'not-allowed' : 'pointer', opacity: offlineLoading ? 0.7 : 1 }}
                      >
                        {offlineLoading ? 'Enrolling...' : 'Enroll Lead'}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : activeTab === 'offline-booking' ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key="offline-booking-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ background: '#ffffff', borderRadius: '16px', minHeight: '600px', padding: '32px' }}
              >
                {!offlineBookingSelectedEvent ? (
                  <>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#18181b', marginBottom: '1.5rem' }}>Select Event for Offline Booking</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                      {adminEvents.map(event => (
                        <div 
                          key={event.id}
                          onClick={() => setOfflineBookingSelectedEvent(event)}
                          style={{ 
                            border: '1px solid #e4e4e7', borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa'
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#ffd700'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = '#e4e4e7'}
                        >
                          <div style={{ width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                            <img src={event.bannerUrl || 'https://images.unsplash.com/photo-1540039155733-d7696d54af58?auto=format&fit=crop&q=80'} alt={event.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <h3 style={{ margin: '0 0 8px 0', color: '#18181b', fontSize: '1.1rem', fontWeight: 700 }}>{event.name}</h3>
                          <p style={{ margin: 0, color: '#71717a', fontSize: '0.85rem' }}>{new Date(event.eventDate).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                      <button 
                        onClick={() => setOfflineBookingSelectedEvent(null)}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e4e4e7', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
                      >
                        ← Back
                      </button>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#18181b', margin: 0 }}>Book Audience Ticket for {offlineBookingSelectedEvent.name}</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#3f3f46', marginBottom: '8px' }}>Audience Full Name *</label>
                        <input type="text" value={offlineBookingForm.customerName} onChange={e => setOfflineBookingForm({...offlineBookingForm, customerName: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e4e4e7', borderRadius: '8px', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#3f3f46', marginBottom: '8px' }}>WhatsApp Number *</label>
                        <input type="text" value={offlineBookingForm.customerPhone} onChange={e => setOfflineBookingForm({...offlineBookingForm, customerPhone: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e4e4e7', borderRadius: '8px', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#3f3f46', marginBottom: '8px' }}>Email (Optional)</label>
                        <input type="text" value={offlineBookingForm.customerEmail} onChange={e => setOfflineBookingForm({...offlineBookingForm, customerEmail: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e4e4e7', borderRadius: '8px', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#3f3f46', marginBottom: '8px' }}>Quantity</label>
                        <input type="number" min="1" value={offlineBookingForm.quantity} onChange={e => setOfflineBookingForm({...offlineBookingForm, quantity: parseInt(e.target.value) || 1})} style={{ width: '100%', padding: '12px', border: '1px solid #e4e4e7', borderRadius: '8px', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#3f3f46', marginBottom: '8px' }}>Payment Screenshot</label>
                        <input type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setOfflineBookingForm({...offlineBookingForm, paymentScreenshotUrl: reader.result as string});
                            reader.readAsDataURL(file);
                          }
                        }} style={{ width: '100%', padding: '12px', border: '1px solid #e4e4e7', borderRadius: '8px', outline: 'none', background: '#fafafa' }} />
                      </div>
                      <button 
                        onClick={submitOfflineBooking}
                        disabled={offlineBookingLoading}
                        style={{ width: '100%', padding: '16px', background: '#ffd700', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', marginTop: '16px', cursor: offlineBookingLoading ? 'not-allowed' : 'pointer', opacity: offlineBookingLoading ? 0.7 : 1 }}
                      >
                        {offlineBookingLoading ? 'Booking...' : 'Book Ticket'}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : activeTab === 'host' ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key="host-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ maxWidth: '600px', margin: '40px auto', background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)', textAlign: 'center' }}
              >
                <div style={{ width: '64px', height: '64px', background: '#fef08a', color: '#ca8a04', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#18181b', marginBottom: '8px' }}>Host Account Management</h2>
                <p style={{ color: '#71717a', fontSize: '0.9rem', marginBottom: '32px' }}>
                  Reset the password for the stage host. The host uses these credentials to access the live lineup and manage artists during the event.
                </p>

                {hostPassLoading ? (
                  <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      style={{ width: '40px', height: '40px', border: '4px solid #f4f4f5', borderTopColor: '#eab308', borderRadius: '50%' }}
                    />
                    <div style={{ color: '#a1a1aa', fontWeight: 600, fontSize: '0.9rem' }}>Generating secure password & updating database...</div>
                  </div>
                ) : hostNewPass ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '24px', borderRadius: '12px' }}>
                    <div style={{ color: '#16a34a', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <CheckCircle2 size={20} /> Password Reset Successful
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#15803d', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>New Host Password</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#166534', letterSpacing: '2px', padding: '16px', background: '#fff', borderRadius: '8px', border: '1px dashed #86efac' }}>
                      {hostNewPass}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#15803d', marginTop: '16px' }}>Share this securely with your host. This password is only visible now.</div>
                  </motion.div>
                ) : (
                  <button 
                    onClick={handleResetHostPassword}
                    style={{ background: '#18181b', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: '0.2s', width: '100%' }}
                    onMouseOver={e => e.currentTarget.style.background = '#27272a'}
                    onMouseOut={e => e.currentTarget.style.background = '#18181b'}
                  >
                    Generate New Host Password
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#a1a1aa' }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.2 }}>🛠️</div>
                <h2 style={{ color: '#18181b' }}>{navItems.find(i => i.id === activeTab)?.label} Area</h2>
                <p>This section is under construction.</p>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* LEAD DETAILS MODAL */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => { setSelectedLead(null); setIsImageOpen(false); }}
          >
            <motion.div 
              initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#fff', color: '#18181b', borderRadius: '16px', padding: '32px', width: '500px', maxWidth: '90%', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
            >
              <h2 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: 800 }}>Lead Details</h2>
              <div style={{ marginBottom: '12px' }}><strong>Event:</strong> {selectedLead.event ? selectedLead.event.name : 'Unknown'}</div>
              <div style={{ marginBottom: '12px' }}><strong>Name:</strong> {selectedLead.name}</div>
              <div style={{ marginBottom: '12px' }}><strong>Email:</strong> {selectedLead.email}</div>
              <div style={{ marginBottom: '12px' }}><strong>Phone:</strong> {selectedLead.phone}</div>
              <div style={{ marginBottom: '12px' }}><strong>Age:</strong> {selectedLead.age}</div>
              <div style={{ marginBottom: '12px' }}><strong>Act/Tracks:</strong> {selectedLead.performanceTrack || 'N/A'}</div>
              <div style={{ marginBottom: '12px' }}>
                <strong>WhatsApp:</strong> <a href={`https://wa.me/${selectedLead.phone}`} target="_blank" rel="noreferrer" style={{ color: '#25D366' }}>Chat on WhatsApp</a>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Instagram:</strong> {selectedLead.instagramLink ? <a href={selectedLead.instagramLink} target="_blank" rel="noreferrer" style={{ color: '#E1306C' }}>View Profile</a> : 'N/A'}
              </div>
              {selectedLead.paymentScreenshotUrl && (
                <div style={{ marginBottom: '24px' }}>
                  <strong>Payment Screenshot:</strong>
                  <br />
                  <img onClick={() => setIsImageOpen(true)} src={selectedLead.paymentScreenshotUrl} alt="Payment" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginTop: '8px', border: '1px solid #eee', cursor: 'pointer' }} />
                </div>
              )}

              {selectedLead.selfIntro && (
                <div style={{ marginBottom: '12px' }}>
                  <strong>Self Intro:</strong>
                  <p style={{ marginTop: '4px', padding: '12px', background: '#f4f4f5', borderRadius: '8px', fontSize: '0.9rem' }}>{selectedLead.selfIntro}</p>
                </div>
              )}

              {selectedLead.audioTrackUrl && (
                <div style={{ marginBottom: '24px' }}>
                  <strong>Performance Track:</strong>
                  <br />
                  <audio controls src={selectedLead.audioTrackUrl} style={{ width: '100%', marginTop: '8px' }} />
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => updateLeadStatus(selectedLead.id, 'APPROVED')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#047857', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Accept Lead</button>
                <button onClick={() => updateLeadStatus(selectedLead.id, 'REJECTED')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Reject Lead</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isImageOpen && selectedLead && selectedLead.paymentScreenshotUrl && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setIsImageOpen(false)}
          >
            <motion.img 
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
              src={selectedLead.paymentScreenshotUrl} 
              alt="Fullscreen Payment" 
              style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', objectFit: 'contain' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOOKING DETAILS MODAL */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => { setSelectedBooking(null); setIsImageOpen(false); }}
          >
            <motion.div 
              initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#fff', color: '#18181b', borderRadius: '16px', padding: '32px', width: '500px', maxWidth: '90%', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
            >
              <h2 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: 800 }}>Booking Details</h2>
              <div style={{ marginBottom: '12px' }}><strong>Event:</strong> {selectedBooking.event ? selectedBooking.event.name : 'Unknown'}</div>
              <div style={{ marginBottom: '12px' }}><strong>Name:</strong> {selectedBooking.customerName}</div>
              <div style={{ marginBottom: '12px' }}><strong>Email:</strong> {selectedBooking.customerEmail}</div>
              <div style={{ marginBottom: '12px' }}><strong>Phone:</strong> {selectedBooking.customerPhone}</div>
              <div style={{ marginBottom: '12px' }}><strong>Quantity:</strong> {selectedBooking.quantity || 1}</div>
              
              {selectedBooking.paymentScreenshotUrl && (
                <div style={{ marginBottom: '24px' }}>
                  <strong>Payment Screenshot:</strong>
                  <br />
                  <img onClick={() => setIsImageOpen(true)} src={selectedBooking.paymentScreenshotUrl} alt="Payment" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginTop: '8px', border: '1px solid #eee', cursor: 'pointer' }} />
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => updateBookingStatus(selectedBooking.id, 'APPROVED')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#047857', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Accept Booking</button>
                <button onClick={() => updateBookingStatus(selectedBooking.id, 'REJECTED')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Reject Booking</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isImageOpen && selectedBooking && selectedBooking.paymentScreenshotUrl && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setIsImageOpen(false)}
          >
            <motion.img 
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
              src={selectedBooking.paymentScreenshotUrl} 
              alt="Fullscreen Payment" 
              style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', objectFit: 'contain' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HIDDEN TICKET TEMPLATE FOR GENERATION */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        {selectedBooking && <TicketTemplate booking={selectedBooking} />}
      </div>

    </div>
  );
};

export default AdminDashboard;

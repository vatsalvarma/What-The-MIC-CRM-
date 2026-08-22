import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import HeroPage from './pages/HeroPage';

import EventsPage from './pages/EventsPage';
import AdminDashboard from './pages/AdminDashboard';
import HostDashboard from './pages/HostDashboard';
import ArtistRegistration from './pages/ArtistRegistration';
import Form2 from './pages/Form2';
import BookEventsPage from './pages/BookEventsPage';
import TicketBookingForm from './pages/TicketBookingForm';

const Navigation = () => {
  const location = useLocation();
  // Hide navbar on admin and host dashboards to give them a full custom layout
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/host')) {
    return null;
  }

  return (
    <nav style={{ position: 'absolute', top: '25px', width: '100%', zIndex: 100, display: 'flex', justifyContent: 'center' }}>
      <div style={{ 
        width: '95%', maxWidth: '1600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.8rem 2rem', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '50px'
      }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '2px', fontFamily: '"Outfit", system-ui, sans-serif', textDecoration: 'none' }}>
          MIC<span style={{ color: '#ffd700' }}>.</span>
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/events" style={{ padding: '0.5rem 1.5rem', borderRadius: '50px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s' }}>
            Events
          </Link>
          <Link to="/book-events" style={{ padding: '0.5rem 1.5rem', borderRadius: '50px', background: '#ffd700', color: '#000', border: 'none', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s' }}>
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <main style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/perform" element={<ArtistRegistration />} />
          <Route path="/form2/:id" element={<Form2 />} />
          <Route path="/book-events" element={<BookEventsPage />} />
          <Route path="/book/:eventId" element={<TicketBookingForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/host" element={<HostDashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

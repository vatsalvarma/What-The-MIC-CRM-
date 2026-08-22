import React from 'react';

interface TicketTemplateProps {
  booking: any;
}

const TicketTemplate: React.FC<TicketTemplateProps> = ({ booking }) => {
  if (!booking || !booking.event) return null;

  return (
    <div 
      id="ticket-template"
      style={{
        width: '600px',
        background: '#0a0a0a',
        color: '#ffffff',
        fontFamily: '"Outfit", system-ui, sans-serif',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Background Graphic */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 0
      }} />

      {/* Header */}
      <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, letterSpacing: '2px', color: '#fff' }}>
            MIC<span style={{ color: '#ffd700' }}>.</span>
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#a1a1aa', letterSpacing: '1px', textTransform: 'uppercase' }}>Official Event Ticket</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>Booking ID</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffd700', letterSpacing: '2px' }}>#{booking.id.toString().padStart(6, '0')}</div>
        </div>
      </div>

      {/* Event Details */}
      <div style={{ zIndex: 1, marginBottom: '40px' }}>
        <h2 style={{ margin: '0 0 15px 0', fontSize: '2.8rem', fontWeight: 900, lineHeight: 1.1, color: '#ffffff' }}>
          {booking.event.name}
        </h2>
        <div style={{ display: 'flex', gap: '32px', marginTop: '20px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Date & Time</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{new Date(booking.event.eventDate).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Venue</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{booking.event.venue}</div>
          </div>
        </div>
      </div>

      {/* Attendee Details */}
      <div style={{ zIndex: 1, background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Admit To</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{booking.customerName}</div>
          <div style={{ fontSize: '0.95rem', color: '#a1a1aa', marginTop: '6px' }}>{booking.customerPhone}</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Admissions</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffd700' }}>{booking.quantity || 1}</div>
        </div>
      </div>

      {/* Barcode Footer */}
      <div style={{ zIndex: 1, marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ color: '#a1a1aa', fontSize: '0.8rem' }}>
          Valid for entry on the event date only.<br/>
          Non-transferable. Scan at the gate.
        </div>
        {/* Fake Barcode Lines */}
        <div style={{ display: 'flex', gap: '4px', height: '50px', alignItems: 'flex-end' }}>
          {[1, 3, 2, 4, 1, 2, 5, 2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2].map((width, i) => (
            <div key={i} style={{ width: `${width * 2.5}px`, height: '100%', background: '#ffffff', opacity: 0.9 }} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default TicketTemplate;

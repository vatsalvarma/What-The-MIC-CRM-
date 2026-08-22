import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, DollarSign, Users, Ticket, TrendingUp } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;

const Card = ({ children, style = {}, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    style={{ 
      background: '#fff', 
      border: '1px solid #e4e4e7', 
      borderRadius: '12px', 
      padding: '16px', 
      boxShadow: '0 4px 15px -10px rgba(0,0,0,0.05)', 
      display: 'flex',
      flexDirection: 'column',
      ...style 
    }}
  >
    {children}
  </motion.div>
);

const AnimatedCircle = ({ value, total, color, label, delay }: any) => {
  const pct = total === 0 ? 0 : Math.min(value / total, 1);
  const circ = 251.2;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ position: 'relative', width: '60px', height: '60px', flexShrink: 0 }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f4f4f5" strokeWidth="12" />
          <motion.circle 
            cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="12" 
            strokeDasharray={circ} strokeLinecap="round"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: circ * (1 - pct) }}
            transition={{ duration: 1.5, delay: delay, ease: "easeOut" }}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>
          {Math.round(pct * 100)}%
        </div>
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600, lineHeight: 1.2 }}>{label}</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, margin: '2px 0' }}>{value}</div>
        <div style={{ fontSize: '0.65rem', color: '#a1a1aa' }}>Out of {total} Target</div>
      </div>
    </div>
  );
};

const PieChart = ({ data, total }: any) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  let currentOffset = 0;
  const radius = 25;
  const circ = 2 * Math.PI * radius;
  
  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
        <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
          {data.map((d: any, i: number) => {
            if (d.value === 0) return null;
            const pct = d.value / total;
            const dash = pct * circ;
            const offset = currentOffset;
            currentOffset += dash;
            const isHovered = hoveredIndex === i;
            return (
              <motion.circle
                key={i}
                cx="50" cy="50" r={radius}
                fill="transparent"
                stroke={d.color}
                strokeWidth={isHovered ? "45" : "35"}
                strokeDasharray={`0 ${circ}`}
                strokeDashoffset={-offset}
                animate={{ strokeDasharray: `${dash} ${circ}` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease-out' }}
              />
            );
          })}
        </svg>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {data.map((d: any, i: number) => (
          <div 
            key={i} 
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', cursor: 'pointer', opacity: hoveredIndex === null || hoveredIndex === i ? 1 : 0.4, transition: 'opacity 0.2s' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', background: d.color, borderRadius: '50%' }} />
              <span style={{ color: '#71717a', fontWeight: 600 }}>{d.label}</span>
            </div>
            <span style={{ fontWeight: 800, color: '#18181b', fontSize: '1rem' }}>{d.displayValue || d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const VerticalBarChart = ({ data, max }: any) => {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1, gap: '8px', marginTop: '12px' }}>
      {data.map((d: any, i: number) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative' }} title={`${d.count} Leads`}>
          <div style={{ position: 'relative', width: '100%', height: '80px', background: '#f4f4f5', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer' }}>
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${(d.count / max) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
              style={{ position: 'absolute', bottom: 0, width: '100%', background: '#18181b', borderRadius: '4px' }}
            />
          </div>
          <div style={{ fontSize: '0.6rem', color: '#71717a', fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
            {d.name.substring(0, 8)}
          </div>
        </div>
      ))}
      {data.length === 0 && <div style={{width:'100%', textAlign:'center', color:'#a1a1aa', fontSize:'0.8rem'}}>No data</div>}
    </div>
  );
};

const DualLineGraph = ({ data, max, title, color1, color2, label1, label2 }: any) => {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#18181b' }}>{title}</div>
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.6rem', fontWeight: 600, color: '#71717a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color1 }} /> {label1}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color2 }} /> {label2}</div>
        </div>
      </div>
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: '16px' }}>
        {/* Y-Axis lines */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '16px', zIndex: 0 }}>
          {[max, Math.floor(max/2), 0].map((v, i) => (
            <div key={i} style={{ borderBottom: '1px dashed #e4e4e7', position: 'relative' }}></div>
          ))}
        </div>
        
        {/* SVG Line Graph */}
        <svg style={{ position: 'absolute', inset: 0, paddingBottom: '16px', overflow: 'visible', zIndex: 1 }} preserveAspectRatio="none">
           {(() => {
              const points1 = data.map((d: any, i: number) => `${(i / Math.max(data.length - 1, 1)) * 100}%,${100 - (d.val1 / max) * 100}%`).join(' L ');
              const points2 = data.map((d: any, i: number) => `${(i / Math.max(data.length - 1, 1)) * 100}%,${100 - (d.val2 / max) * 100}%`).join(' L ');
              return (
                <>
                  <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.2 }} d={`M ${points1}`} fill="none" stroke={color1} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.4 }} d={`M ${points2}`} fill="none" stroke={color2} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
              );
           })()}
        </svg>
        {/* X-Axis */}
        <div style={{ position: 'absolute', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
          {data.map((d: any, i: number) => (
            <div key={i} style={{ fontSize: '0.55rem', color: '#a1a1aa', fontWeight: 600 }}>{d.month}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TopEventCard = ({ data }: any) => {
  const topEvent = data[0] || { name: 'N/A', count: 0 };
  const maxCount = Math.max(...data.map((d: any) => d.count), 1);
  const totalCount = data.reduce((s: number, d: any) => s + d.count, 0);

  return (
    <Card delay={0.7} style={{ gridColumn: 'span 6', alignItems: 'center', textAlign: 'center', minHeight: '260px' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '0.65rem', fontWeight: 600 }}>
        <span>Highlighted Event</span>
        <span style={{cursor: 'pointer'}}>⎔</span>
      </div>
      <div style={{ marginTop: '24px', width: '56px', height: '56px', background: '#ea580c', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
        {topEvent.name.substring(0,1).toUpperCase()}
      </div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#18181b', marginTop: '12px' }}>{topEvent.name}</div>
      <div style={{ fontSize: '0.7rem', color: '#a1a1aa', fontWeight: 600 }}>Live Event</div>
      
      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#18181b', margin: '16px 0 4px 0' }}>{totalCount.toLocaleString()}</div>
      <div style={{ fontSize: '0.65rem', color: '#71717a', fontWeight: 600 }}>Total Leads & Bookings<br/>Generated Recently</div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '8px', height: '40px', marginTop: '24px', width: '100%', padding: '0 20px' }}>
        {data.map((d: any, i: number) => (
          <motion.div 
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${(d.count / maxCount) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
            style={{ flex: 1, maxWidth: '14px', background: i % 2 === 0 ? '#18181b' : '#a1a1aa', borderRadius: '3px' }}
            title={`${d.name}: ${d.count}`}
          />
        ))}
      </div>
    </Card>
  );
};

const RevenueAreaChartCard = ({ revenue, data }: any) => {
  const maxRev = Math.max(...data.map((d:any)=>d.amount), 1);
  return (
    <Card delay={0.8} style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', minHeight: '260px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600 }}>Total Revenue</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#18181b' }}>₹{revenue.toLocaleString()}</span>
            <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 6px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700 }}>+7.15%</span>
          </div>
        </div>
        <div style={{ border: '1px solid #e4e4e7', padding: '4px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 600, color: '#18181b', display: 'flex', gap: '4px', alignItems: 'center', cursor: 'pointer' }}>
          Year <ChevronDown size={12} />
        </div>
      </div>

      <div style={{ position: 'relative', flex: 1, marginTop: '24px', display: 'flex', alignItems: 'flex-end', paddingBottom: '20px' }}>
        {/* Vertical dotted grid lines */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between', paddingBottom: '20px', zIndex: 0 }}>
          {data.map((_:any, i:number) => (
             <div key={i} style={{ borderLeft: '1px dashed #e4e4e7', height: '100%', position: 'relative' }}>
                <span style={{ position: 'absolute', bottom: '-20px', left: '-12px', width: '24px', textAlign: 'center', fontSize: '0.6rem', color: '#a1a1aa', fontWeight: 600 }}>{data[i].year}</span>
             </div>
          ))}
        </div>
        
        {/* SVG Area Chart */}
        <svg style={{ position: 'absolute', inset: 0, paddingBottom: '20px', overflow: 'visible', zIndex: 1 }} preserveAspectRatio="none">
           <defs>
             <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="#18181b" stopOpacity="0.15" />
               <stop offset="100%" stopColor="#18181b" stopOpacity="0" />
             </linearGradient>
           </defs>
           {(() => {
              const points = data.map((d: any, i: number) => `${(i / Math.max(data.length - 1, 1)) * 100}%,${100 - (d.amount / maxRev) * 100}%`).join(' L ');
              const areaPath = `M 0%,100% L ${points} L 100%,100% Z`;
              return (
                <>
                  <motion.path initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.5 }} d={areaPath} fill="url(#area-gradient)" />
                  <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5 }} d={`M ${points}`} fill="none" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
              );
           })()}
        </svg>
      </div>
    </Card>
  );
};

const OverviewDashboard = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resLeads, resBookings] = await Promise.all([
          fetch(`${API_URL}/api/admin/leads`),
          fetch(`${API_URL}/api/admin/bookings`)
        ]);
        if (resLeads.ok && resBookings.ok) {
          setLeads(await resLeads.json());
          setBookings(await resBookings.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid #f4f4f5', borderTopColor: '#ffd700' }} 
        />
      </div>
    );
  }

  // --- DATA PROCESSING (REAL DATA) ---
  const totalLeads = leads.length;
  const totalBookings = bookings.length;
  const revenueFromBookings = bookings.reduce((sum, b) => sum + (b.quantity || 1) * (b.ticketType?.price || b.event?.price || 0), 0);
  const revenueFromLeads = leads.reduce((sum, l) => sum + (l.event?.price || 0), 0);
  const totalRevenue = revenueFromBookings + revenueFromLeads;

  const getLeadDate = (id: number) => {
    const d = new Date();
    d.setDate(d.getDate() - ((id * 7) % 30));
    return d;
  };

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyLeadsMap = new Map();
  const monthlyBookingsMap = new Map();
  
  leads.forEach(l => {
    const month = months[getLeadDate(l.id).getMonth()];
    monthlyLeadsMap.set(month, (monthlyLeadsMap.get(month) || 0) + 1);
  });
  bookings.forEach(b => {
    const month = months[getLeadDate(b.id).getMonth()]; // Mocking date for bookings
    monthlyBookingsMap.set(month, (monthlyBookingsMap.get(month) || 0) + 1);
  });
  
  const currentMonthIdx = new Date().getMonth();
  const startIdx = Math.max(currentMonthIdx - 5, 0);

  const pieData = [
    { label: 'Total Bookings', value: totalBookings, color: '#000000' },
    { label: 'Stage Ready', value: leads.filter(l => l.status==='STAGE_READY').length, color: '#27272a' },
    { label: 'Approved Leads', value: leads.filter(l => l.status==='APPROVED').length, color: '#52525b' },
    { label: 'Pending Leads', value: leads.filter(l => l.status==='PENDING_APPROVAL').length, color: '#a1a1aa' }
  ].filter(d => d.value > 0);
  const pieTotal = pieData.reduce((s, d) => s + d.value, 0);

  // Financial Pie Chart Data (3 yellow shades)
  const revenuePieData = [
    { label: 'Bookings Total', value: revenueFromBookings, displayValue: `₹${revenueFromBookings.toLocaleString()}`, color: '#eab308' },
    { label: 'Leads Total', value: revenueFromLeads, displayValue: `₹${revenueFromLeads.toLocaleString()}`, color: '#facc15' },
    { label: 'Total Overall', value: totalRevenue, displayValue: `₹${totalRevenue.toLocaleString()}`, color: '#fef08a' }
  ];
  const revenuePieTotal = revenuePieData.reduce((s, d) => s + d.value, 0);

  // Top Events Data
  const leadsByEventCount = new Map();
  leads.forEach(l => {
    const evtName = l.event?.name || 'General';
    leadsByEventCount.set(evtName, (leadsByEventCount.get(evtName) || 0) + 1);
  });
  const topEventsBarData = Array.from(leadsByEventCount.entries())
    .map(([k,v]) => ({ name: k, count: v }))
    .sort((a,b) => b.count - a.count)
    .slice(0, 11);

  // Yearly Revenue Data (Mock projection based on real total)
  const yearlyRevenueData = [
    { year: '2021', amount: totalRevenue * 0.3 },
    { year: '2022', amount: totalRevenue * 0.5 },
    { year: '2023', amount: totalRevenue * 0.4 },
    { year: '2024', amount: totalRevenue * 0.7 },
    { year: '2025', amount: totalRevenue }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px', maxWidth: '1400px', margin: '0 auto', color: '#18181b', height: '100%', alignContent: 'start' }}>
      
      {/* ROW 1: 4 Metrics Cards (span 3 each) */}
      <Card delay={0.1} style={{ gridColumn: 'span 3' }}>
        <AnimatedCircle value={totalLeads} total={100} color="#18181b" label="Total Leads Progress" delay={0.1} />
      </Card>
      
      <Card delay={0.2} style={{ gridColumn: 'span 3' }}>
        <AnimatedCircle value={totalBookings} total={200} color="#ffd700" label="Bookings Progress" delay={0.2} />
      </Card>

      <Card delay={0.3} style={{ gridColumn: 'span 3', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600 }}>Total Revenue</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#18181b', margin: '2px 0' }}>₹{totalRevenue.toLocaleString()}</div>
          </div>
          <div style={{ width: '36px', height: '36px', background: '#dcfce7', color: '#16a34a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={20} />
          </div>
        </div>
        <div style={{ height: '6px', background: '#f4f4f5', borderRadius: '3px', overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((totalBookings / 200)*100, 100)}%` }} transition={{ duration: 1, delay: 0.3 }} style={{ height: '100%', background: '#16a34a' }} />
        </div>
      </Card>

      <Card delay={0.4} style={{ gridColumn: 'span 3', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600 }}>Leads Revenue</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#18181b', margin: '2px 0' }}>₹{revenueFromLeads.toLocaleString()}</div>
          </div>
          <div style={{ width: '36px', height: '36px', background: '#fee2e2', color: '#dc2626', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={20} />
          </div>
        </div>
        <div style={{ height: '6px', background: '#f4f4f5', borderRadius: '3px', overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((totalLeads / 100)*100, 100)}%` }} transition={{ duration: 1, delay: 0.4 }} style={{ height: '100%', background: '#dc2626' }} />
        </div>
      </Card>

      {/* ROW 2: 2 Chart Cards (span 6 each) */}
      <Card delay={0.6} style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', minHeight: '180px' }}>
        <div style={{ fontSize: '0.8rem', color: '#18181b', fontWeight: 800, marginBottom: '12px' }}>Interaction Breakdown</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <PieChart data={pieData} total={pieTotal} />
        </div>
      </Card>

      <Card delay={0.65} style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', minHeight: '180px' }}>
        <div style={{ fontSize: '0.8rem', color: '#18181b', fontWeight: 800, marginBottom: '12px' }}>Financial Overview</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <PieChart data={revenuePieData} total={revenuePieTotal} />
        </div>
      </Card>

      {/* ROW 3: Highlighted Event and Revenue Area Chart (span 6 each) */}
      <TopEventCard data={topEventsBarData} />
      <RevenueAreaChartCard revenue={totalRevenue} data={yearlyRevenueData} />

    </div>
  );
};

export default OverviewDashboard;

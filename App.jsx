import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin, ChevronDown, Loader, AlertCircle, Wallet, ChevronLeft, ChevronRight,
  X, User, Mail, Lock, Eye, EyeOff, SlidersHorizontal, Users, ShoppingCart,
  Plane, Train, Bus, Star, Check, CreditCard, Smartphone, Building2,
  RefreshCw, BookOpen, Shield, Zap
} from 'lucide-react';
import {
  GROQ_API_KEY, INDIA_PACKAGES, INTERESTS, BUDGET_CATEGORIES,
  TYPE_COLOR, TYPE_ICON, FILTER_KEYS, FILTER_META,
  generateTransports, generateHotels,
  ALL_INDIA_AIRPORTS, ALL_INDIA_RAILWAYS, ALL_INDIA_BUS_STOPS,
  getImageForQuery, getFallbackImage,
} from './data.js';

// ── IMAGE HELPERS ──────────────────────────────────────────────
const img = (q) => getImageForQuery(q);
const safeImg = (src, fallbackIndex = 0) => src || getFallbackImage(fallbackIndex);

const IS = { width: '100%', background: '#F7F8FC', border: '1.5px solid #E8E8E8', borderRadius: 12, padding: '10px 14px', color: '#2D3436', fontSize: 14, fontWeight: 500, transition: 'all 0.2s', fontFamily: "'Poppins',sans-serif" };
const LS = { display: 'block', color: '#B2BEC3', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 };

// ── STAR RATING ────────────────────────────────────────────────
function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => onChange(s)}
          style={{ fontSize: 22, cursor: 'pointer', transition: 'transform 0.1s', transform: (hover || value) >= s ? 'scale(1.15)' : 'scale(1)', color: (hover || value) >= s ? '#F7B731' : '#E0E0E0' }}>★</span>
      ))}
      {value > 0 && <span style={{ fontSize: 12, color: '#B2BEC3', marginLeft: 6, alignSelf: 'center' }}>{value}★+</span>}
    </div>
  );
}

// ── RANGE SLIDER ───────────────────────────────────────────────
function RangeSlider({ min, max, value, onChange, step = 500 }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: '#B2BEC3' }}>₹{min.toLocaleString()}</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#FF6B6B' }}>₹{value.toLocaleString()}</span>
        <span style={{ fontSize: 12, color: '#B2BEC3' }}>₹{max.toLocaleString()}</span>
      </div>
      <div style={{ position: 'relative', height: 6, background: '#F0F0F0', borderRadius: 100 }}>
        <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#FF6B6B,#FF8E53)', borderRadius: 100 }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
          style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '100%' }} />
        <div style={{ position: 'absolute', top: '50%', left: `${pct}%`, transform: 'translate(-50%,-50%)', width: 18, height: 18, borderRadius: '50%', background: 'white', border: '2.5px solid #FF6B6B', boxShadow: '0 2px 8px rgba(255,107,107,0.4)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

// ── IMAGE SLIDER ───────────────────────────────────────────────
function ImageSlider({ images, height = 200 }) {
  const [idx, setIdx] = useState(0);
  const validImages = (images || []).filter(Boolean);
  if (!validImages.length) {
    return (
      <div style={{ height, background: 'linear-gradient(135deg,#FF6B6B20,#FF8E5320)', borderRadius: '18px 18px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 48, opacity: 0.3 }}>🏞️</span>
      </div>
    );
  }
  return (
    <div style={{ position: 'relative', height, overflow: 'hidden', background: '#F0F2FF', borderRadius: '18px 18px 0 0' }}>
      {validImages.map((src, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, transition: 'opacity 0.5s', opacity: i === idx ? 1 : 0, zIndex: i === idx ? 1 : 0 }}>
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.src = getFallbackImage(i); }} />
        </div>
      ))}
      {validImages.length > 1 && <>
        <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + validImages.length) % validImages.length); }}
          style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <ChevronLeft size={14} />
        </button>
        <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % validImages.length); }}
          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <ChevronRight size={14} />
        </button>
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: 4 }}>
          {validImages.map((_, i) => (
            <div key={i} onClick={e => { e.stopPropagation(); setIdx(i); }}
              style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 100, background: i === idx ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
          {idx + 1}/{validImages.length}
        </div>
      </>}
    </div>
  );
}

// ── SEAT SELECTOR ──────────────────────────────────────────────
function SeatSelector({ transport, mode, onConfirm, onClose }) {
  const [selected, setSelected] = useState([]);
  const rows = {};
  (transport.seats || []).forEach(s => { if (!rows[s.row]) rows[s.row] = []; rows[s.row].push(s); });
  const toggle = seat => {
    if (!seat.available) return;
    setSelected(prev => prev.find(s => s.id === seat.id) ? prev.filter(s => s.id !== seat.id) : [...prev, seat]);
  };
  const total = selected.reduce((a, s) => a + s.price, 0);
  const modeImgKey = mode === 'flight' ? 'flight' : mode === 'train' ? 'train' : 'bus';
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: 24, padding: 28, width: 540, maxHeight: '90vh', overflowY: 'auto', fontFamily: "'Poppins',sans-serif" }} onClick={e => e.stopPropagation()}>
        <div style={{ height: 120, borderRadius: 16, overflow: 'hidden', marginBottom: 20, position: 'relative' }}>
          <img src={img(modeImgKey)} alt="transport" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = getFallbackImage(0); }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(255,107,107,0.75),rgba(255,142,83,0.75))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <p style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>{transport.company}</p>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>{transport.departure} → {transport.arrival} · {transport.duration}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{transport.class}</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>⭐{transport.rating}</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>₹{transport.price.toLocaleString()}/seat</span>
            </div>
          </div>
          <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} /></button>
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, padding: '10px 14px', background: '#F7F8FC', borderRadius: 12 }}>
          {[['#E8F5E9', '✓ Available'], ['#FF6B6B', '● Selected'], ['#F0F0F0', '✕ Taken']].map(([bg, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: bg, border: '1px solid #E0E0E0' }} />
              <span style={{ fontSize: 12, color: '#636E72' }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ background: '#F7F8FC', borderRadius: 16, padding: 14, marginBottom: 16 }}>
          <div style={{ textAlign: 'center', background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: 'white', borderRadius: 10, padding: '7px', marginBottom: 14, fontSize: 12, fontWeight: 700 }}>
            {mode === 'flight' ? '🛫 FRONT OF AIRCRAFT' : mode === 'train' ? '🚂 ENGINE END' : '🚌 DRIVER END'}
          </div>
          {Object.entries(rows).map(([row, seats]) => (
            <div key={row} style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: '#B2BEC3', width: 20, textAlign: 'right' }}>{row}</span>
              <div style={{ display: 'flex', gap: 5 }}>
                {seats.map((seat, si) => {
                  const isSel = !!selected.find(s => s.id === seat.id);
                  return (
                    <React.Fragment key={seat.id}>
                      {si === Math.floor(seats.length / 2) && <div style={{ width: 10 }} />}
                      <button onClick={() => toggle(seat)} title={`${seat.id} · ${seat.type} · ₹${seat.price}`}
                        style={{ width: 34, height: 34, borderRadius: 8, border: 'none', cursor: seat.available ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 9, transition: 'all 0.15s', background: !seat.available ? '#F0F0F0' : isSel ? '#FF6B6B' : '#E8F5E9', color: !seat.available ? '#B2BEC3' : isSel ? 'white' : '#2E7D32', transform: isSel ? 'scale(1.1)' : 'scale(1)', boxShadow: isSel ? '0 4px 12px rgba(255,107,107,0.4)' : 'none' }}>
                        {seat.id}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {selected.length > 0 && (
          <div style={{ background: '#FFF5F5', borderRadius: 14, padding: '12px 16px', marginBottom: 14, border: '1px solid #FFE0D0' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#2D3436', marginBottom: 8 }}>Selected ({selected.length} seat{selected.length > 1 ? 's' : ''}):</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {selected.map(s => (
                <span key={s.id} style={{ background: '#FF6B6B', color: 'white', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {s.id} · {s.type} <span onClick={() => toggle(s)} style={{ cursor: 'pointer', opacity: 0.8 }}>×</span>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#636E72' }}>Total</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#FF6B6B' }}>₹{total.toLocaleString()}</span>
            </div>
          </div>
        )}
        <button onClick={() => selected.length && onConfirm(selected)} disabled={!selected.length}
          style={{ width: '100%', background: selected.length ? 'linear-gradient(135deg,#FF6B6B,#FF8E53)' : '#DFE6E9', color: selected.length ? 'white' : '#B2BEC3', border: 'none', borderRadius: 14, padding: '14px', fontWeight: 700, fontSize: 15, cursor: selected.length ? 'pointer' : 'not-allowed', fontFamily: "'Poppins',sans-serif" }}>
          {selected.length ? `Confirm ${selected.length} Seat${selected.length > 1 ? 's' : ''} — ₹${total.toLocaleString()}` : 'Select at least one seat'}
        </button>
      </div>
    </div>
  );
}

// ── CART CLEAR MODAL ───────────────────────────────────────────
function CartClearModal({ onKeep, onClear }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'white', borderRadius: 24, padding: 32, width: 400, fontFamily: "'Poppins',sans-serif", boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>🛒</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#2D3436', textAlign: 'center', marginBottom: 8 }}>Items in your cart</h3>
        <p style={{ fontSize: 14, color: '#636E72', textAlign: 'center', marginBottom: 24, lineHeight: 1.6 }}>You're generating a new plan. Clear your cart or keep existing items?</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onKeep} style={{ flex: 1, background: 'white', color: '#636E72', border: '2px solid #E8E8E8', borderRadius: 14, padding: '13px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>Keep Cart</button>
          <button onClick={onClear} style={{ flex: 1, background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: 'white', border: 'none', borderRadius: 14, padding: '13px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>Clear & Start Fresh</button>
        </div>
      </div>
    </div>
  );
}

// ── NAVBAR ─────────────────────────────────────────────────────
function Navbar({ user, cartCount, onCart, onLogout }) {
  const [menu, setMenu] = useState(false);
  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #F0F0F0', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 200, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', borderRadius: 12, padding: '6px 10px', fontSize: 20 }}>✈️</div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#2D3436', letterSpacing: '-1px', lineHeight: 1 }}>TrekStack</div>
          <div style={{ fontSize: 10, color: '#B2BEC3', letterSpacing: '1px' }}>INDIA TRAVEL</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onCart} style={{ position: 'relative', background: '#F7F8FC', border: 'none', borderRadius: 100, padding: '9px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 13, color: '#2D3436', fontFamily: "'Poppins',sans-serif" }}>
          <ShoppingCart size={16} /> Cart
          {cartCount > 0 && <span style={{ position: 'absolute', top: -6, right: -6, background: '#FF6B6B', color: 'white', borderRadius: '50%', width: 20, height: 20, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
        </button>
        <div style={{ position: 'relative' }}>
          <div onClick={() => setMenu(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', borderRadius: 100, padding: '8px 16px', cursor: 'pointer' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white' }}>{user.name?.[0]?.toUpperCase()}</div>
            <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{user.name}</span>
            <ChevronDown size={12} color="rgba(255,255,255,0.8)" />
          </div>
          {menu && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'white', borderRadius: 14, boxShadow: '0 10px 40px rgba(0,0,0,0.15)', padding: 8, minWidth: 180, zIndex: 300 }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #F0F0F0', marginBottom: 4 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#2D3436' }}>{user.name}</p>
                <p style={{ fontSize: 11, color: '#B2BEC3' }}>{user.email}</p>
              </div>
              <button onClick={onLogout} style={{ width: '100%', background: 'none', border: 'none', padding: '10px 14px', textAlign: 'left', color: '#FF6B6B', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRadius: 8, fontFamily: "'Poppins',sans-serif" }}>Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// ── AUTH PAGE ──────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');

  const handle = () => {
    setErr('');
    const users = JSON.parse(localStorage.getItem('ts_users') || '[]');
    if (mode === 'register') {
      if (!form.name || !form.email || !form.password) { setErr('All fields are required.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErr('Please enter a valid email address.'); return; }
      if (form.password.length < 6) { setErr('Password must be at least 6 characters.'); return; }
      if (users.find(u => u.email.toLowerCase() === form.email.toLowerCase())) { setErr('Email already registered. Please sign in.'); return; }
      const updated = [...users, { name: form.name, email: form.email.toLowerCase(), password: form.password }];
      localStorage.setItem('ts_users', JSON.stringify(updated));
      onLogin({ name: form.name, email: form.email.toLowerCase() });
    } else {
      if (!form.email || !form.password) { setErr('Please enter your email and password.'); return; }
      const u = users.find(u => u.email.toLowerCase() === form.email.toLowerCase());
      if (!u) { setErr('No account found. Please register first.'); return; }
      if (u.password !== form.password) { setErr('Incorrect password.'); return; }
      onLogin({ name: u.name, email: u.email });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#FF6B6B 0%,#FF8E53 40%,#FFA07A 70%,#FFD89B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins',sans-serif", position: 'relative', overflow: 'hidden' }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ position: 'absolute', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', width: [300, 200, 150, 400, 100, 250][i], height: [300, 200, 150, 400, 100, 250][i], top: ['-10%', '60%', '30%', '-5%', '80%', '50%'][i], left: ['-5%', '-10%', '70%', '60%', '60%', '40%'][i], animation: `float${i} ${8 + i * 2}s ease-in-out infinite` }} />
      ))}
      <div style={{ background: 'white', borderRadius: 28, padding: '44px 40px', width: 440, boxShadow: '0 32px 80px rgba(0,0,0,0.2)', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', borderRadius: 20, width: 60, height: 60, fontSize: 28, marginBottom: 12, boxShadow: '0 8px 24px rgba(255,107,107,0.4)' }}>✈️</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#2D3436', letterSpacing: '-1px' }}>TrekStack</h1>
          <p style={{ color: '#B2BEC3', fontSize: 12, letterSpacing: '1px', textTransform: 'uppercase', marginTop: 2 }}>India's AI Travel Planner</p>
        </div>
        <div style={{ display: 'flex', background: '#F7F8FC', borderRadius: 12, padding: 4, marginBottom: 28 }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setErr(''); }} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Poppins',sans-serif", background: mode === m ? 'white' : 'transparent', color: mode === m ? '#2D3436' : '#B2BEC3', boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}>
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>
        {err && <div style={{ background: '#FFF0F0', border: '1px solid #FFD0D0', borderRadius: 10, padding: '10px 14px', color: '#E17055', fontSize: 13, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}><AlertCircle size={14} />{err}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <div><label style={LS}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#B2BEC3' }} />
                <input placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ ...IS, paddingLeft: 36 }} />
              </div>
            </div>
          )}
          <div><label style={LS}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#B2BEC3' }} />
              <input placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ ...IS, paddingLeft: 36 }} />
            </div>
          </div>
          <div><label style={LS}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#B2BEC3' }} />
              <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && handle()} style={{ ...IS, paddingLeft: 36, paddingRight: 40 }} />
              <button onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#B2BEC3' }}>{showPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>
            </div>
          </div>
          <button onClick={handle} style={{ background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: 'white', border: 'none', borderRadius: 14, padding: '14px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,107,107,0.4)', marginTop: 4, fontFamily: "'Poppins',sans-serif" }}>
            {mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20, padding: '16px 0', borderTop: '1px solid #F0F0F0' }}>
          <p style={{ color: '#B2BEC3', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Shield size={12} /> Your data is stored securely on this device</p>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes float0{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
        @keyframes float1{0%,100%{transform:translateY(0)}50%{transform:translateY(15px)}}
        @keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes float3{0%,100%{transform:translateY(0)}50%{transform:translateY(18px)}}
        @keyframes float4{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes float5{0%,100%{transform:translateY(0)}50%{transform:translateY(14px)}}
        *{box-sizing:border-box;margin:0;padding:0;}
        input:focus{border-color:#FF6B6B!important;box-shadow:0 0 0 3px rgba(255,107,107,0.15)!important;outline:none;}
      `}</style>
    </div>
  );
}

// ── FILTERS PANEL ──────────────────────────────────────────────
function FiltersPanel({ filters, onChange, onApply, onClose }) {
  const toggle = key => onChange(p => ({ ...p, [key]: { ...p[key], enabled: !p[key].enabled } }));
  const upd = (key, field, val) => onChange(p => ({ ...p, [key]: { ...p[key], [field]: val } }));
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 500, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', backdropFilter: 'blur(3px)' }} onClick={onClose}>
      <div style={{ background: 'white', width: 420, height: '100vh', overflowY: 'auto', boxShadow: '-10px 0 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', fontFamily: "'Poppins',sans-serif" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '22px 24px 16px', borderBottom: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
          <div><h2 style={{ fontSize: 20, fontWeight: 800, color: '#2D3436' }}>Filters</h2><p style={{ color: '#B2BEC3', fontSize: 12, marginTop: 2 }}>All filters are optional</p></div>
          <button onClick={onClose} style={{ background: '#F7F8FC', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
        </div>
        <div style={{ padding: '20px 24px 0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {FILTER_KEYS.map(key => {
              const m = FILTER_META[key]; const on = filters[key]?.enabled;
              return <button key={key} onClick={() => toggle(key)} style={{ padding: '8px 16px', borderRadius: 100, border: `2px solid ${on ? m.color : '#E8E8E8'}`, background: on ? m.color : 'white', color: on ? 'white' : '#636E72', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Poppins',sans-serif" }}>{m.emoji} {m.label}</button>;
            })}
          </div>
        </div>
        <div style={{ padding: '0 24px', flex: 1 }}>
          {FILTER_KEYS.map(key => {
            const m = FILTER_META[key]; const f = filters[key];
            if (!f?.enabled) return null;
            return (
              <div key={key} style={{ marginBottom: 24, background: '#F7F8FC', borderRadius: 16, padding: 16, border: `1.5px solid ${m.color}30` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: `${m.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{m.emoji}</div>
                  <div><p style={{ fontWeight: 700, fontSize: 14, color: '#2D3436' }}>{m.label}</p></div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 12, color: '#636E72', fontWeight: 600, marginBottom: 10 }}>Max Budget (per person/day)</p>
                  <RangeSlider min={0} max={m.maxBudget} step={m.step} value={f.budget || Math.round(m.maxBudget / 2)} onChange={v => upd(key, 'budget', v)} />
                </div>
                <p style={{ fontSize: 12, color: '#636E72', fontWeight: 600, marginBottom: 8 }}>{m.ratingLabel}</p>
                <StarRating value={f.stars || 0} onChange={v => upd(key, 'stars', v)} />
              </div>
            );
          })}
          {!FILTER_KEYS.some(k => filters[k]?.enabled) && <div style={{ textAlign: 'center', padding: '40px 20px', color: '#B2BEC3' }}><div style={{ fontSize: 48, marginBottom: 12 }}>🎛️</div><p style={{ fontSize: 14 }}>No filters selected — that's fine!</p></div>}
        </div>
        <div style={{ padding: 24, borderTop: '1px solid #F0F0F0', display: 'flex', gap: 12, position: 'sticky', bottom: 0, background: 'white' }}>
          <button onClick={() => onChange(p => { const r = {}; FILTER_KEYS.forEach(k => r[k] = { ...p[k], enabled: false }); return r; })} style={{ flex: 1, background: 'white', color: '#636E72', border: '2px solid #E8E8E8', borderRadius: 12, padding: '12px', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>Clear All</button>
          <button onClick={onApply} style={{ flex: 2, background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: 'white', border: 'none', borderRadius: 12, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>Apply & Generate ✓</button>
        </div>
      </div>
    </div>
  );
}

// ── HOME PAGE ──────────────────────────────────────────────────
function HomePage({ user, cart, setCart, onBook, onLogout }) {
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [customPlace, setCustomPlace] = useState('');
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState('');
  const [people, setPeople] = useState(2);
  const [interest, setInterest] = useState('cultural');
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeDay, setActiveDay] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [pendingGenerate, setPendingGenerate] = useState(null);
  const [filters, setFilters] = useState(() => Object.fromEntries(FILTER_KEYS.map(k => [k, { enabled: false, budget: Math.round(FILTER_META[k].maxBudget / 2), stars: 0 }])));
  const planRef = useRef(null);

  const budgetNum = Number(budget) || 0;
  const displayBudget = budgetNum || itinerary?.recommendedBudget || 0;
  const activeFilters = FILTER_KEYS.filter(k => filters[k]?.enabled);
  const canGenerate = !!(selectedPkg || customPlace.trim());
  const north = INDIA_PACKAGES.filter(p => p.region === 'North India');
  const south = INDIA_PACKAGES.filter(p => p.region === 'South India');
  const other = INDIA_PACKAGES.filter(p => !['North India', 'South India'].includes(p.region));

  const buildFilterPrompt = () => {
    if (!activeFilters.length) return '';
    let s = '\nUSER FILTER PREFERENCES:\n';
    activeFilters.forEach(k => { const m = FILTER_META[k]; const f = filters[k]; s += `- ${m.label}: max ₹${f.budget}/person/day, min rating: ${f.stars || 'any'}★\n`; });
    return s;
  };

  const requestGenerate = (pkg) => {
    if (cart.length > 0) { setPendingGenerate(pkg || selectedPkg || '__custom__'); setShowCartModal(true); }
    else doGenerate(pkg);
  };

  const doGenerate = async (pkg) => {
    setShowCartModal(false); setPendingGenerate(null);
    const p = typeof pkg === 'string' ? null : (pkg || selectedPkg);
    const place = customPlace.trim();
    if (!p && !place) { setError('Please select a package or enter a destination.'); return; }
    setError(''); setLoading(true); setItinerary(null); setShowFilters(false);
    const tripName = p ? `${p.name} package covering ${p.cities.join(', ')}` : place;
    const cities = p ? p.cities : [place];
    const prompt = `Expert Indian travel planner. Generate a ${days}-day itinerary for ${tripName} for ${people} people focused on ${interest}.

CRITICAL RULES:
1. Cover FULL day 6AM-10PM. Min 7-8 activities per day including morning, breakfast, sightseeing, lunch, afternoon, evening, dinner, and night.
2. Keep geographically close places on same day (within 5-10km).
3. Start each day with a transport activity showing how to get around.
4. LAST DAY (Day ${days}): End with a "Departure" transport activity with specific bus/train/flight return options.
5. Food places: include 3-4 menu items with prices in "menu" array.
6. Each activity: 3 specific imageQueries naming the EXACT place.
7. Include "distanceFromPrev" per activity.
8. Suggest "recommendedBudget" total for ${people} people ${days} days.
Budget: ₹${budgetNum || 'flexible'}.
${buildFilterPrompt()}

Return ONLY valid JSON (no markdown, no explanation):
{"city":"${cities[0]}","tagline":"","recommendedBudget":25000,"budgetNote":"","days":[{"day":1,"theme":"","zone":"","activities":[{"time":"06:30 AM","name":"exact place name","location":"specific area","type":"transport|breakfast|landmark|lunch|activity|dinner|cafe|market|temple|museum|beach|fort|garden|evening|night","duration":"1h","distanceFromPrev":"starting point","description":"2-3 vivid sentences","tips":"one tip","cost":"₹100","imageQueries":["exact place name city india","specific food or scene","street or interior view"],"menu":[{"item":"","price":"₹100","desc":""}],"transportDetails":{"mode":"Auto/Metro/Bus/Cab","estimatedCost":"₹50","duration":"15 mins","tip":""}}]}]}

Rules: menu only for food types, transportDetails only for transport type. JSON ONLY.`;

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` }, body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], max_tokens: 7000, temperature: 0.7 }) });
      if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || '';
      const clean = text.replace(/```json|```/gi, '').trim();
      const parsed = JSON.parse(clean);
      setItinerary({ ...parsed, package: p || { name: place, cities: [place], color: '#FF6B6B', emoji: '📍' } });
      setActiveDay(0);
      setTimeout(() => planRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    } catch (e) { console.error(e); setError(`Error: ${e.message}`); }
    finally { setLoading(false); }
  };

  const getImages = act => {
    if (act.imageQueries?.length) return act.imageQueries.map(q => getImageForQuery(q));
    return [getImageForQuery(`${act.name} ${itinerary?.city || ''}`)];
  };

  const PackageCard = ({ p }) => (
    <div onClick={() => { setSelectedPkg(p); setCustomPlace(''); requestGenerate(p); }}
      style={{ background: 'white', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: `2px solid ${selectedPkg?.id === p.id ? p.color : '#F0F0F0'}`, transition: 'all 0.25s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}>
      <div style={{ height: 180, background: '#F0F2FF', position: 'relative', overflow: 'hidden' }}>
        <img
          src={getImageForQuery(p.imgKey)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
          onError={e => { e.target.src = getFallbackImage(INDIA_PACKAGES.indexOf(p)); }}
          alt={p.name}
          onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', top: 12, left: 12, background: p.color, color: 'white', borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}>{p.tag}</div>
        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', color: 'white', borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 600 }}>{p.emoji} {p.duration}</div>
      </div>
      <div style={{ padding: '16px 18px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2D3436', marginBottom: 4 }}>{p.name}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
          {p.cities.map(c => <span key={c} style={{ background: '#F7F8FC', color: '#636E72', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 500 }}>📍{c}</span>)}
        </div>
        <p style={{ fontSize: 12, color: '#B2BEC3', lineHeight: 1.6, marginBottom: 12 }}>{p.desc}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><p style={{ fontSize: 10, color: '#B2BEC3', textTransform: 'uppercase', letterSpacing: '1px' }}>Starting from</p><p style={{ fontSize: 16, fontWeight: 800, color: p.color }}>₹{p.minBudget.toLocaleString()}</p></div>
          <div style={{ background: `${p.color}15`, color: p.color, borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 700 }}>Plan Trip →</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F7F8FC', fontFamily: "'Poppins',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
        *{box-sizing:border-box;margin:0;padding:0;}
        input,select,button{font-family:'Poppins',sans-serif;}
        input:focus,select:focus{border-color:#FF6B6B!important;box-shadow:0 0 0 3px rgba(255,107,107,0.15)!important;outline:none;}
        ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-thumb{background:#E0E0E0;border-radius:3px;}
      `}</style>

      {showCartModal && <CartClearModal onKeep={() => { setShowCartModal(false); doGenerate(pendingGenerate); }} onClear={() => { setCart([]); setShowCartModal(false); doGenerate(pendingGenerate); }} />}
      {showFilters && <FiltersPanel filters={filters} onChange={setFilters} onApply={() => requestGenerate()} onClose={() => setShowFilters(false)} />}

      {/* Cart Drawer */}
      {showCart && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 600, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', backdropFilter: 'blur(3px)' }} onClick={() => setShowCart(false)}>
          <div style={{ background: 'white', width: 380, height: '100vh', overflowY: 'auto', boxShadow: '-10px 0 40px rgba(0,0,0,0.15)', padding: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#2D3436' }}>🛒 Cart ({cart.length})</h2>
              <button onClick={() => setShowCart(false)} style={{ background: '#F7F8FC', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            {cart.length === 0 ? <div style={{ textAlign: 'center', padding: '60px 20px', color: '#B2BEC3' }}><ShoppingCart size={48} style={{ opacity: 0.3, marginBottom: 12 }} /><p>Your cart is empty</p></div> : (
              <>
                {cart.map((item, i) => (
                  <div key={i} style={{ background: '#F7F8FC', borderRadius: 14, padding: 14, marginBottom: 12, border: '1px solid #F0F0F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div><p style={{ fontWeight: 700, fontSize: 14, color: '#2D3436' }}>{item.name}</p><p style={{ fontSize: 12, color: '#B2BEC3', marginTop: 2 }}>{item.detail}</p></div>
                      <button onClick={() => setCart(c => c.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: 18 }}>×</button>
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 800, color: '#FF6B6B', marginTop: 8 }}>₹{item.price.toLocaleString()}</p>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 16, marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ color: '#636E72', fontSize: 13 }}>Subtotal</span><span style={{ fontWeight: 700 }}>₹{cart.reduce((a, i) => a + i.price, 0).toLocaleString()}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ color: '#636E72', fontSize: 13 }}>GST (18%)</span><span style={{ fontWeight: 700 }}>₹{Math.round(cart.reduce((a, i) => a + i.price, 0) * 0.18).toLocaleString()}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16, color: '#2D3436', borderTop: '1px solid #F0F0F0', paddingTop: 12, marginTop: 8 }}>
                    <span>Total</span><span style={{ color: '#FF6B6B' }}>₹{Math.round(cart.reduce((a, i) => a + i.price, 0) * 1.18 + cart.length * 49).toLocaleString()}</span>
                  </div>
                  <button onClick={() => { setShowCart(false); onBook({ itinerary, package: selectedPkg || itinerary?.package, cart, setCart }); }} style={{ width: '100%', background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: 'white', border: 'none', borderRadius: 14, padding: 14, fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 16, fontFamily: "'Poppins',sans-serif" }}>
                    Proceed to Payment →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Navbar user={user} cartCount={cart.length} onCart={() => setShowCart(true)} onLogout={onLogout} />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#FF6B6B 0%,#FF8E53 50%,#FFA07A 100%)', padding: '48px 32px 36px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 8 }}>Discover Incredible India</p>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: 'white', letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 12 }}>Plan Your Perfect<br />India Journey 🇮🇳</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 32, maxWidth: 500 }}>AI-powered itineraries — pick a package below or type any destination.</p>

          <div style={{ background: 'white', borderRadius: 20, padding: '18px 22px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #F0F0F0' }}>
              <label style={LS}>🗺️ Enter any destination (or pick a package below)</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <MapPin size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#FF6B6B' }} />
                  <input placeholder="e.g. Pune, Coorg, Varanasi, Rishikesh, Goa..." value={customPlace}
                    onChange={e => { setCustomPlace(e.target.value); if (e.target.value.trim()) setSelectedPkg(null); }}
                    onKeyDown={e => e.key === 'Enter' && canGenerate && requestGenerate()}
                    style={{ ...IS, paddingLeft: 36 }} />
                </div>
                {customPlace.trim() && <div style={{ background: '#FF6B6B18', color: '#FF6B6B', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>📍 {customPlace.trim()}</div>}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 80px 130px 155px auto auto', gap: 12, alignItems: 'end' }}>
              <div><label style={LS}>Days</label><input type="number" min={1} max={14} value={days} onChange={e => setDays(Number(e.target.value))} style={IS} /></div>
              <div><label style={LS}>People</label>
                <div style={{ position: 'relative' }}><Users size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#B2BEC3' }} />
                  <input type="number" min={1} max={20} value={people} onChange={e => setPeople(Number(e.target.value))} style={{ ...IS, paddingLeft: 28 }} /></div>
              </div>
              <div><label style={LS}>Budget (₹)</label><input type="number" placeholder="Optional" value={budget} onChange={e => setBudget(e.target.value)} style={IS} /></div>
              <div><label style={LS}>Travel Style</label>
                <div style={{ position: 'relative' }}>
                  <select value={interest} onChange={e => setInterest(e.target.value)} style={{ ...IS, appearance: 'none', paddingRight: 28 }}>
                    {INTERESTS.map(i => <option key={i.value} value={i.value}>{i.icon} {i.label}</option>)}
                  </select>
                  <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#B2BEC3', pointerEvents: 'none' }} />
                </div>
              </div>
              <button onClick={() => setShowFilters(true)} style={{ background: activeFilters.length ? '#2D3436' : '#F7F8FC', color: activeFilters.length ? 'white' : '#636E72', border: `2px solid ${activeFilters.length ? '#2D3436' : '#E8E8E8'}`, borderRadius: 14, padding: '10px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', position: 'relative' }}>
                <SlidersHorizontal size={15} /> Filters
                {activeFilters.length > 0 && <span style={{ position: 'absolute', top: -8, right: -8, background: '#FF6B6B', color: 'white', borderRadius: '50%', width: 20, height: 20, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{activeFilters.length}</span>}
              </button>
              <button onClick={() => requestGenerate()} disabled={loading || !canGenerate} style={{ background: loading || !canGenerate ? '#DFE6E9' : 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: loading || !canGenerate ? '#B2BEC3' : 'white', border: 'none', borderRadius: 14, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: loading || !canGenerate ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8 }}>
                {loading ? <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> : '🔍'}{loading ? 'Planning...' : canGenerate ? 'Generate Plan' : 'Select Destination'}
              </button>
            </div>
            {!canGenerate && <p style={{ fontSize: 11, color: '#B2BEC3', marginTop: 10, textAlign: 'center' }}>👆 Type a place above or click any package below</p>}
            {activeFilters.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap', paddingTop: 14, borderTop: '1px solid #F0F0F0' }}>
                <span style={{ fontSize: 11, color: '#B2BEC3', alignSelf: 'center', fontWeight: 600 }}>ACTIVE:</span>
                {activeFilters.map(k => { const m = FILTER_META[k]; const f = filters[k]; return (<div key={k} style={{ background: `${m.color}18`, border: `1px solid ${m.color}40`, borderRadius: 100, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: m.color, display: 'flex', alignItems: 'center', gap: 6 }}>{m.emoji} {m.label} · ₹{f.budget?.toLocaleString()}{f.stars > 0 ? ` · ${f.stars}★` : ''}<span onClick={() => setFilters(p => ({ ...p, [k]: { ...p[k], enabled: false } }))} style={{ cursor: 'pointer', opacity: 0.7 }}>×</span></div>); })}
              </div>
            )}
          </div>
          {error && <div style={{ marginTop: 14, background: 'rgba(255,255,255,0.92)', borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 10, border: '1px solid #FFB3B3' }}><AlertCircle size={16} color="#FF6B6B" style={{ flexShrink: 0, marginTop: 1 }} /><span style={{ color: '#E17055', fontSize: 13, fontWeight: 500 }}>{error}</span></div>}
        </div>
      </div>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 32px 60px' }}>
        <div ref={planRef}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 20, marginBottom: 36, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 64, marginBottom: 16, display: 'inline-block', animation: 'spin 3s linear infinite' }}>✈️</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#2D3436', marginBottom: 8 }}>Planning your {selectedPkg?.name || customPlace} trip...</h3>
              <p style={{ color: '#B2BEC3', fontSize: 14 }}>Crafting a full day from 6AM to 10PM for {people} people</p>
            </div>
          )}

          {itinerary && !loading && (
            <div style={{ animation: 'fadeUp 0.4s ease', marginBottom: 36 }}>
              {/* Trip header */}
              <div style={{ background: 'white', borderRadius: 20, padding: '22px 28px', marginBottom: 22, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: 'white', borderRadius: 100, padding: '4px 14px', fontSize: 11, fontWeight: 700 }}>{days} DAY TRIP</span>
                      <span style={{ background: '#F7F8FC', color: '#636E72', borderRadius: 100, padding: '4px 14px', fontSize: 11, fontWeight: 600 }}>👥 {people} People</span>
                      <span style={{ background: '#F7F8FC', color: '#636E72', borderRadius: 100, padding: '4px 14px', fontSize: 11, fontWeight: 600 }}>{itinerary.package?.emoji || '📍'} {itinerary.package?.name || customPlace}</span>
                    </div>
                    <h1 style={{ fontSize: 34, fontWeight: 800, color: '#2D3436', letterSpacing: '-1.5px', lineHeight: 1.1 }}>{itinerary.package?.cities?.join(' → ') || customPlace}</h1>
                    {itinerary.tagline && <p style={{ color: '#B2BEC3', fontSize: 14, marginTop: 5, fontStyle: 'italic' }}>{itinerary.tagline}</p>}
                  </div>
                  {itinerary.recommendedBudget && (
                    <div style={{ background: '#F0FFF4', borderRadius: 16, padding: '14px 20px', textAlign: 'center', border: '1px solid #C3E6CB' }}>
                      <p style={{ color: '#28A745', fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>✅ Recommended</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: '#2D3436' }}>₹{itinerary.recommendedBudget.toLocaleString()}</p>
                      <p style={{ color: '#6c757d', fontSize: 10, marginTop: 2, maxWidth: 160 }}>{itinerary.budgetNote}</p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: displayBudget > 0 ? '1fr 290px' : '1fr', gap: 24, alignItems: 'start' }}>
                <div>
                  {/* Day tabs */}
                  {itinerary.days?.length > 1 && (
                    <div style={{ display: 'flex', gap: 8, marginBottom: 18, overflowX: 'auto', paddingBottom: 6 }}>
                      {itinerary.days.map((d, i) => (
                        <button key={i} onClick={() => setActiveDay(i)} style={{ padding: '9px 18px', borderRadius: 100, border: '2px solid', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0, background: activeDay === i ? 'linear-gradient(135deg,#FF6B6B,#FF8E53)' : 'white', color: activeDay === i ? 'white' : '#636E72', borderColor: activeDay === i ? 'transparent' : '#E8E8E8', boxShadow: activeDay === i ? '0 8px 20px rgba(255,107,107,0.35)' : 'none' }}>
                          {i === itinerary.days.length - 1 ? '🏠 Departure Day' : `Day ${d.day}${d.zone ? ` · ${d.zone}` : ''}`}
                        </button>
                      ))}
                    </div>
                  )}

                  {itinerary.days?.[activeDay] && (() => {
                    const day = itinerary.days[activeDay];
                    const isLastDay = activeDay === itinerary.days.length - 1;
                    return (
                      <div style={{ animation: 'slideIn 0.3s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, padding: '14px 18px', background: isLastDay ? 'linear-gradient(135deg,#FFF5F0,#FFF0E6)' : 'white', borderRadius: 14, border: isLastDay ? '1px solid #FFE0CC' : '1px solid #F0F0F0' }}>
                          <div style={{ width: 4, height: 44, background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', borderRadius: 4 }} />
                          <div>
                            <p style={{ fontSize: 11, color: '#B2BEC3', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>{isLastDay ? 'Departure Day' : `Day ${day.day} · ${day.zone || ''}`}</p>
                            <p style={{ fontSize: 16, fontWeight: 700, color: '#2D3436' }}>{isLastDay ? '🏠 Head back home — safe travels!' : day.theme || ''}</p>
                          </div>
                          {isLastDay && <div style={{ marginLeft: 'auto', background: '#FF6B6B18', color: '#FF6B6B', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 600 }}>Last Day</div>}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          {day.activities?.map((act, i) => {
                            const color = TYPE_COLOR[act.type] || '#6C63FF';
                            const images = getImages(act);
                            const isFood = ['breakfast', 'lunch', 'dinner', 'cafe'].includes(act.type);
                            const isTransport = act.type === 'transport';
                            return (
                              <div key={i} style={{ display: 'grid', gridTemplateColumns: '72px 1fr', alignItems: 'stretch' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16 }}>
                                  <div style={{ background: `${color}18`, color, borderRadius: 10, padding: '5px 7px', fontSize: 11, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', border: `1px solid ${color}30` }}>{act.time}</div>
                                  {i < day.activities.length - 1 && <div style={{ flex: 1, width: 2, background: '#F0F0F0', borderRadius: 1, margin: '6px 0' }} />}
                                </div>
                                <div style={{ background: 'white', borderRadius: 18, overflow: 'hidden', border: '1px solid #F0F0F0', marginLeft: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', transition: 'all 0.25s' }}
                                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.09)'; }}
                                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}>
                                  {isTransport ? (
                                    <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg,#F8F9FA,#E9ECEF)', borderLeft: `4px solid ${color}` }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                        <span style={{ fontSize: 20 }}>🚌</span>
                                        <div style={{ flex: 1 }}>
                                          <p style={{ fontWeight: 700, fontSize: 14, color: '#2D3436' }}>{act.name}</p>
                                          <p style={{ color: '#636E72', fontSize: 12 }}>{act.location}</p>
                                        </div>
                                        {act.transportDetails?.estimatedCost && <div style={{ background: 'white', borderRadius: 10, padding: '6px 12px', textAlign: 'center' }}><p style={{ color: '#FF6B6B', fontSize: 10, fontWeight: 700 }}>Cost</p><p style={{ fontSize: 13, fontWeight: 800, color: '#2D3436' }}>{act.transportDetails.estimatedCost}</p></div>}
                                      </div>
                                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                        {act.transportDetails?.mode && <span style={{ background: '#E3F2FD', color: '#1565C0', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>🚌 {act.transportDetails.mode}</span>}
                                        {act.transportDetails?.duration && <span style={{ background: '#F3E5F5', color: '#6A1B9A', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>⏱ {act.transportDetails.duration}</span>}
                                        {act.distanceFromPrev && <span style={{ background: '#E8F5E9', color: '#2E7D32', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>📍 {act.distanceFromPrev}</span>}
                                      </div>
                                      {act.transportDetails?.tip && <div style={{ marginTop: 10, background: '#FFF9E6', border: '1px solid #FFE58F', borderRadius: 8, padding: '8px 12px', display: 'flex', gap: 6 }}><span>💡</span><p style={{ color: '#856404', fontSize: 12 }}>{act.transportDetails.tip}</p></div>}
                                    </div>
                                  ) : (
                                    <>
                                      <div style={{ position: 'relative' }}>
                                        <ImageSlider images={images} height={185} />
                                        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 5, background: color, color: 'white', borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}>{TYPE_ICON[act.type] || '📍'} {act.type}</div>
                                        {act.duration && <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 5, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', color: 'white', borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 600 }}>⏱ {act.duration}</div>}
                                        {act.cost && <div style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 5, background: 'rgba(255,107,107,0.9)', color: 'white', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{act.cost}</div>}
                                      </div>
                                      <div style={{ padding: '16px 20px' }}>
                                        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#2D3436', marginBottom: 4 }}>{act.name}</h3>
                                        <p style={{ color: '#74B9FF', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}><MapPin size={12} />{act.location}</p>
                                        <p style={{ color: '#636E72', fontSize: 13, lineHeight: 1.8, marginBottom: 10 }}>{act.description}</p>
                                        {isFood && act.menu?.length > 0 && (
                                          <div style={{ marginBottom: 12 }}>
                                            <p style={{ fontSize: 11, fontWeight: 700, color: '#2D3436', marginBottom: 8, textTransform: 'uppercase' }}>🍽️ Menu Highlights</p>
                                            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
                                              {act.menu.map((m, mi) => (
                                                <div key={mi} style={{ flexShrink: 0, background: 'linear-gradient(135deg,#FFF5F0,#FFF0E6)', border: '1px solid #FFE0CC', borderRadius: 12, padding: '10px 12px', minWidth: 130, maxWidth: 155 }}>
                                                  <p style={{ fontWeight: 700, fontSize: 12, color: '#2D3436', marginBottom: 3 }}>{m.item}</p>
                                                  <p style={{ fontSize: 10, color: '#B2BEC3', marginBottom: 5, lineHeight: 1.4 }}>{m.desc}</p>
                                                  <p style={{ fontSize: 13, fontWeight: 800, color: '#FF6B6B' }}>{m.price}</p>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        {act.tips && <div style={{ background: '#FFF9E6', border: '1px solid #FFE58F', borderRadius: 10, padding: '9px 13px', display: 'flex', gap: 7 }}><span style={{ fontSize: 14, flexShrink: 0 }}>💡</span><p style={{ color: '#856404', fontSize: 12, fontWeight: 500 }}>{act.tips}</p></div>}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Last day buttons */}
                        {activeDay === itinerary.days.length - 1 ? (
                          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                            <button onClick={() => requestGenerate()} style={{ flex: 1, background: 'white', color: '#636E72', border: '2px solid #E8E8E8', borderRadius: 14, padding: 14, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B6B'; e.currentTarget.style.color = '#FF6B6B'; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E8E8'; e.currentTarget.style.color = '#636E72'; }}>
                              <RefreshCw size={16} /> Regenerate Plan
                            </button>
                            <button onClick={() => onBook({ itinerary, package: selectedPkg || itinerary?.package, cart, setCart })} style={{ flex: 2, background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: 'white', border: 'none', borderRadius: 14, padding: 14, fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(255,107,107,0.4)' }}>
                              <BookOpen size={16} /> Book Now →
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                            <button onClick={() => setActiveDay(p => Math.max(0, p - 1))} disabled={activeDay === 0} style={{ background: activeDay === 0 ? '#F7F8FC' : 'white', color: activeDay === 0 ? '#DFE6E9' : '#636E72', border: '2px solid', borderColor: activeDay === 0 ? '#F0F0F0' : '#E0E0E0', borderRadius: 12, padding: '10px 22px', cursor: activeDay === 0 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 13 }}>← Previous Day</button>
                            <button onClick={() => setActiveDay(p => Math.min(itinerary.days.length - 1, p + 1))} style={{ background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: 'white', border: 'none', borderRadius: 12, padding: '10px 22px', cursor: 'pointer', fontWeight: 700, fontSize: 13, boxShadow: '0 6px 18px rgba(255,107,107,0.35)' }}>Next Day →</button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Budget Sidebar */}
                {displayBudget > 0 && (
                  <div style={{ position: 'sticky', top: 80 }}>
                    <div style={{ background: 'white', borderRadius: 20, padding: 22, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0' }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#2D3436', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}><Wallet size={15} color="#FF6B6B" /> Budget Breakdown</h3>
                      <p style={{ fontSize: 11, color: '#B2BEC3', marginBottom: 16 }}>For {people} people · {days} days</p>
                      <div style={{ display: 'flex', height: 11, borderRadius: 100, overflow: 'hidden', marginBottom: 18, gap: 2 }}>
                        {BUDGET_CATEGORIES.map(cat => <div key={cat.key} style={{ flex: cat.pct, background: cat.color, borderRadius: 4 }} />)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                        {BUDGET_CATEGORIES.map(cat => {
                          const custom = Math.round(displayBudget * cat.pct);
                          return (
                            <div key={cat.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: '#F7F8FC', borderRadius: 11 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                <div style={{ width: 9, height: 9, borderRadius: '50%', background: cat.color }} />
                                <p style={{ fontSize: 12, fontWeight: 600, color: '#2D3436' }}>{cat.emoji} {cat.label}</p>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: '#2D3436' }}>₹{custom.toLocaleString()}</p>
                                {days > 1 && <p style={{ fontSize: 10, color: '#B2BEC3' }}>₹{Math.round(custom / days).toLocaleString()}/day</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ marginTop: 16, background: 'linear-gradient(135deg,#FF6B6B15,#FF8E5315)', borderRadius: 13, padding: 14, textAlign: 'center', border: '1px solid #FFE0D0' }}>
                        <p style={{ fontSize: 10, color: '#FF6B6B', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 3 }}>Per Person / Day</p>
                        <p style={{ fontSize: 26, fontWeight: 800, color: '#2D3436', letterSpacing: '-1px' }}>₹{Math.round(displayBudget / people / days).toLocaleString()}</p>
                        <p style={{ fontSize: 11, color: '#B2BEC3', marginTop: 2 }}>{people} people · {days} days</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Package sections */}
        {[['🏔️ Famous North India Packages', north], ['🌴 Famous South India Packages', south], ['🌟 Other Must-Visit Packages', other]].map(([title, pkgs]) => (
          <div key={title} style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#2D3436', marginBottom: 6 }}>{title}</h2>
            <p style={{ color: '#B2BEC3', fontSize: 13, marginBottom: 22 }}>Click any package to generate your AI-powered itinerary</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {pkgs.map(p => <PackageCard key={p.id} p={p} />)}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

// ── BOOKING PAGE ───────────────────────────────────────────────
function BookingPage({ bookingData, cart, setCart, onPayment, onBack }) {
  const { itinerary, package: pkg } = bookingData;
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState('flight');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [transports, setTransports] = useState([]);
  const [searched, setSearched] = useState(false);
  const [showSeatSelector, setShowSeatSelector] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const budgetFromPlan = itinerary?.recommendedBudget || 20000;
  const destinationCities = pkg?.cities || [itinerary?.city || 'Destination'];
  const fromOptions = { flight: ALL_INDIA_AIRPORTS, train: ALL_INDIA_RAILWAYS, bus: ALL_INDIA_BUS_STOPS };

  useEffect(() => { if (step === 1) setHotels(generateHotels(pkg, budgetFromPlan, 2)); }, [step]);

  const search = () => {
    if (!from || !to || !date) { alert('Please fill all fields'); return; }
    setTransports(generateTransports(mode, destinationCities, date));
    setSearched(true);
  };

  const addTransportToCart = (transport, seats) => {
    const seatLabel = seats.map(s => s.id).join(', ');
    const totalPrice = seats.reduce((a, s) => a + s.price, 0);
    setCart(c => [...c, { type: 'transport', name: `${transport.company} · ${mode.charAt(0).toUpperCase() + mode.slice(1)}`, detail: `${from} → ${to} · ${date} · ${transport.departure}-${transport.arrival} · Seats: ${seatLabel}`, price: totalPrice, id: `t-${Date.now()}` }]);
    setShowSeatSelector(null);
  };

  const addHotelToCart = (hotel, roomType) => {
    if (!checkInDate || !checkOutDate) { alert('Please select check-in and check-out dates'); return; }
    const nights = Math.max(1, Math.round((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)));
    setCart(c => [...c, { type: 'hotel', name: `${hotel.name} — ${roomType.type}`, detail: `${hotel.city} · Check-in: ${checkInDate} ${hotel.checkIn} · Check-out: ${checkOutDate} ${hotel.checkOut} · ${nights} nights`, price: roomType.price * nights, id: `h-${Date.now()}-${Math.random()}` }]);
  };

  const transportItems = cart.filter(i => i.type === 'transport');
  const hotelItems = cart.filter(i => i.type === 'hotel');
  const getModeImgKey = m => m === 'flight' ? 'flight' : m === 'train' ? 'train' : 'bus';

  return (
    <div style={{ minHeight: '100vh', background: '#F7F8FC', fontFamily: "'Poppins',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0;}input,select,button{font-family:'Poppins',sans-serif;}input:focus,select:focus{border-color:#FF6B6B!important;outline:none;}`}</style>
      {showSeatSelector && <SeatSelector transport={showSeatSelector} mode={mode} onConfirm={seats => addTransportToCart(showSeatSelector, seats)} onClose={() => setShowSeatSelector(null)} />}

      {/* Nav */}
      <div style={{ background: 'white', borderBottom: '1px solid #F0F0F0', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <button onClick={onBack} style={{ background: '#F7F8FC', border: 'none', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, color: '#636E72' }}><ChevronLeft size={16} /> Back</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', borderRadius: 12, padding: '6px 10px', fontSize: 18 }}>✈️</div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#2D3436' }}>TrekStack · Book Your Trip</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {['Transport', 'Hotel', 'Payment'].map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: i < step ? 'pointer' : 'default' }} onClick={() => i < step && setStep(i)}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: i === step ? 'linear-gradient(135deg,#FF6B6B,#FF8E53)' : i < step ? '#28A745' : '#F0F0F0', color: i <= step ? 'white' : '#B2BEC3' }}>{i < step ? '✓' : i + 1}</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: i === step ? '#2D3436' : '#B2BEC3' }}>{s}</span>
              </div>
              {i < 2 && <div style={{ width: 30, height: 2, background: i < step ? '#28A745' : '#F0F0F0', borderRadius: 1 }} />}
            </React.Fragment>
          ))}
        </div>
        {cart.length > 0 && <div onClick={() => setStep(2)} style={{ background: '#FF6B6B18', border: '1px solid #FF6B6B40', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: '#FF6B6B', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          🛒 {cart.length} item{cart.length > 1 ? 's' : ''} · Checkout →
        </div>}
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 32px 60px' }}>

        {/* STEP 0: TRANSPORT */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#2D3436', marginBottom: 4 }}>Choose Your Transport 🚀</h2>
            <p style={{ color: '#B2BEC3', fontSize: 14, marginBottom: 16 }}>Add multiple transports — mix flights, trains, buses</p>

            {transportItems.length > 0 && (
              <div style={{ background: '#F0FFF4', border: '1px solid #C3E6CB', borderRadius: 14, padding: '14px 18px', marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#28A745', marginBottom: 10 }}>✅ {transportItems.length} transport{transportItems.length > 1 ? 's' : ''} in cart</p>
                {transportItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < transportItems.length - 1 ? '1px solid #C3E6CB80' : 'none' }}>
                    <div><p style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</p><p style={{ fontSize: 11, color: '#636E72' }}>{item.detail}</p></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 700, color: '#FF6B6B' }}>₹{item.price.toLocaleString()}</span>
                      <button onClick={() => setCart(c => c.filter(ci => ci.id !== item.id))} style={{ background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: 16 }}>×</button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setStep(1)} style={{ marginTop: 12, background: 'linear-gradient(135deg,#28A745,#20C997)', color: 'white', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>Continue to Hotel →</button>
              </div>
            )}

            {/* Mode selector with images */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
              {[['flight', 'Flight ✈️', Plane, '#6C63FF'], ['train', 'Train 🚂', Train, '#4ECDC4'], ['bus', 'Bus 🚌', Bus, '#F7B731']].map(([m, label, Icon, color]) => (
                <button key={m} onClick={() => { setMode(m); setSearched(false); }}
                  style={{ flex: 1, padding: 0, borderRadius: 16, border: `3px solid ${mode === m ? color : '#E8E8E8'}`, background: 'white', cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s', boxShadow: mode === m ? `0 8px 24px ${color}40` : 'none' }}>
                  <div style={{ height: 90, overflow: 'hidden', position: 'relative', background: `${color}15` }}>
                    <img src={getImageForQuery(getModeImgKey(m))} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = getFallbackImage(0); }} alt={label} />
                    <div style={{ position: 'absolute', inset: 0, background: mode === m ? `${color}80` : 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={32} color="white" />
                    </div>
                  </div>
                  <div style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: mode === m ? color : '#636E72' }}>{label}</span>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0', marginBottom: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px auto', gap: 14, alignItems: 'end' }}>
                <div><label style={LS}>From (All India)</label>
                  <div style={{ position: 'relative' }}>
                    <select value={from} onChange={e => setFrom(e.target.value)} style={{ ...IS, appearance: 'none', paddingRight: 28 }}>
                      <option value="">Select departure</option>
                      {fromOptions[mode].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#B2BEC3', pointerEvents: 'none' }} />
                  </div>
                </div>
                <div><label style={LS}>To (Trip Destination)</label>
                  <div style={{ position: 'relative' }}>
                    <select value={to} onChange={e => setTo(e.target.value)} style={{ ...IS, appearance: 'none', paddingRight: 28 }}>
                      <option value="">Select destination</option>
                      {destinationCities.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#B2BEC3', pointerEvents: 'none' }} />
                  </div>
                </div>
                <div><label style={LS}>Travel Date</label><input type="date" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} style={IS} /></div>
                <button onClick={search} style={{ background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: 'white', border: 'none', borderRadius: 14, padding: '11px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Poppins',sans-serif" }}>
                  Search {mode === 'flight' ? 'Flights' : mode === 'train' ? 'Trains' : 'Buses'}
                </button>
              </div>
            </div>

            {searched && (
              <div>
                <p style={{ fontSize: 14, color: '#636E72', marginBottom: 16, fontWeight: 500 }}>{transports.length} options found · Click "Select Seats" to add to cart</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {transports.map(t => (
                    <div key={t.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '2px solid #F0F0F0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                      <div style={{ height: 70, position: 'relative', overflow: 'hidden', background: '#F0F0F0' }}>
                        <img src={getImageForQuery(getModeImgKey(mode))} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = getFallbackImage(0); }} alt="transport" />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(45,52,54,0.85),rgba(45,52,54,0.4))', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16 }}>
                          <div><p style={{ color: 'white', fontWeight: 800, fontSize: 16 }}>{t.company}</p><p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>{t.class} · ⭐{t.rating}</p></div>
                          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                            {(t.amenities || []).map((a, ai) => <span key={ai} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: 100, padding: '3px 10px', fontSize: 11 }}>{a}</span>)}
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                          <div style={{ textAlign: 'center' }}><p style={{ fontSize: 20, fontWeight: 800, color: '#2D3436' }}>{t.departure}</p><p style={{ fontSize: 11, color: '#B2BEC3' }}>Depart</p></div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ width: 60, height: 1, background: '#E0E0E0', margin: '0 auto 4px' }} />
                            <p style={{ fontSize: 11, color: '#B2BEC3' }}>{t.duration}</p>
                          </div>
                          <div style={{ textAlign: 'center' }}><p style={{ fontSize: 20, fontWeight: 800, color: '#2D3436' }}>{t.arrival}</p><p style={{ fontSize: 11, color: '#B2BEC3' }}>Arrive</p></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: 22, fontWeight: 900, color: '#FF6B6B' }}>₹{t.price.toLocaleString()}</p>
                            <p style={{ fontSize: 11, color: '#B2BEC3' }}>{t.availableSeats} seats left</p>
                          </div>
                          <button onClick={() => setShowSeatSelector(t)} style={{ background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: 'white', border: 'none', borderRadius: 12, padding: '10px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Poppins',sans-serif" }}>
                            Select Seats →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {transportItems.length > 0 && <button onClick={() => setStep(1)} style={{ width: '100%', background: 'linear-gradient(135deg,#28A745,#20C997)', color: 'white', border: 'none', borderRadius: 16, padding: 16, fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: "'Poppins',sans-serif" }}>
                  Continue to Hotel ({transportItems.length} transport added) →
                </button>}
              </div>
            )}
          </div>
        )}

        {/* STEP 1: HOTEL */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#2D3436', marginBottom: 4 }}>Choose Your Hotel 🏨</h2>
            <p style={{ color: '#B2BEC3', fontSize: 14, marginBottom: 16 }}>Add multiple rooms or hotels to your cart</p>

            <div style={{ background: 'white', borderRadius: 16, padding: 20, border: '1px solid #F0F0F0', marginBottom: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label style={LS}>Check-in Date</label><input type="date" value={checkInDate} min={new Date().toISOString().split('T')[0]} onChange={e => setCheckInDate(e.target.value)} style={IS} /></div>
              <div><label style={LS}>Check-out Date</label><input type="date" value={checkOutDate} min={checkInDate || new Date().toISOString().split('T')[0]} onChange={e => setCheckOutDate(e.target.value)} style={IS} /></div>
            </div>

            {hotelItems.length > 0 && (
              <div style={{ background: '#F0FFF4', border: '1px solid #C3E6CB', borderRadius: 14, padding: '14px 18px', marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#28A745', marginBottom: 10 }}>✅ {hotelItems.length} accommodation{hotelItems.length > 1 ? 's' : ''} in cart</p>
                {hotelItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < hotelItems.length - 1 ? '1px solid #C3E6CB80' : 'none' }}>
                    <div><p style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</p><p style={{ fontSize: 11, color: '#636E72' }}>{item.detail}</p></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 700, color: '#FF6B6B' }}>₹{item.price.toLocaleString()}</span>
                      <button onClick={() => setCart(c => c.filter(ci => ci.id !== item.id))} style={{ background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: 16 }}>×</button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setStep(2)} style={{ marginTop: 12, background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: 'white', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>Proceed to Payment →</button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {hotels.map(h => (
                <div key={h.id} style={{ background: 'white', borderRadius: 18, overflow: 'hidden', border: '2px solid #F0F0F0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr' }}>
                    <div style={{ position: 'relative', minHeight: 180, background: '#F0F0F0', overflow: 'hidden' }}>
                      <img src={getImageForQuery(h.imgKey || h.city.toLowerCase())} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 180 }} onError={e => { e.target.src = getImageForQuery('hotel'); }} alt={h.name} />
                      <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.65)', color: 'white', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>{'⭐'.repeat(Math.min(h.stars, 5))}</div>
                    </div>
                    <div style={{ padding: '18px 22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2D3436' }}>{h.name}</h3>
                        <span style={{ background: '#FFF9E6', color: '#856404', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>⭐{h.rating}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#74B9FF', marginBottom: 4 }}><MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />{h.address}</p>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#636E72', marginBottom: 6 }}>
                        <span>🕐 Check-in: <strong>{h.checkIn}</strong></span>
                        <span>🕐 Check-out: <strong>{h.checkOut}</strong></span>
                      </div>
                      <p style={{ fontSize: 12, color: h.cancellation.includes('Free') ? '#28A745' : '#FF6B6B', marginBottom: 10, fontWeight: 500 }}>🔒 {h.cancellation}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                        {(h.amenities || []).map((a, ai) => <span key={ai} style={{ background: '#F7F8FC', color: '#636E72', borderRadius: 100, padding: '3px 10px', fontSize: 11 }}>{a}</span>)}
                      </div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#B2BEC3', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>Room Types</p>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {h.roomTypes.map((rt, ri) => (
                          <div key={ri} style={{ background: '#F7F8FC', borderRadius: 12, padding: '10px 14px', border: '1px solid #E8E8E8', flex: 1, minWidth: 140 }}>
                            <p style={{ fontWeight: 700, fontSize: 13, color: '#2D3436', marginBottom: 2 }}>{rt.type}</p>
                            <p style={{ fontSize: 11, color: '#B2BEC3', marginBottom: 8, lineHeight: 1.4 }}>{rt.desc}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 14, fontWeight: 800, color: '#FF6B6B' }}>₹{rt.price.toLocaleString()}<span style={{ fontSize: 10, fontWeight: 400, color: '#B2BEC3' }}>/nt</span></span>
                              <button onClick={() => addHotelToCart(h, rt)} style={{ background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>+ Add</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {hotelItems.length > 0 && <button onClick={() => setStep(2)} style={{ width: '100%', background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: 'white', border: 'none', borderRadius: 16, padding: 16, fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: "'Poppins',sans-serif" }}>
              <CreditCard size={18} /> Proceed to Payment →
            </button>}
          </div>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 2 && <PaymentStep cart={cart} setCart={setCart} onPayment={onPayment} />}
      </div>
    </div>
  );
}

// ── PAYMENT STEP ───────────────────────────────────────────────
function PaymentStep({ cart, setCart, onPayment }) {
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [bank, setBank] = useState('');
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((a, i) => a + i.price, 0);
  const gst = Math.round(subtotal * 0.18);
  const convenience = cart.length * 49;
  const total = subtotal + gst + convenience;

  const pay = async () => {
    if (method === 'upi' && !upiId) { alert('Enter UPI ID'); return; }
    if (method === 'card' && (!card.number || !card.name || !card.expiry || !card.cvv)) { alert('Fill all card details'); return; }
    if (method === 'netbanking' && !bank) { alert('Select a bank'); return; }
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2500));
    setProcessing(false);
    onPayment();
  };

  return (
    <div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#2D3436', marginBottom: 24 }}>Complete Payment 💳</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {[['upi', 'UPI', Smartphone, '#6C63FF'], ['card', 'Card', CreditCard, '#FF6B6B'], ['netbanking', 'Net Banking', Building2, '#4ECDC4']].map(([m, label, Icon, color]) => (
              <button key={m} onClick={() => setMethod(m)} style={{ flex: 1, padding: '14px 12px', borderRadius: 14, border: `2px solid ${method === m ? color : '#E8E8E8'}`, background: method === m ? `${color}10` : 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: "'Poppins',sans-serif" }}>
                <Icon size={20} color={method === m ? color : '#B2BEC3'} />
                <span style={{ fontSize: 12, fontWeight: 700, color: method === m ? color : '#636E72' }}>{label}</span>
              </button>
            ))}
          </div>
          <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0' }}>
            {method === 'upi' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2D3436', marginBottom: 16 }}>Pay via UPI</h3>
                <label style={LS}>UPI ID</label>
                <input placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} style={{ ...IS, marginBottom: 16 }} />
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                    <div key={app} onClick={() => setUpiId(app.toLowerCase().replace(' ', '') + '@upi')} style={{ background: '#F7F8FC', border: '1px solid #E8E8E8', borderRadius: 12, padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#636E72', cursor: 'pointer' }}>{app}</div>
                  ))}
                </div>
              </div>
            )}
            {method === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2D3436' }}>Card Details</h3>
                <div><label style={LS}>Card Number</label><input placeholder="1234 5678 9012 3456" maxLength={19} value={card.number} onChange={e => setCard({ ...card, number: e.target.value.replace(/[^\d]/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19) })} style={IS} /></div>
                <div><label style={LS}>Cardholder Name</label><input placeholder="Name on card" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} style={IS} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label style={LS}>Expiry (MM/YY)</label><input placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} style={IS} /></div>
                  <div><label style={LS}>CVV</label><input type="password" placeholder="•••" maxLength={4} value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} style={IS} /></div>
                </div>
              </div>
            )}
            {method === 'netbanking' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2D3436', marginBottom: 16 }}>Select Your Bank</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'Kotak', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank'].map(b => (
                    <div key={b} onClick={() => setBank(b)} style={{ padding: '12px 10px', borderRadius: 12, border: `2px solid ${bank === b ? '#FF6B6B' : '#E8E8E8'}`, background: bank === b ? '#FFF5F5' : 'white', cursor: 'pointer', textAlign: 'center', fontSize: 12, fontWeight: 600, color: bank === b ? '#FF6B6B' : '#636E72' }}>{b}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ position: 'sticky', top: 90 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2D3436', marginBottom: 18 }}>Order Summary</h3>
            {cart.map((item, i) => (
              <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #F0F0F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, marginRight: 8 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: '#2D3436' }}>{item.name}</p>
                    <p style={{ fontSize: 11, color: '#B2BEC3', marginTop: 2, lineHeight: 1.4 }}>{item.detail}</p>
                  </div>
                  <p style={{ fontWeight: 800, color: '#2D3436', fontSize: 14, flexShrink: 0 }}>₹{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#636E72', fontSize: 13 }}>Subtotal</span><span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#636E72', fontSize: 13 }}>GST (18%)</span><span style={{ fontWeight: 600 }}>₹{gst.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#636E72', fontSize: 13 }}>Convenience Fee</span><span style={{ fontWeight: 600 }}>₹{convenience}</span></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, color: '#2D3436', borderTop: '2px solid #F0F0F0', paddingTop: 14, marginBottom: 20 }}>
              <span>Total</span><span style={{ color: '#FF6B6B' }}>₹{total.toLocaleString()}</span>
            </div>
            <button onClick={pay} disabled={processing} style={{ width: '100%', background: processing ? '#DFE6E9' : 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: processing ? '#B2BEC3' : 'white', border: 'none', borderRadius: 14, padding: 16, fontWeight: 800, fontSize: 16, cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: "'Poppins',sans-serif" }}>
              {processing ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : <><Zap size={18} /> Pay ₹{total.toLocaleString()} Now</>}
            </button>
            <p style={{ textAlign: 'center', fontSize: 11, color: '#B2BEC3', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Shield size={11} /> Safe & Secure Payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────
export default function Root() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('ts_user') || 'null'));
  const [page, setPage] = useState('home');
  const [bookingData, setBookingData] = useState(null);
  const [cart, setCart] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleLogin = u => { setUser(u); localStorage.setItem('ts_user', JSON.stringify(u)); };
  const handleLogout = () => { setUser(null); localStorage.removeItem('ts_user'); setPage('home'); setCart([]); };

  if (!user) return <AuthPage onLogin={handleLogin} />;

  if (paymentSuccess) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#F0FFF4,#E8F5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins',sans-serif" }}>
      <div style={{ background: 'white', borderRadius: 28, padding: '52px 44px', textAlign: 'center', maxWidth: 480, boxShadow: '0 24px 64px rgba(0,0,0,0.1)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#28A745,#20C997)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36, boxShadow: '0 8px 24px rgba(40,167,69,0.4)' }}>✓</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#2D3436', marginBottom: 8 }}>Booking Confirmed! 🎉</h2>
        <p style={{ color: '#636E72', fontSize: 15, marginBottom: 20 }}>Your trip has been booked successfully. Have an amazing journey!</p>
        <div style={{ background: '#F7F8FC', borderRadius: 16, padding: 20, marginBottom: 28 }}>
          <p style={{ fontSize: 13, color: '#B2BEC3', marginBottom: 4 }}>Amount Paid</p>
          <p style={{ fontSize: 32, fontWeight: 900, color: '#28A745' }}>₹{Math.round(cart.reduce((a, i) => a + i.price, 0) * 1.18 + cart.length * 49).toLocaleString()}</p>
          <p style={{ fontSize: 12, color: '#B2BEC3', marginTop: 4 }}>Booking ID: TRK{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
        </div>
        <button onClick={() => { setCart([]); setPaymentSuccess(false); setPage('home'); }} style={{ background: 'linear-gradient(135deg,#FF6B6B,#FF8E53)', color: 'white', border: 'none', borderRadius: 14, padding: '14px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>
          Back to Home ✈️
        </button>
      </div>
    </div>
  );

  if (page === 'booking') return (
    <BookingPage
      bookingData={bookingData}
      cart={cart}
      setCart={setCart}
      onPayment={() => { setPaymentSuccess(true); setPage('home'); }}
      onBack={() => setPage('home')}
    />
  );

  return <HomePage user={user} cart={cart} setCart={setCart} onBook={data => { setBookingData(data); setPage('booking'); }} onLogout={handleLogout} />;
}

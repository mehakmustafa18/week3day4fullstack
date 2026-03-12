import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, TextField, Button, Typography,
  Alert, InputAdornment, IconButton, CircularProgress, Tabs, Tab, Divider
} from '@mui/material';
import EmailRoundedIcon     from '@mui/icons-material/EmailRounded';
import LockRoundedIcon      from '@mui/icons-material/LockRounded';
import PersonRoundedIcon    from '@mui/icons-material/PersonRounded';
import VisibilityRoundedIcon    from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import gsap from 'gsap';
import { loginUser, registerUser } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab]       = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [form, setForm]         = useState({ name: '', email: '', password: '' });

  const wrapRef    = useRef(null);
  const logoRef    = useRef(null);
  const cardRef    = useRef(null);
  const fieldsRef  = useRef([]);

  // useEffect(() => {
  //   // Check already logged in
  //   if (localStorage.getItem('tf_token')) { navigate('/dashboard'); return; }

  //   const tl = gsap.timeline();
  //   tl.from(logoRef.current, { scale: 0.5, rotation: -90, duration: 0.6, ease: 'back.out(2.2)' })
  //     .from('.login-title',    { y: -28, opacity: 0, duration: 0.55, ease: 'power3.out' }, '-=0.4')
  //     .from('.login-sub',      { y: 18,  opacity: 0, duration: 0.45 }, '-=0.3')
  //     .from(cardRef.current, { y: 20, opacity: 0, scale: 0.98, duration: 0.4, ease: 'power3.out' }, '-=0.3')
  //     .from(fieldsRef.current.filter(Boolean), { y: 15, opacity: 0, stagger: 0.08, duration: 0.35, ease: 'power2.out' }, '-=0.35');

  //   // Bg orbs movement
  //   gsap.to('.orb-a', { x: 25, y: -18, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  //   gsap.to('.orb-b', { x: -18, y: 25,  duration: 5.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  //   gsap.to('.orb-c', { x: 12,  y: 12,  duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  // }, []);

  useEffect(() => {
    if (localStorage.getItem('tf_token')) { navigate('/dashboard'); return; }
    // Sirf orbs animate honge, form hamesha visible rahega
    gsap.to('.orb-a', { x: 25, y: -18, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.orb-b', { x: -18, y: 25,  duration: 5.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.orb-c', { x: 12,  y: 12,  duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }, []);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async () => {
    if (!form.email || !form.password || (tab === 1 && !form.name)) {
      gsap.to(cardRef.current, { x: [-9, 9, -7, 7, -4, 4, 0], duration: 0.45 });
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = tab === 0
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser(form);

      localStorage.setItem('tf_token', res.data.token);
      localStorage.setItem('tf_user', JSON.stringify(res.data.user));

      if (tab === 1) setSuccess('Account created! Redirecting...');

      gsap.to(cardRef.current, {
        scale: 1.025, duration: 0.2, yoyo: true, repeat: 1,
        onComplete: () => navigate('/dashboard')
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
      gsap.to(cardRef.current, { x: [-9, 9, -7, 7, -4, 4, 0], duration: 0.45 });
    } finally { setLoading(false); }
  };

  const addRef = (el, i) => { if (el) fieldsRef.current[i] = el; };

  return (
    <Box ref={wrapRef} sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(145deg, #0a1628 0%, #0d1f3c 40%, #091525 100%)',
      position: 'relative', overflow: 'hidden', p: 2,
    }}>
      {/* Background orbs - brighter */}
      {[
        { cls: 'orb-a', top: '10%',   left: '5%',   w: 500, color: '0,212,255',  o: 0.12 },
        { cls: 'orb-b', bottom: '10%',right: '5%',  w: 450, color: '0,86,255',   o: 0.15 },
        { cls: 'orb-c', top: '50%',   right: '25%', w: 250, color: '245,197,24', o: 0.08 },
      ].map(({ cls, top, bottom, left, right, w, color, o }) => (
        <Box key={cls} className={cls} sx={{
          position: 'absolute', width: w, height: w,
          top, bottom, left, right,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${color},${o}) 0%, transparent 65%)`,
          filter: 'blur(35px)', pointerEvents: 'none',
        }} />
      ))}

      {/* Grid lines - more visible */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,212,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.06) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
      }} />

      <Box sx={{ width: '100%', maxWidth: 430, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Box ref={logoRef} sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '15px',
            background: 'linear-gradient(135deg, #00d4ff, #0056ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 32px rgba(0,212,255,0.45)',
          }}>
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 26, color: '#fff' }}>T</Typography>
          </Box>
        </Box>

        <Typography className="login-title" sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.1rem', textAlign: 'center', color: '#e8edf5', mb: 0.5 }}>
          Team<span style={{ color: '#00d4ff' }}>Flow</span>
        </Typography>
        <Typography className="login-sub" sx={{ textAlign: 'center', color: '#a0b4cc', fontSize: '0.88rem', mb: 3.5 }}>
          Project & Team Management Portal
        </Typography>

        <Card ref={cardRef} sx={{ p: { xs: 3, sm: 4 }, background: "rgba(15,28,52,0.97)", border: "1px solid rgba(0,212,255,0.25)", boxShadow: "0 8px 48px rgba(0,0,0,0.6)" }}>
          <Tabs value={tab}
            onChange={(_, v) => { setTab(v); setError(''); setSuccess(''); setForm({ name: '', email: '', password: '' }); }}
            sx={{
              mb: 3,
              '& .MuiTabs-indicator': { background: '#00d4ff', height: 2, borderRadius: 2 },
              '& .MuiTab-root': { fontFamily: 'Syne', fontWeight: 600, textTransform: 'none', color: '#8896a8', flex: 1, '&.Mui-selected': { color: '#00d4ff' } },
            }}>
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>

          {error   && <Alert severity="error"   sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>{success}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {tab === 1 && (
              <Box ref={(el) => addRef(el, 0)}>
                <TextField fullWidth label="Full Name" name="name" value={form.name} onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonRoundedIcon sx={{ color: '#00d4ff', fontSize: 19 }} /></InputAdornment> }} />
              </Box>
            )}
            <Box ref={(el) => addRef(el, 1)}>
              <TextField fullWidth label="Email Address" name="email" type="email" value={form.email} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailRoundedIcon sx={{ color: '#00d4ff', fontSize: 19 }} /></InputAdornment> }} />
            </Box>
            <Box ref={(el) => addRef(el, 2)}>
              <TextField fullWidth label="Password" name="password" type={showPass ? 'text' : 'password'}
                value={form.password} onChange={handleChange} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockRoundedIcon sx={{ color: '#00d4ff', fontSize: 19 }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} edge="end" sx={{ color: '#8896a8' }}>
                        {showPass ? <VisibilityOffRoundedIcon sx={{ fontSize: 19 }} /> : <VisibilityRoundedIcon sx={{ fontSize: 19 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }} />
            </Box>
            <Box ref={(el) => addRef(el, 3)}>
              <Button fullWidth variant="contained" size="large" onClick={handleSubmit} disabled={loading}
                sx={{ height: 50, fontSize: '0.95rem' }}>
                {loading ? <CircularProgress size={21} sx={{ color: '#fff' }} /> : tab === 0 ? 'Sign In' : 'Create Account'}
              </Button>
            </Box>
          </Box>

          {tab === 0 && (
            <>
              <Divider sx={{ my: 2.5, borderColor: 'rgba(0,212,255,0.08)' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#4a5568', px: 1 }}>DEMO CREDENTIALS</Typography>
              </Divider>
              <Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)', textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#8896a8' }}>
                  Register a new account to get started!
                </Typography>
              </Box>
            </>
          )}
        </Card>
      </Box>
    </Box>
  );
}
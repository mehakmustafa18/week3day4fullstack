import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, Avatar, LinearProgress, CircularProgress } from '@mui/material';
import FolderRoundedIcon        from '@mui/icons-material/FolderRounded';
import PeopleRoundedIcon        from '@mui/icons-material/PeopleRounded';
import CheckCircleRoundedIcon   from '@mui/icons-material/CheckCircleRounded';
import TrendingUpRoundedIcon    from '@mui/icons-material/TrendingUpRounded';
import AccessTimeRoundedIcon    from '@mui/icons-material/AccessTimeRounded';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import { getProjects, getMembers } from '../services/api';

const MEMBER_COLORS = ['#00d4ff','#f5c518','#00e5a0','#ff4757','#a855f7','#f97316'];

function StatCard({ icon, label, value, color, delay }) {
  const numRef  = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const obj = { v: 0 };
    gsap.to(obj, {
      v: value, duration: 1.8, delay: delay + 0.25, ease: 'power2.out',
      onUpdate: () => { if (numRef.current) numRef.current.textContent = Math.round(obj.v); }
    });
    const el = cardRef.current;
    const enter = () => gsap.to(el, { y: -4, boxShadow: `0 16px 40px rgba(0,0,0,0.45), 0 0 20px ${color}25`, duration: 0.25 });
    const leave = () => gsap.to(el, { y: 0,  boxShadow: '0 4px 24px rgba(0,0,0,0.35)', duration: 0.25 });
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave); };
  }, [value]);

  return (
    <Card ref={cardRef}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
          <Box sx={{
            width: 46, height: 46, borderRadius: '12px',
            background: `${color}14`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', border: `1px solid ${color}25`,
          }}>
            {React.cloneElement(icon, { sx: { color, fontSize: 22 } })}
          </Box>
          <TrendingUpRoundedIcon sx={{ color: '#00e5a0', fontSize: 16, opacity: 0.6 }} />
        </Box>
        <Typography ref={numRef} sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.6rem', color: '#e8edf5', lineHeight: 1, mb: 0.5 }}>
          0
        </Typography>
        <Typography sx={{ color: '#8896a8', fontSize: '0.82rem', fontWeight: 500, mb: 2 }}>{label}</Typography>
        <LinearProgress variant="determinate" value={Math.min((value / 15) * 100, 100)}
          sx={{ height: 2.5, borderRadius: 2, '& .MuiLinearProgress-bar': { background: color } }} />
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [members,  setMembers]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const pageRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    loadData();
    gsap.to(heroRef.current, { y: -8, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    // SVG draw
    setTimeout(() => {
      const paths = document.querySelectorAll('.hero-svg path, .hero-svg circle, .hero-svg rect');
      gsap.set(paths, { strokeDasharray: 500, strokeDashoffset: 500, opacity: 0 });
      gsap.to(paths, { strokeDashoffset: 0, opacity: 1, duration: 1.8, stagger: 0.15, ease: 'power2.inOut', delay: 0.3 });
    }, 100);
  }, []);

  useEffect(() => {
    if (projects.length) {
      setTimeout(() => {
        gsap.from('.recent-item', { x: -25, opacity: 0, stagger: 0.09, duration: 0.45, ease: 'power2.out' });
      }, 50);
    }
  }, [projects]);

  const loadData = async () => {
    try {
      const [p, m] = await Promise.all([getProjects(), getMembers()]);
      setProjects(p.data);
      setMembers(m.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const active    = projects.filter(p => p.status === 'active').length;
  const completed = projects.filter(p => p.status === 'completed').length;
  const user      = JSON.parse(localStorage.getItem('tf_user') || '{}');

  const statusColor = (s) => ({ active: '#00d4ff', completed: '#00e5a0', 'on-hold': '#f5c518', planning: '#a855f7' }[s] || '#8896a8');
  const priorityColor = (p) => ({ critical: '#ff4757', high: '#f5c518', medium: '#00d4ff', low: '#00e5a0' }[p] || '#8896a8');

  return (
    <Box ref={pageRef} sx={{ minHeight: '100vh', background: '#080c14', pt: '64px' }}>
      <Navbar />
      <Box sx={{ px: { xs: 2, md: 5 }, py: 4, maxWidth: 1300, mx: 'auto' }}>

        {/* Hero */}
        <Box sx={{
          borderRadius: '20px', p: { xs: 3, md: 5 }, mb: 5, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(130deg, rgba(0,86,255,0.13) 0%, rgba(0,212,255,0.07) 50%, rgba(8,12,20,0.98) 100%)',
          border: '1px solid rgba(0,212,255,0.12)',
        }}>
          <Box sx={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(0,212,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.035) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }} />
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography className="dash-title" sx={{
                fontFamily: 'Syne', fontWeight: 800, fontSize: { xs: '1.85rem', md: '2.8rem' },
                color: '#e8edf5', lineHeight: 1.18, mb: 2,
              }}>
                Welcome back,{' '}
                <Box component="span" sx={{
                  background: 'linear-gradient(90deg, #00d4ff, #0077ff)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {user.name?.split(' ')[0] || 'User'}
                </Box>{' '}👋
              </Typography>
              <Typography className="dash-sub" sx={{ color: '#8896a8', fontSize: '1rem', mb: 3, lineHeight: 1.7, maxWidth: 480 }}>
                Your workspace has{' '}
                <strong style={{ color: '#00d4ff' }}>{active} active project{active !== 1 ? 's' : ''}</strong> and{' '}
                <strong style={{ color: '#00e5a0' }}>{members.length} team member{members.length !== 1 ? 's' : ''}</strong>.
              </Typography>
              <Box className="dash-chips" sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {[
                  { label: `${projects.length} Projects`, c: '#00d4ff' },
                  { label: `${completed} Completed`, c: '#00e5a0' },
                  { label: `${members.length} Members`, c: '#f5c518' },
                ].map(({ label, c }) => (
                  <Chip key={label} label={label} sx={{
                    background: `${c}12`, color: c,
                    border: `1px solid ${c}28`, fontFamily: 'Syne', fontWeight: 600, fontSize: '0.8rem',
                  }} />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box ref={heroRef}>
                <svg className="hero-svg" width="230" height="190" viewBox="0 0 230 190" fill="none">
                  <rect x="15" y="25" width="200" height="140" rx="14" stroke="rgba(0,212,255,0.35)" strokeWidth="1.2" fill="none" />
                  <rect x="30" y="45" width="90" height="9" rx="5" fill="#00d4ff" opacity="0.55" />
                  <rect x="30" y="61" width="60" height="6" rx="3" fill="#8896a8" opacity="0.35" />
                  <circle cx="180" cy="57" r="18" stroke="#f5c518" strokeWidth="1.4" fill="none" opacity="0.55" />
                  <path d="M172 57 L177 62 L188 51" stroke="#f5c518" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.75" />
                  <line x1="30" y1="86" x2="200" y2="86" stroke="rgba(0,212,255,0.12)" strokeWidth="1" />
                  <rect x="30" y="100" width="65" height="7" rx="3.5" fill="#00e5a0" opacity="0.5" />
                  <rect x="105" y="100" width="45" height="7" rx="3.5" fill="#8896a8" opacity="0.25" />
                  <rect x="30" y="115" width="50" height="7" rx="3.5" fill="#8896a8" opacity="0.25" />
                  <rect x="90" y="115" width="70" height="7" rx="3.5" fill="#00d4ff" opacity="0.38" />
                  <rect x="30" y="130" width="80" height="7" rx="3.5" fill="#a855f7" opacity="0.35" />
                  <rect x="120" y="130" width="40" height="7" rx="3.5" fill="#8896a8" opacity="0.2" />
                  <circle cx="115" cy="12" r="5" stroke="#00d4ff" strokeWidth="1.2" fill="none" opacity="0.5" />
                </svg>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Stats */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress sx={{ color: '#00d4ff' }} /></Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { icon: <FolderRoundedIcon />,      label: 'Total Projects',   value: projects.length, color: '#00d4ff', delay: 0    },
                { icon: <PeopleRoundedIcon />,      label: 'Team Members',     value: members.length,  color: '#f5c518', delay: 0.1  },
                { icon: <TrendingUpRoundedIcon />,  label: 'Active Projects',  value: active,          color: '#00d4ff', delay: 0.2  },
                { icon: <CheckCircleRoundedIcon />, label: 'Completed',        value: completed,       color: '#00e5a0', delay: 0.3  },
              ].map((s, i) => (
                <Grid item xs={12} sm={6} lg={3} key={i}>
                  <StatCard {...s} />
                </Grid>
              ))}
            </Grid>

            {/* Recent activity */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem', color: '#e8edf5', mb: 3 }}>
                      Recent Projects
                    </Typography>
                    {projects.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 5, color: '#4a5568' }}>
                        <FolderRoundedIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
                        <Typography sx={{ fontFamily: 'Syne', fontWeight: 600 }}>No projects yet</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                        {projects.slice(0, 6).map((p) => (
                          <Box className="recent-item" key={p._id} sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            p: 1.8, borderRadius: '10px', background: 'rgba(255,255,255,0.025)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'all 0.2s',
                            '&:hover': { background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)' }
                          }}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.875rem', color: '#e8edf5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {p.title}
                              </Typography>
                              <Typography sx={{ fontSize: '0.73rem', color: '#8896a8', mt: 0.3 }}>
                                {(p.techStack || []).slice(0, 3).join(' · ') || 'No stack defined'}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 1 }}>
                              {p.priority && (
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: priorityColor(p.priority), flexShrink: 0 }} />
                              )}
                              <Chip label={p.status} size="small" sx={{
                                background: `${statusColor(p.status)}14`, color: statusColor(p.status),
                                border: `1px solid ${statusColor(p.status)}28`,
                                fontFamily: 'Syne', fontWeight: 600, fontSize: '0.68rem',
                                textTransform: 'capitalize', flexShrink: 0,
                              }} />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={5}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem', color: '#e8edf5', mb: 3 }}>
                      Team
                    </Typography>
                    {members.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 5, color: '#4a5568' }}>
                        <PeopleRoundedIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
                        <Typography sx={{ fontFamily: 'Syne', fontWeight: 600 }}>No members yet</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {members.slice(0, 6).map((m, i) => {
                          const c = MEMBER_COLORS[i % MEMBER_COLORS.length];
                          return (
                            <Box key={m._id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 36, height: 36, fontSize: '0.77rem', fontFamily: 'Syne', fontWeight: 700, background: `${c}1a`, color: c, border: `1.5px solid ${c}35` }}>
                                {m.avatar}
                              </Avatar>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.855rem', color: '#e8edf5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {m.name}
                                </Typography>
                                <Typography sx={{ fontSize: '0.73rem', color: '#8896a8' }}>{m.role}</Typography>
                              </Box>
                              <Typography sx={{ fontSize: '0.72rem', color: '#4a5568', flexShrink: 0 }}>
                                {m.projects?.length || 0} proj
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
}

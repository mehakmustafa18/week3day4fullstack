import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Typography, IconButton,
  Avatar, Menu, MenuItem, Divider, Tooltip, Chip
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import gsap from 'gsap';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardRoundedIcon sx={{ fontSize: 17 }} /> },
  { label: 'Projects',  path: '/projects',  icon: <FolderRoundedIcon  sx={{ fontSize: 17 }} /> },
  { label: 'Members',   path: '/members',   icon: <PeopleRoundedIcon  sx={{ fontSize: 17 }} /> },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const navRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('tf_user') || '{}');


  const handleLogout = () => {
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_user');
    navigate('/login');
  };

  const initials = user.avatar || user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <AppBar ref={navRef} position="fixed" elevation={0}>
      <Toolbar sx={{ px: { xs: 2, md: 4 }, height: 64, justifyContent: 'space-between' }}>

        {/* Logo */}
        <Box onClick={() => navigate('/dashboard')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', userSelect: 'none' }}>
          <Box sx={{
            width: 34, height: 34, borderRadius: '9px',
            background: 'linear-gradient(135deg, #00d4ff, #0056ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(0,212,255,0.4)',
          }}>
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, color: '#fff', lineHeight: 1 }}>T</Typography>
          </Box>
          <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.15rem', color: '#e8edf5', display: { xs: 'none', sm: 'block' } }}>
            Team<span style={{ color: '#00d4ff' }}>Flow</span>
          </Typography>
        </Box>

        {/* Nav Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Box key={item.path} onClick={() => navigate(item.path)} sx={{
                display: 'flex', alignItems: 'center', gap: 0.8,
                px: { xs: 1.5, md: 2 }, py: 1, borderRadius: '9px', cursor: 'pointer',
                background: active ? 'rgba(0,212,255,0.1)' : 'transparent',
                border: `1px solid ${active ? 'rgba(0,212,255,0.2)' : 'transparent'}`,
                color: active ? '#00d4ff' : '#8896a8',
                transition: 'all 0.2s ease',
                '&:hover': { background: 'rgba(0,212,255,0.07)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.12)' },
              }}>
                {item.icon}
                <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.85rem', display: { xs: 'none', sm: 'block' } }}>
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* User */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip label={user.name?.split(' ')[0] || 'User'} size="small"
            sx={{ fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.78rem', background: 'rgba(0,212,255,0.07)', color: '#8896a8', border: '1px solid rgba(0,212,255,0.1)', display: { xs: 'none', md: 'flex' } }}
          />
          <Tooltip title="Account settings">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
              <Avatar sx={{
                width: 34, height: 34, fontSize: '0.78rem',
                fontFamily: 'Syne', fontWeight: 700,
                background: 'rgba(0,212,255,0.1)', color: '#00d4ff',
                border: '1.5px solid rgba(0,212,255,0.25)',
              }}>
                {initials}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          sx={{ mt: 1 }}>
          <MenuItem disabled sx={{ opacity: '1 !important', py: 1.5 }}>
            <Box>
              <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem', color: '#e8edf5' }}>{user.name}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#8896a8' }}>{user.email}</Typography>
            </Box>
          </MenuItem>
          <Divider sx={{ borderColor: 'rgba(0,212,255,0.08)', my: 0.5 }} />
          <MenuItem onClick={handleLogout} sx={{ color: '#ff4757', gap: 1.5, '&:hover': { background: 'rgba(255,71,87,0.08)' } }}>
            <LogoutRoundedIcon sx={{ fontSize: 17 }} />
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.875rem' }}>Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

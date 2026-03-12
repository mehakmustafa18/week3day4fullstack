import React, { useEffect, useRef, useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Chip, IconButton, Tooltip,
  Avatar, Alert, Snackbar, Grid, FormControl, InputLabel, Select,
  MenuItem, OutlinedInput, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import AddRoundedIcon       from '@mui/icons-material/AddRounded';
import EditRoundedIcon      from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon    from '@mui/icons-material/DeleteRounded';
import PeopleRoundedIcon    from '@mui/icons-material/PeopleRounded';
import SearchRoundedIcon    from '@mui/icons-material/SearchRounded';
import GridViewRoundedIcon  from '@mui/icons-material/GridViewRounded';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import { getMembers, createMember, updateMember, deleteMember, getProjects } from '../services/api';

const ROLES = ['Frontend Developer','Backend Developer','Full Stack Developer','DevOps Engineer','UI/UX Designer','Product Manager','QA Engineer','Data Scientist','Mobile Developer','Tech Lead','Scrum Master','Cloud Architect'];
const STATUS_OPTIONS = ['active','inactive','on-leave'];
const COLORS = ['#00d4ff','#f5c518','#00e5a0','#ff4757','#a855f7','#f97316','#ec4899','#06b6d4'];
const EMPTY  = { name: '', role: '', email: '', projects: [], phone: '', department: '', status: 'active' };

export default function Members() {
  const [members,  setMembers]  = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [open,     setOpen]     = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [search,   setSearch]   = useState('');
  const [view,     setView]     = useState('grid');
  const [toast,    setToast]    = useState({ open: false, msg: '', type: 'success' });
  const [saving,   setSaving]   = useState(false);
  const pageRef   = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [m, p] = await Promise.all([getMembers(), getProjects()]);
      setMembers(m.data);
      setProjects(p.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const animateItems = () => {
    setTimeout(() => {
      gsap.from('.mem-item', { y: 28, opacity: 0, stagger: 0.08, duration: 0.44, ease: 'power2.out' });
    }, 60);
  };

  const openDialog = (m = null) => {
    setEditing(m);
    setForm(m ? {
      name: m.name, role: m.role, email: m.email,
      projects: (m.projects || []).map(p => p._id || p),
      phone: m.phone || '', department: m.department || '',
      status: m.status || 'active'
    } : EMPTY);
    setOpen(true);
    setTimeout(() => {
      if (dialogRef.current) gsap.from(dialogRef.current, { scale: 0.9, opacity: 0, duration: 0.32, ease: 'back.out(1.7)' });
    }, 10);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.role || !form.email.trim()) {
      if (dialogRef.current) gsap.to(dialogRef.current, { x: [-8,8,-6,6,-3,3,0], duration: 0.4 });
      return;
    }
    setSaving(true);
    try {
      if (editing) { await updateMember(editing._id, form); showToast('Member updated!', 'success'); }
      else         { await createMember(form);              showToast('Member added!', 'success');   }
      setOpen(false);
      await loadData();
      animateItems();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error occurred', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await deleteMember(deleteId);
      showToast('Member removed.', 'success');
      setDeleteId(null);
      await loadData();
    } catch { showToast('Delete failed.', 'error'); }
  };

  const showToast = (msg, type) => setToast({ open: true, msg, type });
  const getColor  = (i) => COLORS[i % COLORS.length];

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s) => ({ active: '#00e5a0', inactive: '#ff4757', 'on-leave': '#f5c518' }[s] || '#8896a8');

  return (
    <Box ref={pageRef} sx={{ minHeight: '100vh', background: '#080c14', pt: '64px' }}>
      <Navbar />
      <Box sx={{ px: { xs: 2, md: 5 }, py: 4, maxWidth: 1300, mx: 'auto' }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: '#e8edf5' }}>Team Members</Typography>
            <Typography sx={{ color: '#8896a8', mt: 0.4, fontSize: '0.875rem' }}>
              {members.length} members · {members.filter(m => m.status === 'active').length} active
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, background: 'rgba(13,20,33,0.85)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '10px', px: 2, py: 1 }}>
              <SearchRoundedIcon sx={{ color: '#8896a8', fontSize: 18 }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..."
                style={{ background: 'none', border: 'none', outline: 'none', color: '#e8edf5', fontFamily: 'DM Sans', fontSize: '0.875rem', width: 165 }} />
            </Box>
            {/* View toggle */}
            <Box sx={{ display: 'flex', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '10px', overflow: 'hidden' }}>
              {[{ v: 'grid', icon: <GridViewRoundedIcon sx={{ fontSize: 18 }} /> }, { v: 'table', icon: <TableRowsRoundedIcon sx={{ fontSize: 18 }} /> }].map(({ v, icon }) => (
                <Box key={v} onClick={() => setView(v)} sx={{
                  px: 1.5, py: 0.85, cursor: 'pointer', display: 'flex', alignItems: 'center',
                  background: view === v ? 'rgba(0,212,255,0.1)' : 'transparent',
                  color: view === v ? '#00d4ff' : '#8896a8', transition: 'all 0.18s',
                }}>{icon}</Box>
              ))}
            </Box>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => openDialog()}>Add Member</Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress sx={{ color: '#00d4ff' }} /></Box>
        ) : view === 'grid' ? (
          <Grid container spacing={3}>
            {filtered.map((m, i) => {
              const c = getColor(i);
              return (
                <Grid item xs={12} sm={6} lg={4} key={m._id}>
                  <Card className="mem-item" sx={{ transition: 'transform 0.22s ease, box-shadow 0.22s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 18px ${c}14` } }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                        <Avatar sx={{ width: 52, height: 52, fontSize: '1rem', fontFamily: 'Syne', fontWeight: 800, background: `${c}16`, color: c, border: `2px solid ${c}35` }}>
                          {m.avatar}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', color: '#e8edf5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {m.name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.78rem', color: c, fontWeight: 500 }}>{m.role}</Typography>
                        </Box>
                        <Chip label={m.status || 'active'} size="small" sx={{ background: `${statusColor(m.status)}14`, color: statusColor(m.status), border: `1px solid ${statusColor(m.status)}28`, fontFamily: 'Syne', fontWeight: 600, fontSize: '0.66rem', textTransform: 'capitalize' }} />
                      </Box>
                      <Typography sx={{ fontSize: '0.78rem', color: '#8896a8', mb: 2 }}>{m.email}</Typography>
                      {m.department && <Typography sx={{ fontSize: '0.75rem', color: '#4a5568', mb: 2 }}>📁 {m.department}</Typography>}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 2.5, minHeight: 26 }}>
                        {(m.projects || []).slice(0, 3).map(p => (
                          <Chip key={p._id || p} label={p.title || 'Project'} size="small" sx={{ background: 'rgba(0,212,255,0.05)', color: '#8896a8', border: '1px solid rgba(0,212,255,0.1)', fontSize: '0.68rem' }} />
                        ))}
                        {(m.projects || []).length === 0 && <Typography sx={{ fontSize: '0.73rem', color: '#4a5568' }}>No projects assigned</Typography>}
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography sx={{ fontSize: '0.72rem', color: '#4a5568' }}>{(m.projects || []).length} project{(m.projects || []).length !== 1 ? 's' : ''}</Typography>
                        <Box sx={{ display: 'flex', gap: 0.3 }}>
                          <Tooltip title="Edit"><IconButton size="small" onClick={() => openDialog(m)} sx={{ color: '#8896a8', '&:hover': { color: '#00d4ff', background: 'rgba(0,212,255,0.08)' } }}><EditRoundedIcon sx={{ fontSize: 17 }} /></IconButton></Tooltip>
                          <Tooltip title="Remove"><IconButton size="small" onClick={() => setDeleteId(m._id)} sx={{ color: '#8896a8', '&:hover': { color: '#ff4757', background: 'rgba(255,71,87,0.08)' } }}><DeleteRoundedIcon sx={{ fontSize: 17 }} /></IconButton></Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Member', 'Role', 'Email', 'Department', 'Status', 'Projects', 'Actions'].map(h => (
                      <TableCell key={h}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((m, i) => {
                    const c = getColor(i);
                    return (
                      <TableRow key={m._id} className="mem-item">
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.72rem', fontFamily: 'Syne', fontWeight: 700, background: `${c}16`, color: c, border: `1.5px solid ${c}30` }}>{m.avatar}</Avatar>
                            <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.855rem', color: '#e8edf5' }}>{m.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell><Typography sx={{ fontSize: '0.82rem', color: c }}>{m.role}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontSize: '0.8rem', color: '#8896a8' }}>{m.email}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#4a5568' }}>{m.department || '—'}</Typography></TableCell>
                        <TableCell>
                          <Chip label={m.status || 'active'} size="small" sx={{ background: `${statusColor(m.status)}12`, color: statusColor(m.status), border: `1px solid ${statusColor(m.status)}25`, fontSize: '0.68rem', fontFamily: 'Syne', fontWeight: 600, textTransform: 'capitalize' }} />
                        </TableCell>
                        <TableCell><Typography sx={{ fontSize: '0.8rem', color: '#8896a8' }}>{(m.projects || []).length}</Typography></TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.3 }}>
                            <IconButton size="small" onClick={() => openDialog(m)} sx={{ color: '#8896a8', '&:hover': { color: '#00d4ff' } }}><EditRoundedIcon sx={{ fontSize: 16 }} /></IconButton>
                            <IconButton size="small" onClick={() => setDeleteId(m._id)} sx={{ color: '#8896a8', '&:hover': { color: '#ff4757' } }}><DeleteRoundedIcon sx={{ fontSize: 16 }} /></IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        {filtered.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 12, color: '#4a5568' }}>
            <PeopleRoundedIcon sx={{ fontSize: 52, mb: 2, opacity: 0.25 }} />
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '1.1rem' }}>No members found</Typography>
          </Box>
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <Box ref={dialogRef}>
          <DialogTitle>{editing ? 'Edit Member' : 'Add Team Member'}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
            <TextField fullWidth label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Role *</InputLabel>
              <Select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} label="Role *">
                {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField fullWidth label="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField fullWidth label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></Grid>
            </Grid>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} label="Status">
                {STATUS_OPTIONS.map(s => <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Assign to Projects</InputLabel>
              <Select multiple value={form.projects} onChange={e => setForm({ ...form, projects: e.target.value })} input={<OutlinedInput label="Assign to Projects" />}
                renderValue={(sel) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{sel.map(id => { const p = projects.find(x => x._id === id); return <Chip key={id} label={p?.title || id} size="small" />; })}</Box>}>
                {projects.map(p => <MenuItem key={p._id} value={p._id}>{p.title}</MenuItem>)}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: '#8896a8' }}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? <CircularProgress size={19} sx={{ color: '#fff' }} /> : editing ? 'Save Changes' : 'Add Member'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Remove Member?</DialogTitle>
        <DialogContent><Typography sx={{ color: '#8896a8' }}>This will remove them from all projects.</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: '#8896a8' }}>Cancel</Button>
          <Button variant="contained" onClick={handleDelete} sx={{ background: '#ff4757', '&:hover': { background: '#e63e4c' } }}>Remove</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={toast.type} sx={{ borderRadius: 2 }}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

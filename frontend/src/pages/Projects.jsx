import React, { useEffect, useRef, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Select, FormControl,
  InputLabel, Chip, IconButton, Tooltip, Alert, Snackbar, Grid,
  OutlinedInput, CircularProgress
} from '@mui/material';
import AddRoundedIcon       from '@mui/icons-material/AddRounded';
import EditRoundedIcon      from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon    from '@mui/icons-material/DeleteRounded';
import FolderRoundedIcon    from '@mui/icons-material/FolderRounded';
import SearchRoundedIcon    from '@mui/icons-material/SearchRounded';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import { getProjects, createProject, updateProject, deleteProject, getMembers } from '../services/api';

const TECH_OPTIONS = ['React','Vue','Angular','Node.js','Express','Python','Django','FastAPI','MongoDB','PostgreSQL','MySQL','Redis','Docker','Kubernetes','AWS','GCP','Firebase','GraphQL','TypeScript','Next.js','Tailwind','MUI','Flutter','React Native'];
const STATUS_OPTIONS = ['active','completed','on-hold','planning'];
const PRIORITY_OPTIONS = ['low','medium','high','critical'];

const statusColor   = (s) => ({ active: '#00d4ff', completed: '#00e5a0', 'on-hold': '#f5c518', planning: '#a855f7' }[s] || '#8896a8');
const priorityColor = (p) => ({ critical: '#ff4757', high: '#f5c518', medium: '#00d4ff', low: '#00e5a0' }[p] || '#8896a8');

const EMPTY = { title: '', description: '', techStack: [], status: 'active', members: [], priority: 'medium', deadline: '' };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [members,  setMembers]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [open,     setOpen]     = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [search,   setSearch]   = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast,    setToast]    = useState({ open: false, msg: '', type: 'success' });
  const [saving,   setSaving]   = useState(false);
  const pageRef   = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [p, m] = await Promise.all([getProjects(), getMembers()]);
      setProjects(p.data);
      setMembers(m.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const animateCards = () => {
    setTimeout(() => {
      gsap.from('.proj-card', { y: 35, opacity: 0, stagger: 0.09, duration: 0.5, ease: 'power2.out' });
    }, 60);
  };

  const openDialog = (proj = null) => {
    setEditing(proj);
    setForm(proj ? {
      title: proj.title, description: proj.description,
      techStack: proj.techStack || [], status: proj.status,
      members: (proj.members || []).map(m => m._id || m),
      priority: proj.priority || 'medium',
      deadline: proj.deadline ? proj.deadline.slice(0, 10) : ''
    } : EMPTY);
    setOpen(true);
    setTimeout(() => {
      if (dialogRef.current) gsap.from(dialogRef.current, { scale: 0.9, opacity: 0, duration: 0.32, ease: 'back.out(1.7)' });
    }, 10);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      if (dialogRef.current) gsap.to(dialogRef.current, { x: [-8,8,-6,6,-3,3,0], duration: 0.4 });
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateProject(editing._id, form);
        showToast('Project updated!', 'success');
      } else {
        await createProject(form);
        showToast('Project created!', 'success');
      }
      setOpen(false);
      await loadData();
      animateCards();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error occurred', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await deleteProject(deleteId);
      showToast('Project deleted.', 'success');
      setDeleteId(null);
      await loadData();
    } catch { showToast('Delete failed.', 'error'); }
  };

  const showToast = (msg, type) => setToast({ open: true, msg, type });

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <Box ref={pageRef} sx={{ minHeight: '100vh', background: '#080c14', pt: '64px' }}>
      <Navbar />
      <Box sx={{ px: { xs: 2, md: 5 }, py: 4, maxWidth: 1300, mx: 'auto' }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: '#e8edf5' }}>Projects</Typography>
            <Typography sx={{ color: '#8896a8', mt: 0.4, fontSize: '0.875rem' }}>
              {projects.length} total · {projects.filter(p => p.status === 'active').length} active
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, background: 'rgba(13,20,33,0.85)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '10px', px: 2, py: 1 }}>
              <SearchRoundedIcon sx={{ color: '#8896a8', fontSize: 18 }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
                style={{ background: 'none', border: 'none', outline: 'none', color: '#e8edf5', fontFamily: 'DM Sans', fontSize: '0.875rem', width: 170 }} />
            </Box>
            {/* Filter */}
            <Box sx={{ display: 'flex', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '10px', overflow: 'hidden' }}>
              {['all', ...STATUS_OPTIONS].map(s => (
                <Box key={s} onClick={() => setFilterStatus(s)} sx={{
                  px: 1.8, py: 0.9, cursor: 'pointer', fontSize: '0.78rem',
                  fontFamily: 'Syne', fontWeight: 600, textTransform: 'capitalize',
                  background: filterStatus === s ? 'rgba(0,212,255,0.1)' : 'transparent',
                  color: filterStatus === s ? '#00d4ff' : '#8896a8',
                  transition: 'all 0.18s', display: { xs: s === 'all' || s === 'active' || s === 'completed' ? 'block' : 'none', md: 'block' },
                }}>{s}</Box>
              ))}
            </Box>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => openDialog()}>Add Project</Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress sx={{ color: '#00d4ff' }} /></Box>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((proj) => (
              <Grid item xs={12} sm={6} lg={4} key={proj._id}>
                <Card className="proj-card" sx={{
                  height: '100%', position: 'relative', overflow: 'visible',
                  transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 18px rgba(0,212,255,0.08)' },
                }}>
                  {/* Status bar top */}
                  <Box sx={{ position: 'absolute', top: 0, left: 20, right: 20, height: 2, background: statusColor(proj.status), borderRadius: '0 0 3px 3px', boxShadow: `0 0 8px ${statusColor(proj.status)}` }} />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(0,212,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,212,255,0.15)' }}>
                        <FolderRoundedIcon sx={{ color: '#00d4ff', fontSize: 20 }} />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center' }}>
                        {proj.priority && <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: priorityColor(proj.priority) }} />}
                        <Chip label={proj.status} size="small" sx={{ background: `${statusColor(proj.status)}14`, color: statusColor(proj.status), border: `1px solid ${statusColor(proj.status)}28`, fontFamily: 'Syne', fontWeight: 600, fontSize: '0.68rem', textTransform: 'capitalize' }} />
                      </Box>
                    </Box>

                    <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', color: '#e8edf5', mb: 1 }}>
                      {proj.title}
                    </Typography>
                    <Typography sx={{ color: '#8896a8', fontSize: '0.82rem', lineHeight: 1.65, mb: 2.5, minHeight: 55 }}>
                      {proj.description.length > 105 ? proj.description.slice(0, 105) + '…' : proj.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 2.5 }}>
                      {(proj.techStack || []).slice(0, 4).map(t => (
                        <Chip key={t} label={t} size="small" sx={{ background: 'rgba(0,212,255,0.05)', color: '#8896a8', border: '1px solid rgba(0,212,255,0.1)', fontSize: '0.68rem' }} />
                      ))}
                      {(proj.techStack || []).length > 4 && <Chip label={`+${proj.techStack.length - 4}`} size="small" sx={{ background: 'rgba(255,255,255,0.04)', color: '#4a5568', fontSize: '0.68rem' }} />}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <Typography sx={{ fontSize: '0.73rem', color: '#4a5568' }}>
                        {(proj.members || []).length} member{(proj.members || []).length !== 1 ? 's' : ''}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.3 }}>
                        <Tooltip title="Edit"><IconButton size="small" onClick={() => openDialog(proj)} sx={{ color: '#8896a8', '&:hover': { color: '#00d4ff', background: 'rgba(0,212,255,0.08)' } }}><EditRoundedIcon sx={{ fontSize: 17 }} /></IconButton></Tooltip>
                        <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteId(proj._id)} sx={{ color: '#8896a8', '&:hover': { color: '#ff4757', background: 'rgba(255,71,87,0.08)' } }}><DeleteRoundedIcon sx={{ fontSize: 17 }} /></IconButton></Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {filtered.length === 0 && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 12, color: '#4a5568' }}>
                  <FolderRoundedIcon sx={{ fontSize: 52, mb: 2, opacity: 0.25 }} />
                  <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '1.1rem' }}>No projects found</Typography>
                  <Typography sx={{ fontSize: '0.85rem', mt: 0.5 }}>Try changing your filters or add a new project.</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <Box ref={dialogRef}>
          <DialogTitle>{editing ? 'Edit Project' : 'New Project'}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
            <TextField fullWidth label="Project Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <TextField fullWidth multiline rows={3} label="Description *" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} label="Status">
                    {STATUS_OPTIONS.map(s => <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} label="Priority">
                    {PRIORITY_OPTIONS.map(p => <MenuItem key={p} value={p} sx={{ textTransform: 'capitalize' }}>{p}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField fullWidth label="Deadline" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} InputLabelProps={{ shrink: true }} />
            <FormControl fullWidth>
              <InputLabel>Tech Stack</InputLabel>
              <Select multiple value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })} input={<OutlinedInput label="Tech Stack" />}
                renderValue={(sel) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{sel.map(v => <Chip key={v} label={v} size="small" />)}</Box>}>
                {TECH_OPTIONS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Assign Members</InputLabel>
              <Select multiple value={form.members} onChange={e => setForm({ ...form, members: e.target.value })} input={<OutlinedInput label="Assign Members" />}
                renderValue={(sel) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {sel.map(id => { const m = members.find(x => x._id === id); return <Chip key={id} label={m?.name || id} size="small" />; })}
                  </Box>
                )}>
                {members.map(m => <MenuItem key={m._id} value={m._id}>{m.name} — {m.role}</MenuItem>)}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: '#8896a8' }}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? <CircularProgress size={19} sx={{ color: '#fff' }} /> : editing ? 'Save Changes' : 'Create Project'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Project?</DialogTitle>
        <DialogContent><Typography sx={{ color: '#8896a8' }}>This action cannot be undone.</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: '#8896a8' }}>Cancel</Button>
          <Button variant="contained" onClick={handleDelete} sx={{ background: '#ff4757', '&:hover': { background: '#e63e4c' } }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={toast.type} sx={{ borderRadius: 2 }}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

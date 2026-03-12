import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: '#00d4ff', light: '#33ddff', dark: '#0099bb', contrastText: '#000' },
    secondary:  { main: '#f5c518', light: '#f7d050', dark: '#c9a014' },
    success:    { main: '#00e5a0', light: '#33eab3', dark: '#00b87d' },
    error:      { main: '#ff4757', light: '#ff6b78', dark: '#cc3946' },
    warning:    { main: '#f5c518' },
    background: { default: '#080e18', paper: '#0f1c34' },
    text:       { primary: '#f0f4ff', secondary: '#a0b4cc', disabled: '#4a5568' },
    divider:    'rgba(0,212,255,0.1)',
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h1: { fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontFamily: "'Syne', sans-serif", fontWeight: 700 },
    h4: { fontFamily: "'Syne', sans-serif", fontWeight: 600 },
    h5: { fontFamily: "'Syne', sans-serif", fontWeight: 600 },
    h6: { fontFamily: "'Syne', sans-serif", fontWeight: 600 },
    button: { fontFamily: "'Syne', sans-serif", fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.9rem',
          transition: 'all 0.25s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #00d4ff 0%, #0077cc 100%)',
          boxShadow: '0 0 20px rgba(0,212,255,0.25)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #33ddff 0%, #0099ee 100%)',
            boxShadow: '0 0 32px rgba(0,212,255,0.4)',
            transform: 'translateY(-1px)',
          },
          '&:active': { transform: 'translateY(0)' },
          '&.Mui-disabled': { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(13,20,33,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,212,255,0.08)',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            transition: 'all 0.2s ease',
            '& fieldset': { borderColor: 'rgba(0,212,255,0.15)', transition: 'border-color 0.2s' },
            '&:hover fieldset': { borderColor: 'rgba(0,212,255,0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#00d4ff', borderWidth: 1.5 },
            '&.Mui-focused': { background: 'rgba(0,212,255,0.04)' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#00d4ff' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,212,255,0.15)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,212,255,0.4)' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00d4ff' },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'rgba(10,16,28,0.97)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(0,212,255,0.12)',
          borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: '1.2rem',
          color: '#e8edf5',
          borderBottom: '1px solid rgba(0,212,255,0.08)',
          paddingBottom: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: "'DM Sans', sans-serif", fontWeight: 500, borderRadius: 8 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontFamily: "'Syne', sans-serif",
          fontWeight: 600,
          fontSize: '0.72rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#00d4ff',
          background: 'rgba(0,212,255,0.04)',
          borderBottom: '1px solid rgba(0,212,255,0.12)',
        },
        body: {
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          color: '#e8edf5',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background 0.2s ease',
          '&:hover': { background: 'rgba(0,212,255,0.03) !important' },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, fontSize: '0.875rem' },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: { bottom: '24px !important', right: '24px !important' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, background: 'rgba(255,255,255,0.06)' },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: '#0d1421',
          border: '1px solid rgba(0,212,255,0.12)',
          borderRadius: 12,
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '&:hover': { background: 'rgba(0,212,255,0.06)' },
          '&.Mui-selected': { background: 'rgba(0,212,255,0.1)' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(8,12,20,0.88)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(0,212,255,0.08)',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
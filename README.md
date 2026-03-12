# 🚀 TeamFlow Portal — Production Deploy Guide

> **Stack:** React + Express + MongoDB Atlas + Railway
> **Architecture:** Single server — Express serves React build + API

---

## 📁 Project Structure

```
teamflow/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── models/               # Mongoose models (User, Project, Member)
│   ├── routes/               # API routes (auth, projects, members)
│   ├── middleware/auth.js    # JWT verification
│   ├── server.js             # Main Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/            # Login, Dashboard, Projects, Members
│   │   ├── components/       # Navbar, GSAP utils
│   │   ├── services/api.js   # Axios API calls
│   │   └── theme/theme.js    # MUI dark theme
│   ├── index.html
│   └── package.json
├── package.json              # Root — build + start scripts
├── railway.toml              # Railway config
└── README.md
```

---

## 🌐 STEP 1 — Setup MongoDB Atlas (Free)

1. Go to **https://cloud.mongodb.com** → Sign up free

2. Create a new project → Click **"Build a Database"**

3. Choose **FREE M0 tier** → Select any region → Click **Create**

4. **Set username & password:**
   - Username: `teamflow_user`
   - Password: `YourStrongPass123` (save this!)

5. **Whitelist IP:** Click "Add IP Address" → **"Allow Access from Anywhere"** → `0.0.0.0/0`

6. Click **"Connect"** → **"Drivers"** → Copy connection string:
   ```
   mongodb+srv://teamflow_user:YourStrongPass123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

7. Add database name — change the connection string to:
   ```
   mongodb+srv://teamflow_user:YourStrongPass123@cluster0.xxxxx.mongodb.net/teamflow?retryWrites=true&w=majority
   ```

---

## 🚂 STEP 2 — Deploy on Railway

### A. Push code to GitHub first

```bash
# In the teamflow/ folder
git init
git add .
git commit -m "Initial commit - TeamFlow Portal"
```

Create a new repo on **https://github.com/new** (name: `teamflow-portal`)

```bash
git remote add origin https://github.com/YOUR_USERNAME/teamflow-portal.git
git branch -M main
git push -u origin main
```

### B. Deploy on Railway

1. Go to **https://railway.app** → Sign in with GitHub

2. Click **"New Project"** → **"Deploy from GitHub repo"**

3. Select your `teamflow-portal` repo

4. Railway will detect `railway.toml` and auto-configure

5. Click on your service → **"Variables"** tab → Add these:

```
MONGODB_URI    = mongodb+srv://teamflow_user:YourPass@cluster0.xxx.mongodb.net/teamflow?retryWrites=true&w=majority
JWT_SECRET     = TeamFlow_Production_Secret_Key_2024_XYZ_Very_Long
NODE_ENV       = production
FRONTEND_URL   = https://your-app.railway.app
```

6. Go to **"Settings"** tab → **"Domains"** → Click **"Generate Domain"**
   - Copy your domain: `your-app.railway.app`
   - Update `FRONTEND_URL` variable with this domain

7. Railway will automatically:
   - Run `npm run build` (builds React)
   - Run `npm start` (starts Express)
   - Serve everything from one URL!

### C. Verify Deployment

Visit: `https://your-app.railway.app/api/health`

Should return:
```json
{ "status": "ok", "database": "connected" }
```

Then visit: `https://your-app.railway.app`

🎉 **Your full app is live!**

---

## 💻 LOCAL DEVELOPMENT

### Install dependencies

```bash
# From root folder
npm run install-all
```

Or manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Create backend/.env

```env
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxx.mongodb.net/teamflow?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Run locally (2 terminals)

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# → http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → http://localhost:3000
```

---

## 📡 API Reference

All protected routes require: `Authorization: Bearer <token>`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login → returns JWT |
| GET  | `/api/auth/me` | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/projects` | Get all projects |
| POST   | `/api/projects` | Create project |
| PUT    | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Members
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/members` | Get all members |
| POST   | `/api/members` | Add member |
| PUT    | `/api/members/:id` | Update member |
| DELETE | `/api/members/:id` | Remove member |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server status check |

---

## 🔒 Security Notes

- ✅ Passwords hashed with `bcryptjs` (12 salt rounds)
- ✅ JWT tokens expire in 7 days
- ✅ Each user only sees their own data
- ✅ Input validation with Mongoose validators
- ✅ CORS configured for your domain
- ❌ Never commit `.env` to GitHub!

---

## 🐛 Troubleshooting

**MongoDB connection fails:**
- Check your connection string has the correct password
- Make sure IP `0.0.0.0/0` is whitelisted in Atlas

**Railway build fails:**
- Check that all files are committed to GitHub
- View build logs in Railway dashboard

**Frontend shows blank page:**
- Make sure `npm run build` completed successfully
- Check Railway logs for errors

**API returns 401:**
- Token may be expired — log out and log in again

---

## 💡 Tech Stack

| Tech | Version | Purpose |
|------|---------|---------|
| React | 18 | Frontend UI |
| React Router | 6 | Navigation |
| MUI | 5 | UI Components |
| GSAP | 3 | Animations |
| Express | 4 | Backend API |
| Mongoose | 8 | MongoDB ODM |
| JWT | 9 | Authentication |
| bcryptjs | 2 | Password hashing |
| Axios | 1 | HTTP client |
| Vite | 5 | Build tool |

---

Made with ❤️ — TeamFlow Portal v1.0

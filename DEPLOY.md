# 🚀 Deploy to Live Server (1-Click)

Your code is here: https://github.com/essam3435/freevps63

## Option 1: Deploy to Render.com (FREE - Easiest)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your `essam3435/freevps63` repo
5. Fill in:
   - **Name:** account-manager
   - **Runtime:** Python 3.11
   - **Build Command:** `pip install -r requirements.txt && cd frontend && npm install && npm run build`
   - **Start Command:** `gunicorn --bind 0.0.0.0:10000 app:app`
   - **Environment Variables:** Add `JWT_SECRET_KEY=your-random-secret-here`
6. Click Deploy

**Your live link will be:** `https://account-manager-xxxxx.onrender.com`

---

## Option 2: Deploy to Railway.app (FREE)

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose `essam3435/freevps63`
5. Add environment variables:
   - `JWT_SECRET_KEY=your-random-secret-here`
6. Railway auto-detects and deploys

**Your live link will be:** `https://account-manager-production.railway.app`

---

## Option 3: GitHub Pages (Frontend Only)

```bash
cd frontend
npm run build
# Deploy the 'build' folder to GitHub Pages
```

Configure in repo settings → Pages → Deploy from branch

---

## Option 4: Vercel (Frontend Only)

1. Go to https://vercel.com
2. Import your GitHub repo
3. Vercel auto-detects React app
4. Set API URL to your backend

---

## After Deployment

Once deployed, your app will be live at the generated URL. 

**Update Frontend API URLs** (if backend is separate):
Edit `frontend/src/` files and replace:
```javascript
'http://localhost:5000/api/'
```
with:
```javascript
'https://your-live-backend.com/api/'
```

Then redeploy the frontend.

---

## Recommended: Full Stack on Render

1. Deploy backend on Render (see Option 1)
2. Update frontend API URL to Render URL
3. Add this to GitHub Actions to auto-deploy on push

**Total time: 5 minutes** ⚡


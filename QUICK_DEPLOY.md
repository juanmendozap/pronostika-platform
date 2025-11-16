# 🚀 Quick Deployment to prosnostika.com

## ✅ What's Ready:
- Git repository initialized ✅
- Code committed ✅  
- Vercel CLI installed ✅
- Production configs created ✅

## 🎯 Next Steps:

### **1. Create GitHub Account & Repository**

Go to **github.com** and:
1. Sign up/login
2. Click **"New Repository"**  
3. Name: `pronostika-platform`
4. Set **Public**
5. **Don't initialize**
6. Click **"Create"**

### **2. Push to GitHub**

**Replace `YOUR_USERNAME` with your GitHub username:**

```bash
$env:PATH += ";C:\Program Files\Git\bin"
git remote add origin https://github.com/YOUR_USERNAME/pronostika-platform.git
git branch -M main  
git push -u origin main
```

### **3. Deploy Frontend (Vercel)**

```bash
vercel login
cd frontend
vercel --prod
```

When prompted:
- Link to existing project: **No**
- Project name: `pronostika`
- Directory: **./frontend** 
- Override settings: **No**

### **4. Connect Domain**

In Vercel dashboard:
1. Go to project → **Domains**
2. Add: `prosnostika.com`
3. Add: `www.prosnostika.com`

### **5. Update DNS**

At your domain registrar, add:
```
Type: A     | Name: @   | Value: 76.76.19.61
Type: CNAME | Name: www | Value: cname.vercel-dns.com
```

---

## 🚨 Ready to Start?

**Tell me your GitHub username** and I'll help with the git commands! 

Then we'll get prosnostika.com live in about 30 minutes! 🚀
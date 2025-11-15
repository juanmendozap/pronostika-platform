# 🚀 Pronostika Production Deployment Guide

## Domain: prosnostika.com

This guide will help you deploy your Pronostika betting platform to production using your domain.

## 📋 Prerequisites

- ✅ Domain: `prosnostika.com` (purchased)
- ✅ Working local development setup
- ⏳ Choose hosting provider (options below)
- ⏳ Production database setup

## 🏗️ Deployment Options

### **Option 1: Vercel + PlanetScale (Recommended - Easiest)**
- **Frontend**: Vercel (free tier available)
- **Backend**: Vercel Functions or Railway
- **Database**: PlanetScale (MySQL-compatible)
- **Domain**: Connect prosnostika.com to Vercel
- **Cost**: ~$0-20/month initially

### **Option 2: DigitalOcean Droplet (Full Control)**
- **Server**: DigitalOcean VPS ($6-12/month)
- **Database**: Managed PostgreSQL ($15/month)
- **Domain**: Point to droplet IP
- **Cost**: ~$20-30/month

### **Option 3: AWS/Google Cloud (Scalable)**
- **Frontend**: S3 + CloudFront or Vercel
- **Backend**: EC2 or App Runner
- **Database**: RDS PostgreSQL
- **Cost**: ~$30-100/month (scales with usage)

## 🎯 Recommended Approach: Vercel + Railway

### **Step 1: Prepare Code for Production**

First, let's create production configurations:

```bash
# Create production environment files
npm run build:prod
```

### **Step 2: Frontend Deployment (Vercel)**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Connect Domain**:
   - Go to Vercel dashboard
   - Add custom domain: `prosnostika.com`
   - Update DNS records as instructed

### **Step 3: Backend Deployment (Railway)**

1. **Sign up**: https://railway.app/
2. **Connect GitHub**: Link your repository
3. **Deploy backend**: Select backend folder
4. **Environment Variables**: Add production configs

### **Step 4: Database Setup (PlanetScale)**

1. **Sign up**: https://planetscale.com/
2. **Create database**: `pronostika-prod`
3. **Run migrations**: Import your schema
4. **Get connection string**: Add to backend env

### **Step 5: Domain Configuration**

1. **DNS Settings** (at your domain registrar):
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61 (Vercel IP)
   ```

2. **SSL Certificate**: Automatic with Vercel

## 🔧 Production Environment Setup

### **Create Production Configs**

Let's create the necessary production files:

#### **Frontend Environment** (`.env.production`):
```env
VITE_API_URL=https://api.prosnostika.com
VITE_SOCKET_URL=https://api.prosnostika.com
VITE_ENVIRONMENT=production
```

#### **Backend Environment** (`.env.production`):
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your-production-database-url
JWT_SECRET=your-super-secure-jwt-secret
CORS_ORIGIN=https://prosnostika.com,https://www.prosnostika.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📁 File Structure for Deployment

```
pronostika/
├── frontend/
│   ├── .env.production         # Production frontend config
│   ├── vercel.json            # Vercel deployment config
│   └── package.json
├── backend/
│   ├── .env.production        # Production backend config
│   ├── railway.json           # Railway deployment config
│   └── package.json
├── database/
│   ├── migrations/            # Database migrations
│   └── production-setup.sql   # Production data setup
└── DEPLOYMENT_GUIDE.md
```

## 🚀 Quick Deploy Steps

### **1. Vercel (Frontend)**
```bash
# In frontend folder
npm run build
vercel --prod
# Follow prompts to connect domain
```

### **2. Railway (Backend)**
```bash
# In backend folder
git push origin main
# Deploy via Railway dashboard
```

### **3. Database Migration**
```bash
# Run production migrations
npm run db:migrate:prod
npm run db:seed:prod
```

## 🔒 Security Checklist

- [ ] SSL certificate installed (HTTPS)
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] JWT secrets are strong
- [ ] Admin accounts secured

## 📊 Monitoring & Maintenance

### **Analytics** (Optional):
- Google Analytics for user tracking
- Sentry for error monitoring
- LogRocket for user sessions

### **Backup Strategy**:
- Database: Automated daily backups
- Code: Git repository backups
- Environment: Document all configs

## 💰 Cost Estimation

### **Minimal Setup** (0-1000 users):
- Domain: $10-15/year
- Vercel: Free tier
- Railway: $5/month
- PlanetScale: Free tier
- **Total**: ~$5-10/month

### **Growing Setup** (1000-10000 users):
- Domain: $10-15/year
- Vercel Pro: $20/month
- Railway: $10-20/month
- Database: $15-30/month
- **Total**: ~$45-70/month

## 🆘 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Domain not connecting | Check DNS propagation (24-48 hours) |
| SSL certificate error | Wait for Vercel auto-SSL or force refresh |
| Database connection fails | Check firewall and connection strings |
| CORS errors in production | Update CORS_ORIGIN environment variable |
| Build fails | Check production environment variables |

## 🎯 Next Steps

1. **Choose your deployment option** (Vercel + Railway recommended)
2. **Set up accounts** with chosen providers
3. **Configure domain DNS** settings
4. **Deploy step by step** following this guide
5. **Test thoroughly** before announcing to users
6. **Set up monitoring** for ongoing maintenance

## 📞 Need Help?

If you encounter issues during deployment:
1. Check provider documentation
2. Test locally first with production configs
3. Use provider support channels
4. Monitor deployment logs for errors

---

**Ready to go live? Let's make prosnostika.com accessible worldwide! 🌍**
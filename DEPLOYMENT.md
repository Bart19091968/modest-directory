# Deployment Guide - Railway

## Database Setup on Railway

1. **Create PostgreSQL Database on Railway**
   - Create new project on Railway
   - Add PostgreSQL plugin
   - Copy DATABASE_URL from Railway dashboard

2. **Configure Environment**
   ```bash
   # In Railway dashboard, set:
   DATABASE_URL=postgresql://user:password@host:port/database
   NEXT_PUBLIC_SITE_URL=https://your-domain.railway.app
   JWT_SECRET=your-secret-key
   RESEND_API_KEY=your-resend-key
   FROM_EMAIL=noreply@modestdirectory.be
   ADMIN_EMAIL=admin@modestdirectory.be
   ```

3. **Database Migrations & Seeding**
   ```bash
   # Railway will run on deployment:
   npm run db:push        # Apply schema
   npm run db:seed:quality  # Populate with quality content
   ```

4. **Deploy to Railway**
   - Push to GitHub
   - Railway auto-deploys on push
   - Monitor build logs in Railway dashboard

## Post-Deployment

✅ Database populated with AdSense-compliant content
✅ All pages 400+ words minimum
✅ Ready for AdSense submission

## Monitoring

- Check Railway logs for seed execution
- Verify database content in Railway PostgreSQL console
- Test site at deployed URL
- Confirm all content is displaying


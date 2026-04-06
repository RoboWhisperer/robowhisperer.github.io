# Troubleshooting Guide

## Common Issues and Solutions

---

## Frontend Issues

### Blank Page After Build

**Symptoms:** Production build shows blank white page.

**Solutions:**

1. **Check Console for Errors**
   - Open browser DevTools (F12) → Console tab
   - Look for JavaScript errors

2. **Check `homepage` in package.json**
   ```json
   // If deploying to subdirectory
   "homepage": "https://yourdomain.com/app"
   
   // If deploying to root
   "homepage": "."
   ```

3. **Check Environment Variables**
   ```bash
   # Ensure REACT_APP_BACKEND_URL was set BEFORE building
   REACT_APP_BACKEND_URL=https://api.yourdomain.com yarn build
   ```

4. **React Router History Issue**
   - Ensure Nginx is configured with `try_files $uri /index.html`

---

### API Calls Failing

**Symptoms:** Frontend loads but data doesn't appear.

**Solutions:**

1. **Check Network Tab**
   - DevTools → Network → Filter by XHR
   - Look for failed API requests

2. **CORS Errors**
   ```
   Access to fetch at 'https://api...' has been blocked by CORS policy
   ```
   
   Fix in `server.py`:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://yourdomain.com"],  # Add your domain
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Wrong Backend URL**
   - Verify `REACT_APP_BACKEND_URL` in build
   - Check if backend is actually running

---

### Styles Not Loading

**Symptoms:** Page looks unstyled or broken.

**Solutions:**

1. **Check CSS Import**
   ```javascript
   // App.js should have
   import './App.css';
   ```

2. **Clear Cache**
   ```bash
   # Hard refresh
   Ctrl + Shift + R (Windows/Linux)
   Cmd + Shift + R (Mac)
   ```

3. **Check Build Output**
   - Verify CSS files exist in `build/static/css/`

---

### Theme Toggle Not Working

**Symptoms:** Clicking theme toggle doesn't change colors.

**Solutions:**

1. **Check localStorage**
   ```javascript
   // In browser console
   localStorage.getItem('dravion-theme')
   ```

2. **Verify data-theme Attribute**
   ```javascript
   // Check if attribute is being set
   document.documentElement.getAttribute('data-theme')
   ```

3. **CSS Variables Check**
   - Ensure `[data-theme="light"]` styles exist in App.css

---

## Backend Issues

### Server Won't Start

**Symptoms:** `uvicorn` command fails.

**Solutions:**

1. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :8001
   
   # Kill it
   kill -9 <PID>
   
   # Or use different port
   uvicorn server:app --port 8002
   ```

2. **Module Not Found**
   ```bash
   # Ensure virtual environment is activated
   source venv/bin/activate
   
   # Reinstall dependencies
   pip install -r requirements.txt
   ```

3. **Syntax Error in server.py**
   ```bash
   # Check for syntax errors
   python -m py_compile server.py
   ```

---

### 502 Bad Gateway

**Symptoms:** Nginx returns 502 error.

**Solutions:**

1. **Check if Backend is Running**
   ```bash
   # Check process
   pm2 status
   # or
   ps aux | grep uvicorn
   ```

2. **Check Backend Logs**
   ```bash
   pm2 logs dravion-backend
   # or
   journalctl -u dravion-backend
   ```

3. **Verify Proxy Configuration**
   ```nginx
   location /api {
       proxy_pass http://127.0.0.1:8001;  # Ensure port matches
   }
   ```

---

### API Returns HTML Instead of JSON

**Symptoms:** API endpoints return HTML error pages.

**Solutions:**

1. **Check Endpoint Path**
   - Ensure `/api` prefix is correct
   - Verify route exists in `server.py`

2. **Nginx Routing Issue**
   ```nginx
   # Ensure API location comes before root location
   location /api {
       proxy_pass http://127.0.0.1:8001;
   }
   
   location / {
       try_files $uri /index.html;
   }
   ```

---

## Docker Issues

### Container Exits Immediately

**Solutions:**

1. **Check Logs**
   ```bash
   docker logs dravion-backend
   docker logs dravion-frontend
   ```

2. **Run Interactively**
   ```bash
   docker run -it dravion-backend /bin/sh
   ```

### Network Issues Between Containers

**Solutions:**

1. **Use Docker Network**
   ```yaml
   # docker-compose.yml
   services:
     backend:
       networks:
         - dravion-net
     frontend:
       networks:
         - dravion-net
   
   networks:
     dravion-net:
   ```

2. **Use Service Names**
   - In frontend nginx.conf, use `proxy_pass http://backend:8001`

---

## SSL/HTTPS Issues

### Mixed Content Warnings

**Symptoms:** Browser blocks HTTP requests from HTTPS page.

**Solutions:**

1. **Ensure Backend Uses HTTPS**
   ```env
   REACT_APP_BACKEND_URL=https://api.yourdomain.com
   ```

2. **Rebuild Frontend After Changing URL**
   ```bash
   yarn build
   ```

### Certificate Errors

**Solutions:**

1. **Renew Certificate**
   ```bash
   sudo certbot renew
   ```

2. **Check Certificate Status**
   ```bash
   sudo certbot certificates
   ```

---

## Performance Issues

### Slow Page Load

**Solutions:**

1. **Enable Gzip**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **Add Caching Headers**
   ```nginx
   location /static {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **Optimize Images**
   - Use WebP format
   - Compress images before upload

---

## Getting Help

If you're still stuck:

1. **Check Logs**
   ```bash
   # Nginx
   sudo tail -f /var/log/nginx/error.log
   
   # PM2
   pm2 logs
   
   # Docker
   docker-compose logs -f
   ```

2. **Join Discord Support**
   - [dsc.gg/dravion](https://dsc.gg/dravion)

3. **Search Issues**
   - Check GitHub Issues for similar problems

4. **Minimal Reproduction**
   - Create a minimal example that reproduces the issue
   - Include: OS, Node version, Python version, error messages

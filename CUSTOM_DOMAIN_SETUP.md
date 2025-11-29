# 🌐 Custom Domain Setup - freeclipboard.com

## ✅ GitHub Configuration Complete!

Your repository is now configured to use **freeclipboard.com** as the custom domain.

---

## 📋 What's Already Done

✅ **CNAME file** exists in repository (contains: freeclipboard.com)  
✅ **Workflow configured** to deploy with custom domain  
✅ **Changes pushed** to GitHub  
✅ **GitHub Actions** will deploy to gh-pages branch  

---

## 🔧 DNS Configuration Required

To make **freeclipboard.com** work, you need to configure DNS records with your domain registrar.

### Option 1: Apex Domain (freeclipboard.com)

Add these **A records** pointing to GitHub Pages IPs:

```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

### Option 2: WWW Subdomain (www.freeclipboard.com)

Add this **CNAME record**:

```
Type: CNAME
Name: www
Value: alikwl.github.io
```

### Recommended: Both Apex and WWW

For best results, configure both:

1. **A records** for apex domain (freeclipboard.com)
2. **CNAME record** for www subdomain (www.freeclipboard.com)

---

## ⚙️ GitHub Pages Settings

After DNS is configured, verify these settings:

1. Go to: **https://github.com/alikwl/freeclipboard/settings/pages**

2. **Custom domain** section:
   - Enter: `freeclipboard.com`
   - Click "Save"
   - Wait for DNS check (may take a few minutes)

3. **Enforce HTTPS**:
   - Once DNS check passes, enable "Enforce HTTPS"
   - This provides SSL certificate for your domain

4. **Source** section:
   - Should be: "Deploy from a branch"
   - Branch: `gh-pages`
   - Folder: `/ (root)`

---

## 🌍 DNS Provider Instructions

### Common Providers

#### Namecheap
1. Go to Domain List → Manage
2. Advanced DNS tab
3. Add A Records and CNAME as shown above

#### GoDaddy
1. Go to DNS Management
2. Add A Records and CNAME as shown above

#### Cloudflare
1. Go to DNS settings
2. Add A Records and CNAME as shown above
3. Set Proxy status to "DNS only" (gray cloud)

#### Google Domains
1. Go to DNS settings
2. Add Custom resource records
3. Add A Records and CNAME as shown above

---

## ⏱️ Timeline

1. **Configure DNS** at your registrar (5 minutes)
2. **DNS propagation** (15 minutes to 48 hours, usually 1-2 hours)
3. **GitHub verifies DNS** (automatic after propagation)
4. **Enable HTTPS** in GitHub settings (after verification)
5. **Site goes live** at freeclipboard.com

---

## 🔍 Verify DNS Configuration

### Check DNS Propagation

Use these tools to check if DNS is configured correctly:

- **https://dnschecker.org/** - Check DNS propagation globally
- **https://www.whatsmydns.net/** - Check A records
- **Command line**: `nslookup freeclipboard.com`

### Expected Results

```bash
# For apex domain
nslookup freeclipboard.com
# Should return one of: 185.199.108.153, 185.199.109.153, 
#                       185.199.110.153, or 185.199.111.153

# For www subdomain
nslookup www.freeclipboard.com
# Should return: alikwl.github.io
```

---

## 📊 Current Status

| Item | Status |
|------|--------|
| CNAME file in repo | ✅ Complete |
| Workflow configured | ✅ Complete |
| Changes pushed | ✅ Complete |
| GitHub Actions running | ✅ In Progress |
| DNS A records | ⏳ Pending (you need to configure) |
| DNS CNAME record | ⏳ Pending (you need to configure) |
| GitHub Pages custom domain | ⏳ Pending (after DNS) |
| HTTPS enabled | ⏳ Pending (after DNS verification) |

---

## 🚀 Quick Start Checklist

- [ ] **Step 1**: Configure DNS A records at your domain registrar
- [ ] **Step 2**: Configure DNS CNAME record for www subdomain
- [ ] **Step 3**: Wait for DNS propagation (check with dnschecker.org)
- [ ] **Step 4**: Go to GitHub Pages settings
- [ ] **Step 5**: Enter "freeclipboard.com" in custom domain field
- [ ] **Step 6**: Wait for DNS check to pass
- [ ] **Step 7**: Enable "Enforce HTTPS"
- [ ] **Step 8**: Visit https://freeclipboard.com

---

## 🔧 Troubleshooting

### DNS Not Propagating

**Problem**: DNS changes not showing after 2 hours

**Solutions**:
- Verify A records are correct (185.199.108-111.153)
- Check CNAME points to alikwl.github.io (not alikwl.github.io/freeclipboard)
- Clear local DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)
- Wait up to 48 hours for full propagation

### GitHub DNS Check Failing

**Problem**: GitHub says "DNS check unsuccessful"

**Solutions**:
- Verify DNS is propagated using dnschecker.org
- Make sure A records point to all 4 GitHub IPs
- Remove any conflicting DNS records
- Wait a few more hours for propagation

### HTTPS Not Available

**Problem**: Can't enable HTTPS checkbox

**Solutions**:
- DNS must be fully verified first
- Wait 24 hours after DNS verification
- Try removing and re-adding custom domain
- Contact GitHub Support if issue persists

### Site Shows 404

**Problem**: Domain resolves but shows 404 error

**Solutions**:
- Check GitHub Actions completed successfully
- Verify gh-pages branch has content
- Check CNAME file exists in gh-pages branch
- Wait for GitHub Pages to rebuild (can take 10 minutes)

---

## 📞 Where to Configure DNS

You need to configure DNS at your **domain registrar** where you purchased freeclipboard.com.

Common registrars:
- Namecheap
- GoDaddy  
- Google Domains
- Cloudflare
- Domain.com
- Hover
- Name.com

**Don't know your registrar?** Use WHOIS lookup: https://who.is/whois/freeclipboard.com

---

## 🎯 Final Configuration

Once DNS is configured and propagated:

### Your Site Will Be Available At:
- ✅ https://freeclipboard.com (primary)
- ✅ https://www.freeclipboard.com (redirects to primary)
- ✅ https://alikwl.github.io/freeclipboard/ (still works as backup)

### GitHub Actions Workflow:
- Automatically builds on every push to master
- Deploys to gh-pages branch
- Includes CNAME file for custom domain
- Site updates within 2-3 minutes of push

---

## 📝 Summary

**What you need to do NOW:**

1. **Go to your domain registrar** (where you bought freeclipboard.com)
2. **Add DNS records** as shown above
3. **Wait for propagation** (1-2 hours typically)
4. **Configure GitHub Pages** custom domain setting
5. **Enable HTTPS** once DNS is verified

**Everything else is already configured!** ✅

---

## 🆘 Need Help?

If you're stuck:

1. **Check DNS propagation**: https://dnschecker.org/
2. **GitHub Pages docs**: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
3. **Your registrar's DNS guide**: Search "[your registrar] add A record"

---

**Created**: November 27, 2025  
**Domain**: freeclipboard.com  
**Repository**: https://github.com/alikwl/freeclipboard  
**Status**: ⏳ Waiting for DNS configuration

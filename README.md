# Jamal Rafeeq storefront

The public app is catalogue-only: homepage, product discovery, product detail,
about, contact, and WhatsApp enquiries. Customer accounts, cart, checkout,
wishlist, profile, and order-history UI are intentionally not part of the
storefront.

Production uses the same-origin `/api` and `/media` paths. Vercel rewrites
those paths to the AWS EC2 backend, so do not set `VITE_API_BASE_URL` to a
Render URL or an EC2 IP in the Vercel production environment. Leave it unset
or set it to `/api`. Keep `VITE_WHATSAPP_NUMBER` configured, then run:

```powershell
npm ci
npm run build
```

The repository's `vercel.json` contains the production proxy rules. Deploy the
frontend to Vercel after the EC2 backend is reachable at `13.50.221.204`.

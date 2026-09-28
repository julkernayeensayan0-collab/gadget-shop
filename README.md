# Eshan Gadgets - E-Commerce & Online Payment Web App

A high-performance e-commerce platform for gadgets, audio devices, smart wearables, and tech gear with integrated online payments (Credit/Debit Card with 3D Secure, bKash, Nagad, Google/Apple Pay, Cash on Delivery).

## Deploy to Vercel

### Option 1: 1-Click Deploy via Vercel Web
1. Push this project to your GitHub repository using the **Export to GitHub** button in AI Studio.
2. Go to **[vercel.com/new](https://vercel.com/new)**.
3. Select your imported `eshan-gadgets` repository.
4. Click **Deploy**. Vercel will automatically read `vercel.json` and deploy it live to `https://<your-project>.vercel.app`.

### Option 2: Deploy via Vercel CLI
If you have a Vercel account, you can deploy in one command:
```bash
npx vercel
```
Or with a Vercel token:
```bash
npx vercel --token <YOUR_VERCEL_TOKEN> --prod
```

## Local Development
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
```

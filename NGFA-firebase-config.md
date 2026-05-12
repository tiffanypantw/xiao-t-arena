# NGFA Firebase Project Config
**Created:** 2026-05-12
**Project:** `ngfa-arena` (Firebase project for English brand "Next Gen Finance Academy")

## ⚠️ Note on secrecy

Firebase web config (apiKey etc.) is **NOT secret**. It gets baked into the client JS bundle and shipped to every browser. Security is enforced by Firestore Security Rules, not by hiding the key. So it's OK to commit this file. But the cleaner pattern (which Phase 1 will implement) is to read these from env vars per brand.

## Config values

```
apiKey:            AIzaSyBM-iG0hgBfjvQtjTtfx5aC2ift6ZHQPiQ
authDomain:        ngfa-arena.firebaseapp.com
projectId:         ngfa-arena
storageBucket:     ngfa-arena.firebasestorage.app
messagingSenderId: 539778436175
appId:             1:539778436175:web:9a8bfd43bf0696dbf5ee3a
measurementId:     G-L4R7YWKTFW
```

## When Phase 1 wires this up

Next session, `src/lib/firebase.js` becomes:

```js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

And NGFA's `.env.ngfa.local` will contain:

```
VITE_BRAND=ngfa
VITE_FIREBASE_API_KEY=AIzaSyBM-iG0hgBfjvQtjTtfx5aC2ift6ZHQPiQ
VITE_FIREBASE_AUTH_DOMAIN=ngfa-arena.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ngfa-arena
VITE_FIREBASE_STORAGE_BUCKET=ngfa-arena.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=539778436175
VITE_FIREBASE_APP_ID=1:539778436175:web:9a8bfd43bf0696dbf5ee3a
```

The existing hardcoded Tiffany-brand values from `src/lib/firebase.js` will become `.env.tiffany.local`.

## Status of NGFA Firebase project (2026-05-12)

- ✅ Project created (`ngfa-arena`)
- ✅ Auth enabled: Google + Email/Password
- ✅ Firestore created in `us-east1` (Production mode)
- ✅ Storage created in `us-east1` (Production mode)
- ✅ Blaze plan activated, billing country: Taiwan, currency: TWD
- ✅ Budget alert set: 30 TWD with 50% / 90% / 100% thresholds (confirmed 2026-05-12)
- ✅ Web app registered: `NGFA Web`
- ❌ Firestore Security Rules — using default production lockdown, NOT YET deployed real rules (next session)
- ❌ Firestore Indexes — not yet set up (next session)
- ❌ Authorized domains — not yet set up (when Vercel deploy happens)

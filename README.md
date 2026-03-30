# 🌾 AgroLink — Frontend

> Next.js frontend for AgroLink — an agricultural marketplace that connects Bangladeshi farmers with buyers through competitive bidding and Stripe-secured payments.

---

## 🔗 Live Links

|                    | URL                                         |
| ------------------ | ------------------------------------------- |
| **Frontend Live**  | `https://agrolink-frontend-silk.vercel.app` |
| **Backend Live**   | `https://agrolink-backend-neon.vercel.app`  |
| **Admin Email**    | `tareqferdous10@gmail.com`                  |
| **Admin Password** | `admin123456`                               |

---

## 🎯 Project Overview

AgroLink solves 4 problems for Bangladeshi farmers:

| Problem                | Solution                                      |
| ---------------------- | --------------------------------------------- |
| Middleman exploitation | Direct farmer-to-buyer connection             |
| No price discovery     | Competitive bidding system                    |
| Payment fraud          | Stripe escrow — money released after delivery |
| Delivery chaos         | Structured courier + pickup workflow          |

---

## 👥 User Roles

| Role       | What they do                                                   |
| ---------- | -------------------------------------------------------------- |
| **Farmer** | List crops, manage bids, ship orders, receive wallet payments  |
| **Buyer**  | Browse listings, bid on crops, pay via Stripe, confirm receipt |
| **Admin**  | Approve listings, verify users, monitor orders and analytics   |

---

## 🔄 Platform Flow

### Complete End-to-End Flow

```
FARMER                    ADMIN                     BUYER
  │                         │                         │
  ├─ Register & Login        │                         ├─ Register & Login
  │                         │                         │
  ├─ Create Listing ────────►├─ Review Listing         │
  │                         ├─ Approve / Reject        │
  │                         │   (Email sent)           │
  │◄─────────────────────────┤                         │
  │  Listing goes ACTIVE     │                         │
  │                         │                         ├─ Browse Listings
  │                         │                         ├─ Filter & Search
  │                         │                         ├─ View Listing Detail
  │                         │                         ├─ Place Bid
  │                         │                         │
  ├─ View All Bids           │                         │
  ├─ Accept Best Bid ──────────────────────────────►   │
  │  (Others auto-rejected)  │                         │  Bid ACCEPTED
  │  (Order created)         │                         │  (Email sent)
  │                         │                         │
  │                         │                         ├─ Go to My Orders
  │                         │                         ├─ Pay Now (Stripe)
  │                         │                         ├─ Payment SUCCESS
  │                         │                         │
  ├─ Mark Ready / Ship       │                         │
  ├─ Add Tracking Info       │                         ├─ Receive Tracking Email
  │                         │                         ├─ Confirm Received
  │                         │                         │
  ├─ Wallet Credited ◄───────────────────────────────  │
  │  (farmerAmount)          │                         ├─ Leave Review
  │                         │                         │
  ├─ Leave Review            │                         │
```

### Farmer Flow

```
 ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
 │   Register  │───►│    Login    │───►│   Create    │───►│    Wait     │
 │   Account   │    │  to Portal  │    │   Listing   │    │  Approval   │
 └─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                  │
                                                         Admin Approves
                                                                  │
 ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌──────▼──────┐
 │   Wallet    │◄───│   Order     │◄───│   Accept    │◄───│   Receive   │
 │  Credited   │    │  Shipped    │    │  Best Bid   │    │    Bids     │
 └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Buyer Flow

```
 ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
 │   Register  │───►│    Login    │───►│   Browse    │───►│  Place Bid  │
 │   Account   │    │  to Portal  │    │  Listings   │    │  on Crop    │
 └─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                  │
                                                         Farmer Accepts
                                                                  │
 ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌──────▼──────┐
 │   Submit    │◄───│   Confirm   │◄───│   Stripe    │◄───│   Pay Now   │
 │   Review    │    │  Received   │    │   Payment   │    │   Button    │
 └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Admin Flow

```
 ┌─────────────┐    ┌────────────────────────────────────────────────────┐
 │ Admin Login │───►│                 Admin Dashboard                    │
 └─────────────┘    └──────┬─────────────────┬──────────────┬────────────┘
                           │                 │              │
                    ┌──────▼──────┐   ┌──────▼──────┐  ┌───▼─────────┐
                    │  Approve /  │   │   Verify    │  │  Platform   │
                    │   Reject    │   │    Users    │  │  Analytics  │
                    │  Listings   │   │ Farmer +    │  │  Revenue +  │
                    │             │   │   Buyer     │  │   Orders    │
                    └─────────────┘   └─────────────┘  └─────────────┘
```

---

## ✨ Features

### Public Pages

- Responsive homepage — Hero, Features, Categories, CTA, Footer
- Browse all active listings without login
- Dynamic filters — category, price range, location, delivery type
- Filters stored in URL — shareable and refresh-safe
- Listing detail page with image gallery and live bid price calculator

### Farmer Dashboard

- Stats overview — listings, bids, orders, wallet balance
- Create and edit listings via modal (no page redirect)
- Image upload via ImageBB
- View and sort bids by highest amount
- Mark order ready for pickup or ship with courier details
- Wallet page with full transaction history

### Buyer Dashboard

- Browse and filter crop listings
- Place bids with real-time price + fee estimation
- Pay via Stripe on accepted bids
- Track order progress step by step with timeline
- Confirm receipt to release payment to farmer
- Leave star rating and review after completion

### Admin Dashboard

- Analytics — total users, orders, active listings, platform revenue
- Approve or reject listings with rejection reason
- Verify farmer and buyer accounts
- Monitor all platform orders

### All Users

- Profile page with photo upload (updates navbar + sidebar instantly)
- Public user profile with reviews and star rating
- Verified account badge
- Role-based route protection via Next.js middleware

---

## 🛠️ Tech Stack

| Tech                    | Use                          |
| ----------------------- | ---------------------------- |
| Next.js 16 (App Router) | Full-stack framework         |
| TypeScript              | Type safety                  |
| Tailwind CSS            | Styling                      |
| React Hook Form + Zod   | Form handling and validation |
| Stripe React            | Payment UI                   |
| Axios                   | API calls                    |
| Better Auth (client)    | Session management           |
| ImageBB                 | Image upload                 |
| Sonner                  | Toast notifications          |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/             # login, register
│   ├── (dashboard)/        # farmer/*, buyer/*, admin/*, profile
│   │   ├── farmer/
│   │   │   ├── listings/   # manage listings
│   │   │   ├── bids/       # view and accept bids
│   │   │   ├── orders/     # manage orders
│   │   │   └── wallet/     # earnings and transactions
│   │   ├── buyer/
│   │   │   ├── bids/       # view bids
│   │   │   └── orders/     # pay and track orders
│   │   └── admin/
│   │       ├── analytics/  # platform stats
│   │       ├── listings/   # approve/reject
│   │       ├── orders/     # all orders
│   │       └── users/      # verify/ban users
│   ├── (public)/
│   │   ├── page.tsx        # homepage
│   │   ├── listings/       # browse listings
│   │   └── users/[id]/     # public user profile
│   └── orders/[id]/        # pay + success pages
├── components/
│   ├── ui/                 # Button, Input, Modal, Badge, Avatar, ImageUpload
│   ├── shared/             # Navbar, Sidebar, VerificationBanner, FarmerStats
│   ├── listings/           # ListingCard, ListingForm, BidSection, ListingGallery
│   └── orders/             # OrderTimeline, ReviewForm
├── hooks/                  # useAuth, useUserImage
├── lib/                    # axios, auth-client, stripe, imagebb, server-axios
└── types/                  # All TypeScript types and constants
```

---

## ⚙️ Environment Variables

Create `.env.local` in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_IMAGEBB_API_KEY=your_imagebb_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000`

---

## 📜 Available Scripts

```bash
npm run dev      # Start Next.js dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🧪 Test Accounts

| Role   | Email                    | Password    |
| ------ | ------------------------ | ----------- |
| Admin  | tareqferdous10@gmail.com | admin123456 |
| Farmer | farmer@test.com          | password123 |
| Buyer  | buyer@test.com           | password123 |

**Stripe Test Card:** `4242 4242 4242 4242` · Exp: `12/29` · CVC: `123`

---

## 🚢 Deployment

Recommended: **Vercel**

1. Push code to GitHub
2. Import repo in Vercel
3. Set all environment variables in Vercel dashboard
4. Make sure `NEXT_PUBLIC_API_URL` points to the deployed backend URL

---

## 👤 Author

- **Name:** Tareq Ferdous
- **Email:** tareqferdous10@gmail.com
- **GitHub:** (https://github.com/tareqferdous)


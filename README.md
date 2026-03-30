# AgroLink Frontend

AgroLink is a role-based agriculture marketplace where farmers create crop listings, buyers place bids, and orders are handled with secure payments and review workflows.

## Live Links

- Frontend Live URL: `Add your deployed frontend URL`
- Backend Live URL: `Add your deployed backend URL`

## Features

- Modern responsive homepage with multiple sections (Hero, Features, Category, CTA, Footer)
- Authentication flow (login/register) with Better Auth session handling
- Role-based dashboards:
  - Farmer: manage listings, bids, orders, wallet
  - Buyer: browse listings, place bids, pay and track orders
  - Admin: manage users, listings, orders and analytics
- Listing management with image uploads and category-based filtering
- Bid flow with accept/reject actions and listing close behavior
- Stripe payment integration for order payments
- Review and rating support after completed orders
- Loading states, toast notifications, and form validation with Zod + React Hook Form

## End-to-End Role Flows

### Farmer Flow

```mermaid
flowchart LR
	F1[Register] --> F2[Login]
	F2 --> F3[Create Listing]
	F3 --> F4[Admin Approval]
	F4 --> F5[Receive Bids]
	F5 --> F6[Accept Bid]
	F6 --> F7[Ship Order]
	F7 --> F8[Done and Wallet Update]
```

### Buyer Flow

```mermaid
flowchart LR
	B1[Register] --> B2[Login]
	B2 --> B3[Browse Listings]
	B3 --> B4[Place Bid]
	B4 --> B5[Bid Accepted]
	B5 --> B6[Orders Pay Route]
	B6 --> B7[Stripe Payment]
	B7 --> B8[Order Success]
	B8 --> B9[Confirm Received]
	B9 --> B10[Submit Review]
```

### Admin Flow

```mermaid
flowchart LR
	A1[Login] --> A2[Approve or Reject Listings]
	A2 --> A3[Verify Users]
	A3 --> A4[Monitor Orders and Disputes]
	A4 --> A5[View Analytics]
```

### Quick Demo Sequence (for presentation)

```mermaid
flowchart LR
	D1[Farmer Creates Listing] --> D2[Buyer Places Bid]
	D2 --> D3[Farmer Accepts Bid]
	D3 --> D4[Buyer Completes Payment]
	D4 --> D5[Farmer Updates Shipment]
	D5 --> D6[Buyer Confirms and Reviews]
	D6 --> D7[Admin Checks Analytics]
```

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Axios
- Better Auth (client-side integration)
- Stripe.js
- Zod + React Hook Form

## Project Structure

```text
src/
	app/                 # App Router pages and layouts
	components/          # Reusable UI and feature components
	hooks/               # Custom React hooks
	lib/                 # API/auth/stripe helpers
	types/               # Shared TypeScript types
```

## Environment Variables

Create a `.env.local` file in the frontend root and set:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_IMAGEBB_API_KEY=your_imagebb_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

- Recommended platform: Vercel
- Set all required frontend environment variables in the deployment dashboard
- Ensure `NEXT_PUBLIC_API_URL` points to the deployed backend base URL

## Author

- Name: `Your Name`
- Email: `your-email@example.com`


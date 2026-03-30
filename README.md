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
%%{init: {"themeVariables": {"fontSize": "20px"}}}%%
flowchart TB
	classDef big font-size:20px,padding:16px;

	F1[Register Account] --> F2[Login to AgroLink]
	F2 --> F3[Create Crop<br/>Listing]
	F3 --> F4[Admin Reviews<br/>and Approves]
	F4 --> F5[Receive Buyer<br/>Bids]
	F5 --> F6[Accept Best<br/>Bid]
	F6 --> F7[Ship the Order]
	F7 --> F8[Order Complete<br/>Wallet Updated]

	class F1,F2,F3,F4,F5,F6,F7,F8 big;
```

### Buyer Flow

```mermaid
%%{init: {"themeVariables": {"fontSize": "20px"}}}%%
flowchart TB
	classDef big font-size:20px,padding:16px;

	B1[Register Account] --> B2[Login to AgroLink]
	B2 --> B3[Browse Crop<br/>Listings]
	B3 --> B4[Place a Bid]
	B4 --> B5[Bid Gets<br/>Accepted]
	B5 --> B6[Go to Order<br/>Payment Route]
	B6 --> B7[Complete Stripe<br/>Payment]
	B7 --> B8[Payment Success<br/>Page]
	B8 --> B9[Confirm Product<br/>Received]
	B9 --> B10[Submit Rating<br/>and Review]

	class B1,B2,B3,B4,B5,B6,B7,B8,B9,B10 big;
```

### Admin Flow

```mermaid
%%{init: {"themeVariables": {"fontSize": "20px"}}}%%
flowchart TB
	classDef big font-size:20px,padding:16px;

	A1[Admin Login] --> A2[Approve or Reject<br/>Listings]
	A2 --> A3[Verify Farmer<br/>and Buyer Accounts]
	A3 --> A4[Monitor Orders<br/>and Disputes]
	A4 --> A5[View Platform<br/>Analytics]

	class A1,A2,A3,A4,A5 big;
```

### Quick Demo Sequence (for presentation)

```mermaid
%%{init: {"themeVariables": {"fontSize": "20px"}}}%%
flowchart TB
	classDef big font-size:20px,padding:16px;

	D1[Farmer Creates<br/>Listing] --> D2[Buyer Places<br/>Bid]
	D2 --> D3[Farmer Accepts<br/>Bid]
	D3 --> D4[Buyer Completes<br/>Payment]
	D4 --> D5[Farmer Updates<br/>Shipment]
	D5 --> D6[Buyer Confirms<br/>and Reviews]
	D6 --> D7[Admin Checks<br/>Analytics]

	class D1,D2,D3,D4,D5,D6,D7 big;
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


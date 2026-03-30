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
%%{init: {"themeVariables": {"fontSize": "24px"}}}%%
flowchart TB
	classDef big font-size:24px,padding:20px;

	subgraph FRow1[" "]
		direction LR
		F1[Register Account] --> F2[Login to AgroLink] --> F3[Create Crop<br/>Listing]
	end

	subgraph FRow2[" "]
		direction LR
		F4[Admin Reviews<br/>and Approves] --> F5[Receive Buyer<br/>Bids] --> F6[Accept Best<br/>Bid]
	end

	subgraph FRow3[" "]
		direction LR
		F7[Ship the Order] --> F8[Order Complete<br/>Wallet Updated]
	end

	F3 --> F4
	F6 --> F7

	style FRow1 fill:transparent,stroke:transparent;
	style FRow2 fill:transparent,stroke:transparent;
	style FRow3 fill:transparent,stroke:transparent;

	class F1,F2,F3,F4,F5,F6,F7,F8 big;
```

### Buyer Flow

```mermaid
%%{init: {"themeVariables": {"fontSize": "24px"}}}%%
flowchart TB
	classDef big font-size:24px,padding:20px;

	subgraph BRow1[" "]
		direction LR
		B1[Register Account] --> B2[Login to AgroLink] --> B3[Browse Crop<br/>Listings]
	end

	subgraph BRow2[" "]
		direction LR
		B4[Place a Bid] --> B5[Bid Gets<br/>Accepted] --> B6[Go to Order<br/>Payment Route]
	end

	subgraph BRow3[" "]
		direction LR
		B7[Complete Stripe<br/>Payment] --> B8[Payment Success<br/>Page] --> B9[Confirm Product<br/>Received]
	end

	subgraph BRow4[" "]
		direction LR
		B10[Submit Rating<br/>and Review]
	end

	B3 --> B4
	B6 --> B7
	B9 --> B10

	style BRow1 fill:transparent,stroke:transparent;
	style BRow2 fill:transparent,stroke:transparent;
	style BRow3 fill:transparent,stroke:transparent;
	style BRow4 fill:transparent,stroke:transparent;

	class B1,B2,B3,B4,B5,B6,B7,B8,B9,B10 big;
```

### Admin Flow

```mermaid
%%{init: {"themeVariables": {"fontSize": "24px"}}}%%
flowchart TB
	classDef big font-size:24px,padding:20px;

	subgraph ARow1[" "]
		direction LR
		A1[Admin Login] --> A2[Approve or Reject<br/>Listings] --> A3[Verify Farmer<br/>and Buyer Accounts]
	end

	subgraph ARow2[" "]
		direction LR
		A4[Monitor Orders<br/>and Disputes] --> A5[View Platform<br/>Analytics]
	end

	A3 --> A4

	style ARow1 fill:transparent,stroke:transparent;
	style ARow2 fill:transparent,stroke:transparent;

	class A1,A2,A3,A4,A5 big;
```

### Quick Demo Sequence (for presentation)

```mermaid
%%{init: {"themeVariables": {"fontSize": "24px"}}}%%
flowchart TB
	classDef big font-size:24px,padding:20px;

	subgraph DRow1[" "]
		direction LR
		D1[Farmer Creates<br/>Listing] --> D2[Buyer Places<br/>Bid] --> D3[Farmer Accepts<br/>Bid]
	end

	subgraph DRow2[" "]
		direction LR
		D4[Buyer Completes<br/>Payment] --> D5[Farmer Updates<br/>Shipment] --> D6[Buyer Confirms<br/>and Reviews]
	end

	subgraph DRow3[" "]
		direction LR
		D7[Admin Checks<br/>Analytics]
	end

	D3 --> D4
	D6 --> D7

	style DRow1 fill:transparent,stroke:transparent;
	style DRow2 fill:transparent,stroke:transparent;
	style DRow3 fill:transparent,stroke:transparent;

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


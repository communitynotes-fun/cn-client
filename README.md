# Prediction Markets Platform

## Overview

A decentralized prediction markets platform that allows users to create markets, make predictions, and earn rewards based on outcomes.

## MultiBaas Integration

This project leverages MultiBaas to interact with smart contracts deployed on the Sepolia testnet. We use MultiBaas for:

- Querying event data (PredictionMade, MarketResolved, etc.)
- Aggregating on-chain data for market volumes and prediction statistics
- Simplifying complex blockchain interactions through custom API endpoints

## Team

- **Angelica Willianto** - Full Stack Developer - [@awill\_\_](https://twitter.com/awill__)
- **Alessandro Figo** - Full Stack Developer - [@mku_eth](https://twitter.com/sarahj_eth)

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A MetaMask wallet with Polygon POL

### Installation

1. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

1,. Set up environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local` to add your MultiBaas API key and other required variables.

1.. Start the development server

```bash
npm run dev
# or
yarn dev
```

1. Open [http://localhost:3000](http://localhost:3000) in your browser

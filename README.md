# HeroTrader - Trading Journal & Analytics Dashboard

A modern, responsive, and aesthetically premium **Trading Journal** web application built using **React** and **Vite**. 

This application helps traders log, track, and analyze their trades. Data is persisted in the browser's `localStorage` (no backend required) and the app is fully deployable to **Vercel** on their Free Plan.

> [!WARNING]
> **Purpose & Disclaimer**: This tool is for journaling and performance analytics only. It does **not** provide trading signals, financial advice, or buy/sell recommendations.

---

## Features

- **Performance Dashboard**: Overview cards tracking Total Trades, Win Rate %, Net PnL, Winning/Losing counts, and Average PnL.
- **Custom Equity Curve**: Interactive SVG chart depicting cumulative profit/loss over time with smooth color transitions and hover indicators.
- **Add / Edit Trade Modal**: Quick forms with live profit/loss previews, type toggles (Buy/Sell), and comprehensive positive-value validation.
- **Detailed History Log**: Fully sortable (by date), searchable (notes and assets), and filterable (by asset type and date range) log table.
- **CSV Data Exporter**: Export your filtered trade logs to CSV with a single click.
- **Analytics View**: Advanced stats card highlighting Profit Factors, Win/Loss ratios, Gross Profit vs Gross Loss, and best/worst trade outliers.
- **Theme Toggling**: Seamless transition between a sleek modern light theme and a dark mode.
- **Local Storage Sync**: Instantly saves progress across refreshes.

---

## Project Structure

```text
trading-journal/
├── public/
│   └── favicon.svg         # Modern trading favicon
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx   # Analytics overview & SVG equity chart
│   │   ├── TradeForm.jsx   # Add & Edit modal with live validations
│   │   ├── TradeHistory.jsx# Table grid with sorting, filters, & CSV download
│   │   ├── Statistics.jsx  # Outlier display & win/loss gauge
│   │   ├── Sidebar.jsx     # Navigation, profile, and hero button
│   │   └── ThemeToggle.jsx # Slide-in style light/dark mode switch
│   ├── hooks/
│   │   └── useLocalStorage.js # Custom hook for localStorage sync
│   ├── App.jsx             # State container and layout routing
│   ├── App.css             # Component wrapper styles
│   ├── index.css           # Design tokens, CSS variables, resets, & responsive styling
│   └── main.jsx            # React mounting hook
├── index.html              # HTML shell & SEO meta tags
├── vite.config.js          # Vite configuration
└── package.json            # Script definitions and dependency trees
```

---

## Local Setup & Development

### 1. Prerequisites
Ensure you have **Node.js** (v18.0.0 or higher) and **npm** installed.

### 2. Installation
Clone the repository, navigate into the directory, and install the dependencies:
```bash
npm install
```

### 3. Run Development Server
Start the local server with hot module replacement (HMR):
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
Verify that compilation succeeds and output bundles are optimized:
```bash
npm run build
```

---

## Deployment Steps

This project is fully compatible with Vercel's Free Tier and requires zero configuration to deploy.

### Option A: Deployment via GitHub & Vercel Integration (Recommended)

1. **Create a GitHub Repository**:
   - Go to [GitHub](https://github.com) and create a new repository (e.g., `trading-journal`).
   - Run the following in your local project folder to initialize git and push:
     ```bash
     git init
     git add .
     git commit -m "feat: initial commit for trading journal"
     git branch -M main
     git remote add origin https://github.com/YOUR_GITHUB_USERNAME/trading-journal.git
     git push -u origin main
     ```

2. **Connect to Vercel**:
   - Go to the [Vercel Dashboard](https://vercel.com).
   - Click **Add New** > **Project**.
   - Import your `trading-journal` repository from GitHub.
   - Vercel will auto-detect **Vite** as the framework and configure the build settings:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`
   - Click **Deploy**.
   - Your site will be live on a secure HTTPS URL (e.g., `trading-journal-nine.vercel.app`) in under a minute!

---

### Option B: Deploying directly via Vercel CLI (Command Line)

If you prefer deploying from your terminal without linking to GitHub:

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Log in to Vercel:
   ```bash
   vercel login
   ```
3. Run the deployment command inside the project directory:
   ```bash
   vercel
   ```
   - *Vercel will ask a few setup questions. Press Enter to accept the default options.*
4. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## Assignment Requirements Met
- **"Built for Digital Heroes"** button: Beautifully integrated in the sidebar footer, linking directly to [https://digitalheroesco.com](https://digitalheroesco.com).
- **Profile Identification**: Full name (**Rishabh Patel**) and email (**rishabhpatel00042@gmail.com**) displayed in the sidebar card.
- **Footer**: Includes the label **"Built by Rishabh Patel"**.

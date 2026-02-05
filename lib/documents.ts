export const mockDocuments = [
  {
    id: "doc-1",
    title: "Account Opening Process",
    content: `To open an account with our platform, users must be at least 18 years old and provide valid identification. The process takes approximately 5-10 minutes and requires:
    1. Valid government-issued ID (passport, driver's license, or national ID)
    2. Proof of address (utility bill or bank statement from last 3 months)
    3. Email verification
    4. Phone number verification
    Once submitted, accounts are typically verified within 24-48 hours. Users will receive an email confirmation once approved.`,
    category: "Account Management"
  },
  {
    id: "doc-2",
    title: "Trading Hours and Market Access",
    content: `Our platform provides access to multiple markets with different trading hours:
    - Stock Market: Monday-Friday, 9:30 AM - 4:00 PM EST
    - Cryptocurrency: 24/7 trading available
    - Forex: Sunday 5 PM - Friday 5 PM EST
    Please note that some assets may have limited liquidity during off-peak hours. Market holidays may affect trading availability.`,
    category: "Trading"
  },
  {
    id: "doc-3",
    title: "Deposit and Withdrawal Policy",
    content: `Deposits can be made via bank transfer, debit card, or cryptocurrency. Minimum deposit is $10. Deposits typically reflect within:
    - Bank transfer: 1-3 business days
    - Debit card: Instant to 30 minutes
    - Cryptocurrency: 10-60 minutes depending on network
    Withdrawals require account verification and are processed within 1-5 business days. Daily withdrawal limit is $50,000 for verified accounts. First-time withdrawals may take longer for security verification.`,
    category: "Payments"
  },
  {
    id: "doc-4",
    title: "Security Features and Two-Factor Authentication",
    content: `We implement bank-level security measures including:
    - 256-bit SSL encryption for all data transmission
    - Two-factor authentication (2FA) via SMS or authenticator apps
    - Biometric login options (fingerprint/face ID)
    - Cold storage for 95% of cryptocurrency assets
    - Regular security audits and penetration testing
    We strongly recommend all users enable 2FA. To set up 2FA, go to Settings > Security > Enable Two-Factor Authentication.`,
    category: "Security"
  },
  {
    id: "doc-5",
    title: "Fee Structure and Pricing",
    content: `Our transparent fee structure:
    - Stock trades: $0 commission
    - Cryptocurrency trades: 0.5% per transaction
    - Forex trades: Spread-based pricing (typically 0.1-0.3%)
    - Deposit fees: Free for bank transfers, 2.9% for card payments
    - Withdrawal fees: Free for bank transfers (minimum $50), blockchain fees apply for crypto
    - Inactivity fee: $10/month after 12 months of no activity
    Premium members receive 50% discount on all trading fees.`,
    category: "Pricing"
  },
  {
    id: "doc-6",
    title: "Customer Support and Contact Methods",
    content: `Our customer support team is available through multiple channels:
    - Live chat: 24/7 (average response time: 2 minutes)
    - Email: support@platform.com (response within 24 hours)
    - Phone: +1-800-TRADING (Mon-Fri, 8 AM - 8 PM EST)
    - Help center: Comprehensive guides and FAQs at help.platform.com
    For urgent issues like account access or suspected fraud, please call our emergency hotline immediately.`,
    category: "Support"
  },
  {
    id: "doc-7",
    title: "Tax Reporting and Documentation",
    content: `We provide comprehensive tax documentation for all users:
    - Annual tax forms (1099-B for US users) available by February 15th
    - Transaction history export in CSV/PDF format
    - Realized gains/losses reports
    - Downloadable monthly and annual statements
    Users can access tax documents via Dashboard > Tax Center. We recommend consulting with a tax professional for personalized advice. The platform does not provide tax advice.`,
    category: "Compliance"
  },
  {
    id: "doc-8",
    title: "Mobile App Features and Availability",
    content: `Our mobile app is available for iOS (12.0+) and Android (8.0+) devices. Features include:
    - Real-time market data and price alerts
    - Quick trade execution with biometric confirmation
    - Portfolio tracking and performance analytics
    - Push notifications for market movements and account activity
    - Offline mode for viewing portfolio (trading requires connection)
    Download from App Store or Google Play Store. The app syncs seamlessly with your web account.`,
    category: "Product Features"
  },
  {
    id: "doc-9",
    title: "Account Verification Levels and Limits",
    content: `We offer three verification levels with increasing limits:
    Level 1 (Basic): Email verified - $1,000 daily deposit limit, view-only access
    Level 2 (Verified): ID + address verified - $10,000 daily limit, full trading access
    Level 3 (Premium): Enhanced verification + video call - $100,000 daily limit, margin trading, API access
    Upgrade your verification level anytime through Settings > Account > Verification. Higher levels unlock advanced features and better rates.`,
    category: "Account Management"
  },
  {
    id: "doc-10",
    title: "Referral Program and Rewards",
    content: `Earn rewards by referring friends:
    - You receive $25 when a referred friend makes their first deposit of $100+
    - Your friend receives $25 welcome bonus
    - No limit on number of referrals
    - Rewards paid within 7 days of qualifying deposit
    - Additional bonuses for top referrers (monthly leaderboard)
    Share your unique referral link from Dashboard > Refer & Earn. Terms and conditions apply.`,
    category: "Rewards"
  }
];

// Function to chunk documents for better retrieval
export function chunkDocument(doc: typeof mockDocuments[0], chunkSize: number = 500) {
  const chunks = [];
  const words = doc.content.split(' ');
  
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    chunks.push({
      id: `${doc.id}-chunk-${chunks.length}`,
      text: `${doc.title}\n\n${chunk}`,
      metadata: {
        documentId: doc.id,
        title: doc.title,
        category: doc.category,
        chunkIndex: chunks.length
      }
    });
  }
  
  return chunks;
}
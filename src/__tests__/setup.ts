// Test setup — runs before all tests
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret_12345";
process.env.STRIPE_SECRET_KEY = "sk_test_placeholder";
process.env.STRIPE_PRICE_PRO_MONTHLY = "price_pro_monthly_test";
process.env.STRIPE_PRICE_PRO_ANNUAL = "price_pro_annual_test";
process.env.STRIPE_PRICE_TEAM_MONTHLY = "price_team_monthly_test";
process.env.STRIPE_PRICE_TEAM_ANNUAL = "price_team_annual_test";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

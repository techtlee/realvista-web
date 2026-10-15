/**
 * Demo mode: for a shared preview deployment (e.g. on Vercel) with no backend.
 * Submissions succeed without being sent anywhere, and the page says so in a
 * banner — opt-in and announced, so a deployed page never *silently* claims
 * an enquiry arrived. Off unless NEXT_PUBLIC_DEMO_MODE=1; never set it on
 * the production deployment.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === '1'

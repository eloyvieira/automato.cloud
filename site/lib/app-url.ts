/**
 * Public base URL of the application, used to build absolute links (referral
 * links, metadata). Never hardcode the domain: it comes from the environment.
 */
export function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return url.replace(/\/+$/, '');
}

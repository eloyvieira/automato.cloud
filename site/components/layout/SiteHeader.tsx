import { getSession } from '@/lib/auth';
import { SiteHeaderNav } from './SiteHeaderNav';

/**
 * Shared site header. Reads the real session on the server and renders the
 * logged-in / logged-out menu accordingly. Used by every public page, so the
 * menu markup exists in exactly one place.
 */
export async function SiteHeader() {
  const session = await getSession();

  return <SiteHeaderNav authenticated={session !== null} />;
}

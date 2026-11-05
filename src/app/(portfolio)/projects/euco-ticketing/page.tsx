import { permanentRedirect } from 'next/navigation';

/**
 * The EUCO Tickets case study now lives on the web subdomain. This file exists
 * only because an earlier version of the site had the page here; a static route
 * folder beats the dynamic [slug] route, so it has to redirect explicitly.
 * (If this folder doesn't exist in your repo, you don't need it: [slug] redirects.)
 */
export default function EucoTicketingMoved() {
  permanentRedirect('https://web.paolo.org.uk/portfolio/euco-tickets');
}

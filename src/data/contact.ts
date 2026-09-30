// Contact form settings. The Worker that receives the form lives in workers/contact/.
// Topics come from the Worker so the picker and its validation never drift apart.
export { TOPICS as CONTACT_TOPICS, type TopicId } from '../../workers/contact/src/topics';

export const CONTACT_EMAIL = 'contact@floci.io';

// Production values. Override locally with PUBLIC_CONTACT_ENDPOINT / PUBLIC_TURNSTILE_SITE_KEY
// (see workers/contact/README.md). Both are public by design; the secrets live in Cloudflare.
const PROD_ENDPOINT = 'https://floci-contact.floci.workers.dev/';
const PROD_TURNSTILE_SITE_KEY = '0x4AAAAAAFKmK2scMLECbJtV';

export const CONTACT_ENDPOINT: string =
  import.meta.env.PUBLIC_CONTACT_ENDPOINT || PROD_ENDPOINT;
export const TURNSTILE_SITE_KEY: string =
  import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || PROD_TURNSTILE_SITE_KEY;

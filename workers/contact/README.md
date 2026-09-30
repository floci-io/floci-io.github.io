# floci-contact

The Cloudflare Worker behind [floci.io/contact](https://floci.io/contact/). GitHub Pages can't run
server code, so the form posts here. The Worker:

1. accepts requests only from `ALLOWED_ORIGINS`
2. drops honeypot submissions with a fake success
3. validates the fields (`src/validate.ts`; topics in `src/topics.ts`, shared with the site)
4. rate limits each IP to 5 requests a minute
5. verifies the Cloudflare Turnstile token
6. emails the team at `TO_EMAIL` through Resend, with `reply_to` set to the sender
7. sends the sender a fixed confirmation that includes nothing they typed, so the form can't
   be used to relay spam
8. posts the message to Telegram (best effort, and only when both Telegram secrets are set)

It stores nothing.

## One-time setup

1. **Inbox:** in Namecheap → Domain → Redirect Email, forward `contact@floci.io` to the maintainer inbox.
2. **Resend:** add the domain `floci.io` and create the DNS records it lists in Namecheap
   (DKIM TXT `resend._domainkey`, CNAMEs `send` and `rsend` pointing at `*.forge.rmta.net`, and
   optionally `_dmarc` TXT `v=DMARC1; p=none;`). They don't touch the root MX or SPF, so
   forwarding keeps working. Create an API key with **sending access** only.
3. **Turnstile:** in the Cloudflare dashboard, add a widget (managed mode) for `floci.io` and
   `localhost`. Put the **site key** in `PROD_TURNSTILE_SITE_KEY` in `src/data/contact.ts`.
4. **Telegram (optional, currently off):** create a bot with @BotFather, add it to the team chat,
   send a message, and read the chat id from `https://api.telegram.org/bot<token>/getUpdates`.
   Notifications stay off until both `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set; delete
   either secret (`wrangler secret delete`) to turn them off again.
5. **Deploy:**
   ```bash
   cd workers/contact
   npm ci
   npx wrangler login
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put TURNSTILE_SECRET
   # optional, only to turn Telegram notifications on:
   # npx wrangler secret put TELEGRAM_BOT_TOKEN
   # npx wrangler secret put TELEGRAM_CHAT_ID
   npx wrangler deploy
   ```
   Put the URL it prints in `PROD_ENDPOINT` in `src/data/contact.ts`.
6. **CI:** add a `CLOUDFLARE_API_TOKEN` repository secret (template "Edit Cloudflare Workers").
   `.github/workflows/deploy-contact-worker.yml` then tests and deploys on every push to `main`
   that touches `workers/contact/`.

## Local development

```bash
cd workers/contact
cp .dev.vars.example .dev.vars   # Turnstile test secret, Resend test inbox
npm run dev                      # http://localhost:8787

# in another terminal, from the repo root
PUBLIC_CONTACT_ENDPOINT=http://localhost:8787/ \
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA \
  npm run dev
```

Cloudflare's test keys: site key `1x00000000000000000000AA` with secret
`1x0000000000000000000000000000000AA` always passes, and `2x00000000000000000000AB` with
`2x0000000000000000000000000000000AA` always fails. With `TO_EMAIL=delivered@resend.dev`,
Resend accepts the email without delivering it anywhere.

## Tests

```bash
npm test          # vitest: validation and the full request handler, with fetch stubbed
npm run typecheck
```

Only the default handler may be exported from `src/index.ts`. The Workers runtime treats every
named export of the entry module as an entrypoint and refuses to start otherwise; put shared helpers
in their own module, as with `src/messages.ts`.

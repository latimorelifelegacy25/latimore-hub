# Fillout Webhook Token Deployment

The Fillout webhook now accepts the static header configured in the Fillout Advanced Webhook screen.

Route: /api/webhooks/fillout

Required header name: x-webhook-token

Vercel environment variable: FILLOUT_WEBHOOK_TOKEN

Legacy fallback environment variable: FILLOUT_SECRET

Result: Valid Fillout submissions no longer fail just because Fillout sends a static token header instead of HMAC signature headers.

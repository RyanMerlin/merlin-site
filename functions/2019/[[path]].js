// HTTP 410 Gone for WordPress-era dated permalinks under /2019/.
// These posts were permanently removed in the platform migration. 410 (vs a
// 301-to-home) tells search engines the content is gone for good, so they drop
// the URL cleanly instead of treating a homepage redirect as a soft 404.
//
// Catch-all ([[path]]) matches /2019, /2019/, and any /2019/.../ depth, with or
// without a trailing slash. Scoping the Function to /2019/* keeps every other
// route (posts, redirects, static assets, _headers caching) on the pure-static
// path, untouched.
export const onRequest = () =>
  new Response(
    "410 Gone\n\nThis page was permanently removed. See https://ryanmerlin.com/\n",
    {
      status: 410,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    },
  );

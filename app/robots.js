export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vaultsyncc.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/api/',
          '/auth/',
          '/sign-in',
          '/sign-up',
          '/signin',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard',
          '/api/',
          '/auth/',
          '/sign-in',
          '/sign-up',
          '/signin',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/dashboard',
          '/api/',
          '/auth/',
          '/sign-in',
          '/sign-up',
          '/signin',
        ],
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

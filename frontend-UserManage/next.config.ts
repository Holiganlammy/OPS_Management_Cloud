/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/users/dashboard",
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  output: 'standalone',
  // middleware: true,
}

module.exports = nextConfig
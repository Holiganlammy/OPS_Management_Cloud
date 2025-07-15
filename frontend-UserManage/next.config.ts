/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ["vpnptec.dyndns.org", "10.15.100.227"],
  },
}

module.exports = nextConfig
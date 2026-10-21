const nextConfig = {
  async rewrites() {
    const backend = process.env.BACKEND_URL || 'http://backend:5000';
    return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];
  },
};
export default nextConfig;
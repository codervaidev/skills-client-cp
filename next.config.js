/** @type {import('next').NextConfig} */

const DEFAULT_COURSE_ID = "15";

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // This repo currently has many ESLint warnings that are treated as build-blocking.
    // We still keep ESLint for local dev/CI via `next lint`, but don't fail production builds.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/course/:chapterid/:moduleid",
        destination: `/course/${DEFAULT_COURSE_ID}/:chapterid/:moduleid`,
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;

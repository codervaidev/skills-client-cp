/** @type {import('next').NextConfig} */

const DEFAULT_COURSE_ID = "15";

const nextConfig = {
  reactStrictMode: true,
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

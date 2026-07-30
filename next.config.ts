import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker Compose self-hosted deployhez (docker-compose.yml) — kisebb,
  // önálló production image, ami nem igényli a teljes node_modules-t.
  output: "standalone",
};

export default nextConfig;

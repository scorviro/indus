import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Whitelist ngrok development hosts to allow HMR (Hot Module Replacement) connections
  allowedDevOrigins: [
    "63f0-2401-4900-5553-7143-4730-b91-6b75-467d.ngrok-free.app",
    "*.ngrok-free.app",
    "*.ngrok.io"
  ]
};

export default nextConfig;

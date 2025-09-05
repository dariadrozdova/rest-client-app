import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

const withNextIntl = createNextIntlPlugin("./shared/lib/i18n/request.ts");
export default withNextIntl({
  nextConfig,
});

// Environment variable validation
// Throws at build time if required variables are missing

function getEnvVar(name: string, required = true): string {
  const value = process.env[name];
  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
      `Make sure to add it to your .env.local file.`
    );
  }
  return value || "";
}

function getEnvVarUrl(name: string, required = true): string {
  const value = getEnvVar(name, required);
  if (value && !value.startsWith("http://") && !value.startsWith("https://")) {
    throw new Error(
      `Environment variable ${name} must be a valid URL starting with http:// or https://`
    );
  }
  return value;
}

// Required environment variables
export const env = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: getEnvVarUrl("NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  
  // Optional: Service role key (only used server-side)
  SUPABASE_SERVICE_ROLE_KEY: getEnvVar("SUPABASE_SERVICE_ROLE_KEY", false),
  
  // App URL (for Open Graph images, sitemap, etc.)
  NEXT_PUBLIC_APP_URL: getEnvVarUrl("NEXT_PUBLIC_APP_URL", false) || "http://localhost:3000",
  
  // Feature flags (optional)
  NEXT_PUBLIC_ENABLE_ANALYTICS: getEnvVar("NEXT_PUBLIC_ENABLE_ANALYTICS", false) === "true",
  
  // Node environment
  NODE_ENV: process.env.NODE_ENV || "development",
  
  // Is development mode
  isDev: process.env.NODE_ENV === "development",
  
  // Is production mode
  isProd: process.env.NODE_ENV === "production",
} as const;

export type Env = typeof env;

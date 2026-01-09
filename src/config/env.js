import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment configuration
 * Centralizes all environment variables with defaults
 */
export const env = {
  // Server configuration
  PORT: parseInt(process.env.PORT, 10) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // GitHub API configuration
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_API_BASE_URL: 'https://api.github.com',
};

/**
 * Validate required environment variables
 */
export function validateEnv() {
  const requiredVars = ['GITHUB_TOKEN'];
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.warn(
      `Warning: Missing environment variables: ${missing.join(', ')}`
    );
    console.warn('The API will work with reduced rate limits (60 requests/hour)');
  }
}

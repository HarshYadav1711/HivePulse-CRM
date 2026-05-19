function requireViteEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const clientEnv = {
  apiBaseUrl: import.meta.env.PROD
    ? requireViteEnv('VITE_API_URL')
    : requireViteEnv('VITE_API_BASE_PATH'),
};

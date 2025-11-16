// Force cache bust utility
export const getCacheBustTitle = (language: string): string => {
  const timestamp = new Date().toISOString();
  return `🚀 WORKING v3 ${timestamp} - ${language === 'es' ? 'Panel Principal' : 'Dashboard'}`;
};

export const getCacheBustWelcome = (language: string, username: string): string => {
  return `⚡ LIVE UPDATE ⚡ ${language === 'es' ? 'Bienvenido de nuevo' : 'Welcome back'}, ${username}!`;
};
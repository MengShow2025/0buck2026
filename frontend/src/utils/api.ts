/**
 * Utility to get the correct API URL based on environment.
 * In production (Vercel), we use relative paths to leverage the Vercel Proxy and avoid CORS.
 * In development, we use VITE_BACKEND_URL if provided, or fall back to relative.
 */
export const getApiUrl = (path: string): string => {
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // v3.4.6: Leverage Vercel Proxy (configured in vercel.json) for both Prod and Dev
  // This avoids CORS issues entirely and simplifies deployment.
  const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || '';
  
  if (backendUrl) {
    // Development: Use VITE_BACKEND_URL if provided
    if (backendUrl.endsWith('/api') && normalizedPath.startsWith('/api')) {
      return `${backendUrl}${normalizedPath.substring(4)}`;
    }
    return `${backendUrl}${normalizedPath.startsWith('/api') ? normalizedPath : `/api${normalizedPath}`}`;
  }

  // Production or Fallback: Always use relative path to leverage Vercel Proxy
  return normalizedPath.startsWith('/api') ? normalizedPath : `/api${normalizedPath}`;
};

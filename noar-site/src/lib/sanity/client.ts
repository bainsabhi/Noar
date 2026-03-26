import { createClient, type SanityClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const isConfigured = projectId && /^[a-z0-9-]+$/.test(projectId);

export const sanityClient: SanityClient | null = isConfigured
  ? createClient({
      projectId,
      dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
      apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
      useCdn: true,
    })
  : null;

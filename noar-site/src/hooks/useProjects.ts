import { useState, useEffect } from 'react';
import { sanityClient, allProjectsQuery, featuredProjectsQuery, projectBySlugQuery } from '../lib/sanity';
import type { Project } from '../types/project';

interface QueryState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

const missingConfigMessage = 'Sanity not configured';

export function useProjects(): QueryState<Project[]> {
  const [state, setState] = useState<QueryState<Project[]>>({ data: [], loading: true, error: null });

  useEffect(() => {
    if (!sanityClient) {
      return;
    }
    const controller = new AbortController();
    sanityClient
      .fetch<Project[]>(allProjectsQuery, {}, { signal: controller.signal })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setState({ data: [], loading: false, error: err.message });
        }
      });
    return () => controller.abort();
  }, []);

  if (!sanityClient) {
    return { data: [], loading: false, error: missingConfigMessage };
  }

  return state;
}

export function useFeaturedProjects(): QueryState<Project[]> {
  const [state, setState] = useState<QueryState<Project[]>>({ data: [], loading: true, error: null });

  useEffect(() => {
    if (!sanityClient) {
      return;
    }
    const controller = new AbortController();
    sanityClient
      .fetch<Project[]>(featuredProjectsQuery, {}, { signal: controller.signal })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setState({ data: [], loading: false, error: err.message });
        }
      });
    return () => controller.abort();
  }, []);

  if (!sanityClient) {
    return { data: [], loading: false, error: missingConfigMessage };
  }

  return state;
}

export function useProject(slug: string | undefined): QueryState<Project | null> {
  const [state, setState] = useState<QueryState<Project | null>>({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!slug) {
      return;
    }
    if (!sanityClient) {
      return;
    }
    const controller = new AbortController();
    sanityClient
      .fetch<Project | null>(projectBySlugQuery, { slug }, { signal: controller.signal })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setState({ data: null, loading: false, error: err.message });
        }
      });
    return () => controller.abort();
  }, [slug]);

  if (!slug) {
    return { data: null, loading: false, error: 'No slug provided' };
  }

  if (!sanityClient) {
    return { data: null, loading: false, error: missingConfigMessage };
  }

  return state;
}

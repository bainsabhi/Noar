import type { PortableTextBlock } from '@portabletext/react';

export interface SanityImage {
  _type: 'image';
  _key?: string;
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export type PropertyType = 'Single' | 'Low Rise Multi' | 'Midrise' | 'Highrise';

export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage: SanityImage;
  location: string;
  propertyType: PropertyType;
  gallery: SanityImage[];
  description: PortableTextBlock[];
  featured: boolean;
  order: number;
}

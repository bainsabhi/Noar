export const allProjectsQuery = `
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    slug,
    coverImage,
    location,
    propertyType,
    gallery,
    description,
    featured,
    order
  }
`;

export const featuredProjectsQuery = `
  *[_type == "project" && featured == true] | order(order asc) {
    _id,
    title,
    slug,
    coverImage,
    location,
    propertyType,
    featured
  }
`;

export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    coverImage,
    location,
    propertyType,
    gallery,
    description,
    featured,
    order
  }
`;

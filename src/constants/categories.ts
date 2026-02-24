export const categories = ['Bags', 'Shoes', 'Jackets', 'Hats'] as const;
export const CATEGORY_SLUGS = categories.map(c => c.toLowerCase());
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const columns = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/columns' }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().default(''),
    order: z.number().default(0),
  }).strict(),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    column: reference('columns').optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }).strict(),
});

export const collections = { posts, columns };

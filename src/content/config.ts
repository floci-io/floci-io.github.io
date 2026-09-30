import { defineCollection, z } from 'astro:content';
import { authorIds } from '../data/authors';

const chronicle = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.enum(authorIds),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
    heroImage: z.string().optional(),
  }),
});

const labs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    cloud: z.enum(['aws', 'azure', 'gcp', 'oci', 'all']),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    duration: z.string(),
    author: z.enum(authorIds),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { chronicle, labs };

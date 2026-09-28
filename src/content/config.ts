import { defineCollection, z } from 'astro:content';

const chronicle = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
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
    cloud: z.enum(['aws', 'azure', 'gcp', 'all']),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    duration: z.string(),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { chronicle, labs };

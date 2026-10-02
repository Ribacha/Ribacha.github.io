import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 博客文章：Obsidian 同步只需把 .md 文件放进 src/content/blog/ 对应分类目录
// 文件头部 frontmatter：title / description / date / category
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    category: z.enum(['ios', 'notes', 'essays']),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };

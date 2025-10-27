import {
  BLOG_POST_OPEN_SOURCE_AGENT_URL,
  BLOG_POST_WHY_WE_BUILT_URL,
  BLOG_POST_DESIGN_DECISIONS_URL,
} from '~/lib/constants';

/**
 * Blog posts data
 * Links to external Neon blog posts
 */

export interface BlogPost {
  title: string;
  url: string;
  date: string;
  excerpt: string;
}

export const blogPosts: BlogPost[] = [
  {
    title: 'app.build: An Open-Source AI Agent That Builds Full-Stack Apps',
    url: BLOG_POST_OPEN_SOURCE_AGENT_URL,
    date: 'June 4, 2025',
    excerpt:
      'A reference implementation for any codegen product looking to build on top of Neon. Learn how app.build creates full-stack applications with end-to-end tests and automated deployments.',
  },
  {
    title: 'Why we built app.build',
    url: BLOG_POST_WHY_WE_BUILT_URL,
    date: 'August 25, 2025',
    excerpt:
      'A reference architecture for agent-built applications. Exploring the journey from LLM code generation to full-stack applications with CI/CD, auth, and real deployments.',
  },
  {
    title: 'Design decisions behind app.build',
    url: BLOG_POST_DESIGN_DECISIONS_URL,
    date: 'Jun 26, 2025',
    excerpt:
      "A deep dive into the technical and design decisions that shaped app.build's architecture and implementation.",
  },
];

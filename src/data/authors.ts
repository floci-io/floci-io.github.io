export interface Author {
  name: string;
  kind: 'person' | 'organization';
  github: string;
  linkedin?: string;
  x?: string;
}

export const authors = {
  'floci-team': {
    name: 'Floci Team',
    kind: 'organization',
    github: 'https://github.com/floci-io',
    linkedin: 'https://www.linkedin.com/company/floci',
    x: 'https://x.com/floci_io',
  },
  hectorvent: {
    name: 'Hector Ventura',
    kind: 'person',
    github: 'https://github.com/hectorvent',
    linkedin: 'https://www.linkedin.com/in/hectorvent/',
    x: 'https://x.com/hectorvent',
  },
} satisfies Record<string, Author>;

export type AuthorId = keyof typeof authors;

export const authorIds = Object.keys(authors) as [AuthorId, ...AuthorId[]];

export function getAuthor(id: AuthorId): Author {
  return authors[id];
}

export function authorJsonLd(id: AuthorId) {
  const author = getAuthor(id);
  const sameAs = [author.linkedin, author.x].filter((url): url is string => Boolean(url));
  return {
    '@type': author.kind === 'person' ? 'Person' : 'Organization',
    name: author.name,
    url: author.github,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

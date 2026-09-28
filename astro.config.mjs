import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

const SHELL_LANGS = new Set(['bash', 'sh', 'shell', 'zsh', 'console']);

// Wraps Markdown code blocks in the site's terminal `.code-block` frame (styled in Layout.astro).
const terminalFrame = {
  name: 'floci-terminal-frame',
  pre(node) {
    if (this.options.lang === 'mermaid') return;
    delete node.properties.style;
  },
  root(root) {
    const lang = this.options.lang;
    if (lang === 'mermaid') return;
    const label = SHELL_LANGS.has(lang) ? 'bash' : lang === 'plaintext' || lang === 'text' ? undefined : lang;
    root.children = [{
      type: 'element',
      tagName: 'div',
      properties: { className: ['code-block'], ...(label && { 'data-lang': label }) },
      children: root.children,
    }];
  },
};

export default defineConfig({
  site: 'https://floci.io',
  output: 'static',
  integrations: [sitemap(), mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      transformers: [terminalFrame],
    },
  },
});

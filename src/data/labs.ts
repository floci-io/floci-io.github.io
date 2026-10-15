/**
 * Shared lookups for the 101 Labs pages (src/pages/labs/index.astro and [slug].astro).
 * Cloud hues are the text-tier tokens from Layout.astro, so lab text stays readable in both
 * themes. Difficulty colours live in the pages' CSS, keyed by a data-difficulty attribute.
 */
export const LAB_CLOUD_COLOR: Record<string, string> = {
  aws:   'var(--c-aws)',
  azure: 'var(--c-az)',
  gcp:   'var(--c-gcp)',
  oci:   'var(--c-oci)',
  all:   'var(--accent)',
};

export const LAB_CLOUD_LABEL: Record<string, string> = {
  aws:   'AWS',
  azure: 'Azure',
  gcp:   'GCP',
  oci:   'OCI',
  all:   'Multi-cloud',
};

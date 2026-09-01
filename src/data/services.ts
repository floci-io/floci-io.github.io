/**
 * Single source of truth for the per-cloud service counts advertised on the site.
 *
 * Change the numbers HERE and nowhere else. Headlines, stat tiles, OG images,
 * JSON-LD and every "+N more" chip derive from this file.
 *
 * How to obtain the true counts from the emulator repos (see
 * .claude/skills/update-service-counts/SKILL.md for the full procedure):
 *   aws   — `descriptor("…")` entries in ResolvedServiceCatalog.java that are
 *           `includeInStatus=true`. That set is exactly what `/_localstack/health`
 *           reports, so the advertised number is one a user can verify with curl.
 *           103 descriptors − 3 (`sts`, `signin` ride on `iam`; `ec2messages` on
 *           `ssm`) = 100. Do NOT count raw descriptors, and do NOT drop hyphenated
 *           endpoint codes — there are 11 of them and they are real services.
 *   azure — `EmulatorConfig.ServicesConfig` methods, minus `arm` (control plane)
 *   gcp   — one directory per service under services/
 *   oci   — `*ServiceConfig` accessors on `EmulatorConfig.ServicesConfig`
 */
export const SERVICE_COUNTS = {
  aws: 100,
  azure: 26,
  gcp: 25,
  oci: 8,
} as const;

export type Cloud = keyof typeof SERVICE_COUNTS;

export const CLOUD_LABELS: Record<Cloud, string> = {
  aws: 'AWS',
  azure: 'Azure',
  gcp: 'GCP',
  oci: 'OCI',
};

export const CLOUD_PORTS: Record<Cloud, number> = {
  aws: 4566,
  azure: 4577,
  gcp: 4588,
  oci: 4599,
};

/** Service names shown as chips on the home-page cloud cards. */
export const CARD_CHIPS: Record<Cloud, string[]> = {
  aws: ['S3', 'SQS', 'Lambda', 'DynamoDB', 'RDS', 'EKS'],
  azure: ['Blob', 'Queue', 'Table', 'Functions', 'Key Vault', 'Event Hubs', 'Service Bus'],
  gcp: ['GCS', 'Pub/Sub', 'Firestore', 'Datastore', 'Secret Manager', 'IAM'],
  oci: ['Object Storage', 'Queue', 'Streaming', 'KMS', 'Vault', 'Functions'],
};

/**
 * Names shown in the install-outcome line before the "+N more" tail.
 * Keep these short and equal-length across clouds — the outcome line is a
 * single row under the install block and must not wrap.
 */
const OUTCOME_PREVIEW: Record<Cloud, string[]> = {
  aws: ['S3', 'SQS', 'DynamoDB', 'Lambda', 'RDS'],
  azure: ['Blob', 'Queue', 'Table', 'Functions', 'Key Vault'],
  gcp: ['GCS', 'Pub/Sub', 'Firestore', 'Datastore', 'IAM'],
  oci: ['Object Storage', 'Queue', 'Streaming', 'KMS', 'Vault'],
};

/** "+61 more" — the remainder once `listed` names are shown. */
export function moreLabel(cloud: Cloud, listed: readonly string[]): string {
  return `+${SERVICE_COUNTS[cloud] - listed.length} more`;
}

/** The install-outcome line, e.g. `67 AWS services ready on :4566. S3 · … · +62 more`. */
export function outcomeMessage(cloud: Cloud): string {
  const port = `<span class="outcome-port">:${CLOUD_PORTS[cloud]}</span>`;
  const names = OUTCOME_PREVIEW[cloud];
  return `${SERVICE_COUNTS[cloud]} ${CLOUD_LABELS[cloud]} services ready on ${port}. ` +
    `${names.join(' · ')} · ${moreLabel(cloud, names)}`;
}

/** Keyed by install-tab id. `cli` and `win` both show the AWS outcome. */
export const OUTCOME_MESSAGES: Record<string, string> = {
  cli: outcomeMessage('aws'),
  win: outcomeMessage('aws'),
  aws: outcomeMessage('aws'),
  azure: outcomeMessage('azure'),
  gcp: outcomeMessage('gcp'),
  oci: outcomeMessage('oci'),
};

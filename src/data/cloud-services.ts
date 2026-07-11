/**
 * Per-service metadata for the AWS / Azure / GCP service grids.
 *
 * `category` selects a neutral glyph from <ServiceIcon>; `url` points at the
 * vendor's own documentation. Vendor product icons are deliberately NOT used —
 * their license terms cover architecture diagrams and forbid implying
 * endorsement, which a competing emulator's marketing site cannot claim.
 *
 * Every `url` below was verified to return HTTP 200. When adding a service,
 * re-run the check rather than trusting the URL shape.
 *
 * The AWS grid combines some services into one chip ("DynamoDB + Streams"), so
 * AWS_SERVICES.length is below SERVICE_COUNTS.aws. Azure and GCP are 1:1 and
 * asserted against SERVICE_COUNTS at build time.
 */
import { SERVICE_COUNTS } from './services';

export type ServiceCategory =
  | 'storage' | 'database' | 'compute' | 'containers' | 'networking'
  | 'messaging' | 'identity' | 'security' | 'observability' | 'analytics'
  | 'ai' | 'devtools' | 'billing';

export interface CloudService {
  /** Display name, e.g. "DynamoDB + Streams". */
  name: string;
  /** Wire protocol label shown under the name. */
  proto: string;
  category: ServiceCategory;
  /** Vendor documentation URL (verified 200). */
  url: string;
  /** Exclusive to Floci among free emulators — rendered with a ★. */
  exclusive?: boolean;
}

export const AWS_SERVICES: CloudService[] = [
  { name: 'S3', proto: 'REST XML', category: 'storage', url: 'https://aws.amazon.com/s3/' },
  { name: 'SQS', proto: 'Query / JSON', category: 'messaging', url: 'https://aws.amazon.com/sqs/' },
  { name: 'SNS', proto: 'Query / JSON', category: 'messaging', url: 'https://aws.amazon.com/sns/' },
  { name: 'DynamoDB + Streams', proto: 'JSON 1.1', category: 'database', url: 'https://aws.amazon.com/dynamodb/' },
  { name: 'Lambda', proto: 'REST JSON', category: 'compute', docker: 'default', url: 'https://aws.amazon.com/lambda/' },
  { name: 'API Gateway REST', proto: 'REST JSON', category: 'networking', url: 'https://aws.amazon.com/api-gateway/' },
  { name: 'API Gateway v2', proto: 'HTTP + WebSocket', category: 'networking', url: 'https://aws.amazon.com/api-gateway/', exclusive: true },
  { name: 'IAM', proto: 'Query (68+ ops)', category: 'identity', url: 'https://aws.amazon.com/iam/' },
  { name: 'STS', proto: 'Query (7 ops)', category: 'identity', url: 'https://docs.aws.amazon.com/STS/latest/APIReference/' },
  { name: 'Cognito', proto: 'JSON 1.1', category: 'identity', url: 'https://aws.amazon.com/cognito/', exclusive: true },
  { name: 'KMS', proto: 'JSON 1.1', category: 'security', url: 'https://aws.amazon.com/kms/' },
  { name: 'Kinesis', proto: 'JSON 1.1', category: 'messaging', url: 'https://aws.amazon.com/kinesis/data-streams/' },
  { name: 'Secrets Manager', proto: 'JSON 1.1', category: 'security', url: 'https://aws.amazon.com/secrets-manager/' },
  { name: 'SSM Parameter Store', proto: 'JSON 1.1', category: 'devtools', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html' },
  { name: 'CloudFormation', proto: 'Query', category: 'devtools', url: 'https://aws.amazon.com/cloudformation/' },
  { name: 'Step Functions', proto: 'JSON 1.1', category: 'devtools', url: 'https://aws.amazon.com/step-functions/' },
  { name: 'ElastiCache', proto: 'Redis + IAM', category: 'database', docker: 'default', url: 'https://aws.amazon.com/elasticache/', exclusive: true },
  { name: 'RDS', proto: 'PG + MySQL + IAM', category: 'database', docker: 'default', url: 'https://aws.amazon.com/rds/', exclusive: true },
  { name: 'EventBridge + Scheduler + Pipes', proto: 'JSON 1.1', category: 'messaging', url: 'https://aws.amazon.com/eventbridge/' },
  { name: 'CloudWatch Logs', proto: 'JSON 1.1', category: 'observability', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html' },
  { name: 'CloudWatch Metrics', proto: 'Query', category: 'observability', url: 'https://aws.amazon.com/cloudwatch/' },
  { name: 'MSK (Kafka)', proto: 'REST JSON', category: 'messaging', docker: 'default', url: 'https://aws.amazon.com/msk/' },
  { name: 'ECS', proto: 'JSON 1.1', category: 'containers', docker: 'default', url: 'https://aws.amazon.com/ecs/' },
  { name: 'EC2', proto: 'Query', category: 'compute', docker: 'default', url: 'https://aws.amazon.com/ec2/' },
  { name: 'Lightsail', proto: 'JSON 1.1', category: 'compute', url: 'https://aws.amazon.com/lightsail/' },
  { name: 'ACM', proto: 'JSON 1.1', category: 'security', url: 'https://aws.amazon.com/certificate-manager/' },
  { name: 'ECR', proto: 'JSON 1.1', category: 'containers', docker: 'default', url: 'https://aws.amazon.com/ecr/' },
  { name: 'SES + SES v2', proto: 'Query / JSON', category: 'messaging', url: 'https://aws.amazon.com/ses/' },
  { name: 'OpenSearch', proto: 'REST JSON', category: 'analytics', docker: 'default', url: 'https://aws.amazon.com/opensearch-service/' },
  { name: 'AppConfig + Data', proto: 'REST JSON', category: 'devtools', url: 'https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html' },
  { name: 'Athena', proto: 'REST JSON', category: 'analytics', docker: 'default', url: 'https://aws.amazon.com/athena/' },
  { name: 'Glue', proto: 'REST JSON', category: 'analytics', url: 'https://aws.amazon.com/glue/' },
  { name: 'Data Firehose', proto: 'REST JSON', category: 'analytics', url: 'https://aws.amazon.com/firehose/' },
  { name: 'Bedrock Runtime', proto: 'REST JSON', category: 'ai', url: 'https://aws.amazon.com/bedrock/' },
  { name: 'EKS', proto: 'REST JSON', category: 'containers', docker: 'default', url: 'https://aws.amazon.com/eks/' },
  { name: 'ELB v2', proto: 'REST JSON', category: 'networking', url: 'https://aws.amazon.com/elasticloadbalancing/', exclusive: true },
  { name: 'CodeBuild', proto: 'REST JSON', category: 'devtools', docker: 'default', url: 'https://aws.amazon.com/codebuild/', exclusive: true },
  { name: 'CodeDeploy', proto: 'REST JSON', category: 'devtools', url: 'https://aws.amazon.com/codedeploy/', exclusive: true },
  { name: 'Auto Scaling', proto: 'Query', category: 'compute', url: 'https://aws.amazon.com/autoscaling/', exclusive: true },
  { name: 'AWS Backup', proto: 'REST JSON', category: 'storage', url: 'https://aws.amazon.com/backup/', exclusive: true },
  { name: 'Route 53', proto: 'REST XML', category: 'networking', url: 'https://aws.amazon.com/route53/', exclusive: true },
  { name: 'Textract', proto: 'REST JSON', category: 'ai', url: 'https://aws.amazon.com/textract/', exclusive: true },
  { name: 'Transfer Family', proto: 'REST JSON', category: 'storage', url: 'https://aws.amazon.com/aws-transfer-family/', exclusive: true },
  { name: 'Transcribe', proto: 'REST JSON', category: 'ai', url: 'https://aws.amazon.com/transcribe/', exclusive: true },
  { name: 'Neptune', proto: 'REST JSON', category: 'database', docker: 'default', url: 'https://aws.amazon.com/neptune/', exclusive: true },
  { name: 'Cost Explorer', proto: 'JSON 1.1', category: 'billing', url: 'https://aws.amazon.com/aws-cost-management/aws-cost-explorer/' },
  { name: 'Pricing', proto: 'REST JSON', category: 'billing', url: 'https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/Welcome.html' },
  { name: 'CUR + BCM Data Exports', proto: 'REST JSON', category: 'billing', docker: 'default', url: 'https://aws.amazon.com/aws-cost-management/aws-cost-and-usage-reporting/' },
  { name: 'CloudFront', proto: 'REST XML', category: 'networking', url: 'https://aws.amazon.com/cloudfront/' },
  { name: 'AppSync', proto: 'REST JSON', category: 'networking', url: 'https://aws.amazon.com/appsync/' },
  { name: 'Cloud Map', proto: 'JSON 1.1', category: 'networking', url: 'https://aws.amazon.com/cloud-map/' },
  { name: 'AWS Config', proto: 'JSON 1.1', category: 'observability', url: 'https://aws.amazon.com/config/' },
  { name: 'Resource Groups Tagging', proto: 'JSON 1.1', category: 'devtools', url: 'https://docs.aws.amazon.com/resourcegroupstagging/latest/APIReference/' },
  { name: 'RDS Data API', proto: 'REST JSON', category: 'database', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html' },
  { name: 'AWS Batch', proto: 'REST JSON', category: 'compute', docker: 'default', url: 'https://aws.amazon.com/batch/' },
  { name: 'EMR', proto: 'JSON 1.1', category: 'analytics', url: 'https://aws.amazon.com/emr/' },
  { name: 'DocumentDB', proto: 'Query', category: 'database', docker: 'default', url: 'https://aws.amazon.com/documentdb/' },
  { name: 'CloudTrail', proto: 'JSON 1.1', category: 'observability', url: 'https://aws.amazon.com/cloudtrail/' },
  { name: 'WAF v2', proto: 'JSON 1.1', category: 'security', url: 'https://aws.amazon.com/waf/' },
  { name: 'CodePipeline', proto: 'JSON 1.1', category: 'devtools', url: 'https://aws.amazon.com/codepipeline/' },
  { name: 'Elastic Beanstalk', proto: 'Query', category: 'compute', url: 'https://aws.amazon.com/elasticbeanstalk/' },
  { name: 'IoT Core', proto: 'REST JSON', category: 'messaging', url: 'https://aws.amazon.com/iot-core/' },
  { name: 'MemoryDB', proto: 'JSON 1.1', category: 'database', docker: 'default', url: 'https://aws.amazon.com/memorydb/' },
  { name: 'S3 Vectors', proto: 'REST JSON', category: 'storage', url: 'https://aws.amazon.com/s3/features/vectors/' },
  { name: 'Amazon MQ', proto: 'REST JSON', category: 'messaging', docker: 'default', url: 'https://aws.amazon.com/amazon-mq/' },
  { name: 'Cloud Control API', proto: 'JSON 1.0', category: 'devtools', url: 'https://aws.amazon.com/cloudcontrolapi/' },
];

export const AZURE_SERVICES: CloudService[] = [
  { name: 'Blob Storage', proto: 'REST XML / JSON', category: 'storage', url: 'https://learn.microsoft.com/en-us/azure/storage/blobs/' },
  { name: 'Queue Storage', proto: 'REST JSON', category: 'messaging', url: 'https://learn.microsoft.com/en-us/azure/storage/queues/' },
  { name: 'Table Storage', proto: 'OData / REST JSON', category: 'database', url: 'https://learn.microsoft.com/en-us/azure/storage/tables/' },
  { name: 'Azure Functions', proto: 'HTTP / Timer Triggers', category: 'compute', docker: 'default', url: 'https://learn.microsoft.com/en-us/azure/azure-functions/' },
  { name: 'App Configuration', proto: 'REST JSON · Labels', category: 'devtools', url: 'https://learn.microsoft.com/en-us/azure/azure-app-configuration/' },
  { name: 'Key Vault', proto: 'REST · Secrets / Keys / Certs', category: 'security', url: 'https://learn.microsoft.com/en-us/azure/key-vault/' },
  { name: 'Event Hubs', proto: 'AMQP / Kafka / REST', category: 'messaging', docker: 'default', url: 'https://learn.microsoft.com/en-us/azure/event-hubs/' },
  { name: 'Service Bus', proto: 'AMQP · Topics / Queues', category: 'messaging', docker: 'default', url: 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/' },
  { name: 'Cosmos DB', proto: 'SQL native · Mongo / Cassandra / Gremlin', category: 'database', docker: 'default', url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/' },
  { name: 'AKS', proto: 'REST JSON · k3s', category: 'containers', docker: 'optional', url: 'https://learn.microsoft.com/en-us/azure/aks/' },
  { name: 'Azure SQL', proto: 'ARM · SQL Server', category: 'database', docker: 'default', url: 'https://learn.microsoft.com/en-us/azure/azure-sql/' },
  { name: 'API Management', proto: 'ARM · REST JSON', category: 'networking', url: 'https://learn.microsoft.com/en-us/azure/api-management/' },
  { name: 'Virtual Machines', proto: 'ARM · REST JSON', category: 'compute', docker: 'optional', url: 'https://learn.microsoft.com/en-us/azure/virtual-machines/' },
  { name: 'Cache for Redis', proto: 'ARM · Redis', category: 'database', docker: 'optional', url: 'https://learn.microsoft.com/en-us/azure/azure-cache-for-redis/' },
  { name: 'Container Registry', proto: 'ARM · registry:2', category: 'containers', docker: 'optional', url: 'https://learn.microsoft.com/en-us/azure/container-registry/' },
  { name: 'Virtual Network', proto: 'ARM · REST JSON', category: 'networking', url: 'https://learn.microsoft.com/en-us/azure/virtual-network/' },
  { name: 'Azure Monitor', proto: 'Logs · Metrics · KQL', category: 'observability', url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/' },
  { name: 'Microsoft Entra ID', proto: 'OAuth2 · OIDC · JWKS', category: 'identity', url: 'https://learn.microsoft.com/en-us/entra/identity/' },
  { name: 'Email Communication', proto: 'REST JSON · ARM', category: 'messaging', url: 'https://learn.microsoft.com/en-us/azure/communication-services/concepts/email/email-overview' },
  { name: 'Event Grid', proto: 'REST JSON · CloudEvents', category: 'messaging', url: 'https://learn.microsoft.com/en-us/azure/event-grid/' },
  { name: 'PostgreSQL Flexible Server', proto: 'ARM · PostgreSQL', category: 'database', docker: 'default', url: 'https://learn.microsoft.com/en-us/azure/postgresql/' },
  { name: 'Managed Identity', proto: 'IMDS · OAuth2 tokens', category: 'identity', url: 'https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/' },
];

export const GCP_SERVICES: CloudService[] = [
  { name: 'Cloud Storage', proto: 'REST JSON / XML', category: 'storage', url: 'https://cloud.google.com/storage/docs' },
  { name: 'Pub/Sub', proto: 'gRPC', category: 'messaging', url: 'https://cloud.google.com/pubsub/docs' },
  { name: 'Firestore', proto: 'gRPC', category: 'database', url: 'https://cloud.google.com/firestore/docs' },
  { name: 'Datastore', proto: 'HTTP/protobuf', category: 'database', url: 'https://cloud.google.com/datastore/docs' },
  { name: 'Secret Manager', proto: 'gRPC', category: 'security', url: 'https://cloud.google.com/secret-manager/docs' },
  { name: 'IAM', proto: 'REST JSON', category: 'identity', url: 'https://cloud.google.com/iam/docs' },
  { name: 'Managed Kafka', proto: 'REST JSON · Redpanda', category: 'messaging', docker: 'default', url: 'https://cloud.google.com/managed-service-for-apache-kafka/docs' },
  { name: 'Cloud Tasks', proto: 'gRPC · v2', category: 'messaging', url: 'https://cloud.google.com/tasks/docs' },
  { name: 'Cloud Run', proto: 'REST JSON', category: 'compute', docker: 'default', url: 'https://cloud.google.com/run/docs' },
  { name: 'Cloud SQL', proto: 'REST JSON · Postgres / MySQL', category: 'database', docker: 'default', url: 'https://cloud.google.com/sql/docs' },
  { name: 'Cloud Functions', proto: 'REST JSON', category: 'compute', url: 'https://cloud.google.com/functions/docs' },
  { name: 'Cloud KMS', proto: 'gRPC · REST JSON', category: 'security', url: 'https://cloud.google.com/kms/docs' },
  { name: 'Cloud Logging', proto: 'gRPC · REST JSON', category: 'observability', url: 'https://cloud.google.com/logging/docs' },
  { name: 'Cloud Monitoring', proto: 'gRPC · REST JSON', category: 'observability', url: 'https://cloud.google.com/monitoring/docs' },
  { name: 'Cloud Scheduler', proto: 'gRPC · REST JSON', category: 'messaging', url: 'https://cloud.google.com/scheduler/docs' },
  { name: 'GKE', proto: 'REST JSON · k3s', category: 'containers', docker: 'default', url: 'https://cloud.google.com/kubernetes-engine/docs' },
  { name: 'BigQuery', proto: 'REST JSON', category: 'analytics', url: 'https://cloud.google.com/bigquery/docs' },
  { name: 'Eventarc', proto: 'gRPC · REST JSON', category: 'messaging', url: 'https://cloud.google.com/eventarc/docs' },
  { name: 'Firebase Auth', proto: 'REST JSON', category: 'identity', url: 'https://firebase.google.com/docs/auth' },
  { name: 'Resource Manager', proto: 'REST JSON', category: 'devtools', url: 'https://cloud.google.com/resource-manager/docs' },
  { name: 'Service Usage', proto: 'REST JSON · LRO', category: 'devtools', url: 'https://cloud.google.com/service-usage/docs' },
  { name: 'Operations', proto: 'gRPC · REST JSON · LRO', category: 'devtools', url: 'https://google.aip.dev/151' },
];

for (const [label, list, expected] of [
  ['AZURE_SERVICES', AZURE_SERVICES, SERVICE_COUNTS.azure],
  ['GCP_SERVICES', GCP_SERVICES, SERVICE_COUNTS.gcp],
] as const) {
  if (list.length !== expected) {
    throw new Error(
      `${label} has ${list.length} entries but SERVICE_COUNTS says ${expected}. ` +
      `The grid enumerates services 1:1 — add or remove the service, don't just edit the count.`
    );
  }
}

if (AWS_SERVICES.length > SERVICE_COUNTS.aws) {
  throw new Error(
    `AWS_SERVICES has ${AWS_SERVICES.length} chips but SERVICE_COUNTS.aws is ${SERVICE_COUNTS.aws}. ` +
    `Chips may combine services, so they can be fewer — never more.`
  );
}

/**
 * Display order for the grouped grids. Roughly: where data lives → what runs it →
 * how it connects → who may touch it → how you watch it → what you build with it.
 */
export const CATEGORY_ORDER: ServiceCategory[] = [
  'storage', 'database', 'compute', 'containers', 'networking', 'messaging',
  'identity', 'security', 'observability', 'analytics', 'ai', 'devtools', 'billing',
];

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  storage: 'Storage',
  database: 'Databases',
  compute: 'Compute',
  containers: 'Containers',
  networking: 'Networking & APIs',
  messaging: 'Messaging & Events',
  identity: 'Identity',
  security: 'Security & Secrets',
  observability: 'Observability',
  analytics: 'Analytics',
  ai: 'AI & ML',
  devtools: 'Developer Tools',
  billing: 'Cost & Billing',
};

export interface ServiceGroup {
  category: ServiceCategory;
  label: string;
  services: CloudService[];
}

/** Flatten a cloud's services into CATEGORY_ORDER so like icons sit adjacent. */
export function orderByCategory(list: CloudService[]): CloudService[] {
  return groupByCategory(list).flatMap((g) => g.services);
}

/** Group a cloud's services into CATEGORY_ORDER, dropping empty categories. */
export function groupByCategory(list: CloudService[]): ServiceGroup[] {
  return CATEGORY_ORDER
    .map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      services: list.filter((s) => s.category === category),
    }))
    .filter((g) => g.services.length > 0);
}

// A category missing from CATEGORY_ORDER would silently drop its services from
// the grid, so fail the build instead.
for (const [label, list] of [
  ['AWS_SERVICES', AWS_SERVICES],
  ['AZURE_SERVICES', AZURE_SERVICES],
  ['GCP_SERVICES', GCP_SERVICES],
] as const) {
  const grouped = groupByCategory(list).reduce((n, g) => n + g.services.length, 0);
  if (grouped !== list.length) {
    const orphans = list.filter((s) => !CATEGORY_ORDER.includes(s.category)).map((s) => s.name);
    throw new Error(
      `${label}: ${list.length - grouped} service(s) have a category missing from ` +
      `CATEGORY_ORDER and would vanish from the grid: ${orphans.join(', ')}`
    );
  }
}

/**
 * Per-service metadata for the AWS / Azure / GCP / OCI service grids.
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
 * AWS_SERVICES.length is below SERVICE_COUNTS.aws. Azure, GCP and OCI are 1:1
 * and asserted against SERVICE_COUNTS at build time.
 *
 * `since` is the first release tag of the emulator repo that shipped the
 * service, or 'main' while it is only on origin/main. Derive it from the repo,
 * not the README: for each X.Y.Z tag in ascending order, the first tag whose
 * tree has a `services/<svc>/` package under src/main/java (plus CHANGELOG.md for features
 * that live inside another service's package, e.g. Lambda MicroVMs). A combined
 * chip ("Bedrock + Runtime") takes its earliest component. On each release,
 * flip that release's 'main' entries to the new version.
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
  /** 'default' — launches a real Docker container out of the box. Omitted otherwise, including services that only use Docker when opted in. */
  docker?: 'default';
  /** First emulator release that shipped it ("2.3.0"), or 'main' if not released yet. */
  since: string;
}

export const AWS_SERVICES: CloudService[] = [
  { name: 'S3', proto: 'REST XML', category: 'storage', url: 'https://aws.amazon.com/s3/', since: '1.0.0' },
  { name: 'SQS', proto: 'Query / JSON', category: 'messaging', url: 'https://aws.amazon.com/sqs/', since: '1.0.0' },
  { name: 'SNS', proto: 'Query / JSON', category: 'messaging', url: 'https://aws.amazon.com/sns/', since: '1.0.0' },
  { name: 'DynamoDB + Streams', proto: 'JSON 1.1', category: 'database', url: 'https://aws.amazon.com/dynamodb/', since: '1.0.0' },
  { name: 'Lambda', proto: 'REST JSON', category: 'compute', docker: 'default', url: 'https://aws.amazon.com/lambda/', since: '1.0.0' },
  { name: 'Lambda MicroVMs', proto: 'REST JSON', category: 'compute', url: 'https://docs.aws.amazon.com/lambda/latest/dg/microvms.html', since: '1.7.0' },
  { name: 'Lambda Web Functions', proto: 'REST JSON', category: 'compute', url: 'https://docs.aws.amazon.com/lambda/latest/dg/web-functions.html', since: '2.4.0' },
  { name: 'API Gateway REST', proto: 'REST JSON', category: 'networking', url: 'https://aws.amazon.com/api-gateway/', since: '1.0.0' },
  { name: 'API Gateway v2', proto: 'HTTP + WebSocket', category: 'networking', url: 'https://aws.amazon.com/api-gateway/', since: '1.0.0' },
  { name: 'IAM', proto: 'Query (68+ ops)', category: 'identity', url: 'https://aws.amazon.com/iam/', since: '1.0.0' },
  { name: 'STS', proto: 'Query (7 ops)', category: 'identity', url: 'https://docs.aws.amazon.com/STS/latest/APIReference/', since: '1.0.0' },
  { name: 'Cognito', proto: 'JSON 1.1', category: 'identity', url: 'https://aws.amazon.com/cognito/', since: '1.0.0' },
  { name: 'KMS', proto: 'JSON 1.1', category: 'security', url: 'https://aws.amazon.com/kms/', since: '1.0.0' },
  { name: 'Kinesis', proto: 'JSON 1.1', category: 'messaging', url: 'https://aws.amazon.com/kinesis/data-streams/', since: '1.0.0' },
  { name: 'Secrets Manager', proto: 'JSON 1.1', category: 'security', url: 'https://aws.amazon.com/secrets-manager/', since: '1.0.0' },
  { name: 'SSM Parameter Store', proto: 'JSON 1.1', category: 'devtools', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html', since: '1.0.0' },
  { name: 'CloudFormation', proto: 'Query', category: 'devtools', url: 'https://aws.amazon.com/cloudformation/', since: '1.0.0' },
  { name: 'Step Functions', proto: 'JSON 1.1', category: 'devtools', url: 'https://aws.amazon.com/step-functions/', since: '1.0.0' },
  { name: 'ElastiCache', proto: 'Redis + IAM', category: 'database', docker: 'default', url: 'https://aws.amazon.com/elasticache/', since: '1.0.0' },
  { name: 'RDS', proto: 'PG + MySQL + IAM', category: 'database', docker: 'default', url: 'https://aws.amazon.com/rds/', since: '1.0.0' },
  { name: 'EventBridge + Scheduler + Pipes', proto: 'JSON 1.1', category: 'messaging', url: 'https://aws.amazon.com/eventbridge/', since: '1.0.0' },
  { name: 'CloudWatch Logs', proto: 'JSON 1.1', category: 'observability', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html', since: '1.0.0' },
  { name: 'CloudWatch Metrics', proto: 'Query', category: 'observability', url: 'https://aws.amazon.com/cloudwatch/', since: '1.0.0' },
  { name: 'CloudWatch RUM', proto: 'REST JSON', category: 'observability', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html', since: '1.6.0' },
  { name: 'MSK (Kafka)', proto: 'REST JSON', category: 'messaging', docker: 'default', url: 'https://aws.amazon.com/msk/', since: '1.5.4' },
  { name: 'ECS', proto: 'JSON 1.1', category: 'containers', docker: 'default', url: 'https://aws.amazon.com/ecs/', since: '1.3.0' },
  { name: 'EC2', proto: 'Query', category: 'compute', docker: 'default', url: 'https://aws.amazon.com/ec2/', since: '1.3.0' },
  { name: 'Lightsail', proto: 'JSON 1.1', category: 'compute', url: 'https://aws.amazon.com/lightsail/', since: '1.5.32' },
  { name: 'ACM', proto: 'JSON 1.1', category: 'security', url: 'https://aws.amazon.com/certificate-manager/', since: '1.1.0' },
  { name: 'ECR', proto: 'JSON 1.1', category: 'containers', docker: 'default', url: 'https://aws.amazon.com/ecr/', since: '1.5.3' },
  { name: 'SES + SES v2', proto: 'Query / JSON', category: 'messaging', url: 'https://aws.amazon.com/ses/', since: '1.1.0' },
  { name: 'OpenSearch', proto: 'REST JSON', category: 'analytics', docker: 'default', url: 'https://aws.amazon.com/opensearch-service/', since: '1.1.0' },
  { name: 'AppConfig + Data', proto: 'REST JSON', category: 'devtools', url: 'https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html', since: '1.5.3' },
  { name: 'Athena', proto: 'REST JSON', category: 'analytics', docker: 'default', url: 'https://aws.amazon.com/athena/', since: '1.5.4' },
  { name: 'Glue', proto: 'REST JSON', category: 'analytics', url: 'https://aws.amazon.com/glue/', since: '1.5.4' },
  { name: 'Data Firehose', proto: 'REST JSON', category: 'analytics', url: 'https://aws.amazon.com/firehose/', since: '1.5.4' },
  { name: 'Bedrock + Runtime', proto: 'REST JSON', category: 'ai', url: 'https://aws.amazon.com/bedrock/', since: '1.5.4' },
  { name: 'EKS', proto: 'REST JSON', category: 'containers', docker: 'default', url: 'https://aws.amazon.com/eks/', since: '1.5.5' },
  { name: 'ELB v2', proto: 'REST JSON', category: 'networking', url: 'https://aws.amazon.com/elasticloadbalancing/', since: '1.5.9' },
  { name: 'CodeBuild', proto: 'REST JSON', category: 'devtools', docker: 'default', url: 'https://aws.amazon.com/codebuild/', since: '1.5.9' },
  { name: 'CodeDeploy', proto: 'REST JSON', category: 'devtools', url: 'https://aws.amazon.com/codedeploy/', since: '1.5.9' },
  { name: 'Auto Scaling', proto: 'Query', category: 'compute', url: 'https://aws.amazon.com/autoscaling/', since: '1.5.12' },
  { name: 'AWS Backup', proto: 'REST JSON', category: 'storage', url: 'https://aws.amazon.com/backup/', since: '1.5.13' },
  { name: 'Route 53', proto: 'REST XML', category: 'networking', url: 'https://aws.amazon.com/route53/', since: '1.5.13' },
  { name: 'Textract', proto: 'REST JSON', category: 'ai', url: 'https://aws.amazon.com/textract/', since: '1.5.14' },
  { name: 'Transfer Family', proto: 'REST JSON', category: 'storage', url: 'https://aws.amazon.com/aws-transfer-family/', since: '1.5.13' },
  { name: 'Transcribe', proto: 'REST JSON', category: 'ai', url: 'https://aws.amazon.com/transcribe/', since: '1.5.16' },
  { name: 'Neptune', proto: 'REST JSON', category: 'database', docker: 'default', url: 'https://aws.amazon.com/neptune/', since: '1.5.17' },
  { name: 'Cost Explorer', proto: 'JSON 1.1', category: 'billing', url: 'https://aws.amazon.com/aws-cost-management/aws-cost-explorer/', since: '1.5.16' },
  { name: 'Pricing', proto: 'REST JSON', category: 'billing', url: 'https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/Welcome.html', since: '1.5.15' },
  { name: 'CUR + BCM Data Exports', proto: 'REST JSON', category: 'billing', docker: 'default', url: 'https://aws.amazon.com/aws-cost-management/aws-cost-and-usage-reporting/', since: '1.5.17' },
  { name: 'CloudFront', proto: 'REST XML', category: 'networking', url: 'https://aws.amazon.com/cloudfront/', since: '1.5.18' },
  { name: 'AppSync', proto: 'REST JSON', category: 'networking', url: 'https://aws.amazon.com/appsync/', since: '1.5.22' },
  { name: 'Cloud Map', proto: 'JSON 1.1', category: 'networking', url: 'https://aws.amazon.com/cloud-map/', since: '1.5.24' },
  { name: 'AWS Config', proto: 'JSON 1.1', category: 'observability', url: 'https://aws.amazon.com/config/', since: '1.5.18' },
  { name: 'Resource Groups Tagging', proto: 'JSON 1.1', category: 'devtools', url: 'https://docs.aws.amazon.com/resourcegroupstagging/latest/APIReference/', since: '1.5.4' },
  { name: 'RDS Data API', proto: 'REST JSON', category: 'database', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html', since: '1.5.25' },
  { name: 'AWS Batch', proto: 'REST JSON', category: 'compute', docker: 'default', url: 'https://aws.amazon.com/batch/', since: '1.5.25' },
  { name: 'EMR', proto: 'JSON 1.1', category: 'analytics', url: 'https://aws.amazon.com/emr/', since: '1.5.25' },
  { name: 'DocumentDB', proto: 'Query', category: 'database', docker: 'default', url: 'https://aws.amazon.com/documentdb/', since: '1.5.26' },
  { name: 'CloudTrail', proto: 'JSON 1.1', category: 'observability', url: 'https://aws.amazon.com/cloudtrail/', since: '1.5.24' },
  { name: 'WAF v2', proto: 'JSON 1.1', category: 'security', url: 'https://aws.amazon.com/waf/', since: '1.5.25' },
  { name: 'CodePipeline', proto: 'JSON 1.1', category: 'devtools', url: 'https://aws.amazon.com/codepipeline/', since: '1.5.27' },
  { name: 'Elastic Beanstalk', proto: 'Query', category: 'compute', url: 'https://aws.amazon.com/elasticbeanstalk/', since: '1.5.28' },
  { name: 'IoT Core', proto: 'REST JSON', category: 'messaging', url: 'https://aws.amazon.com/iot-core/', since: '1.5.28' },
  { name: 'MemoryDB', proto: 'JSON 1.1', category: 'database', docker: 'default', url: 'https://aws.amazon.com/memorydb/', since: '1.5.27' },
  { name: 'S3 Vectors', proto: 'REST JSON', category: 'storage', url: 'https://aws.amazon.com/s3/features/vectors/', since: '1.5.27' },
  { name: 'Amazon MQ', proto: 'REST JSON', category: 'messaging', docker: 'default', url: 'https://aws.amazon.com/amazon-mq/', since: '1.5.30' },
  { name: 'Cloud Control API', proto: 'JSON 1.0', category: 'devtools', url: 'https://aws.amazon.com/cloudcontrolapi/', since: '1.5.31' },
  { name: 'MWAA (Airflow)', proto: 'REST JSON', category: 'analytics', docker: 'default', url: 'https://aws.amazon.com/managed-workflows-for-apache-airflow/', since: '1.6.0' },
  { name: 'GuardDuty', proto: 'REST JSON', category: 'security', url: 'https://aws.amazon.com/guardduty/', since: '1.7.0' },
  { name: 'CloudHSM', proto: 'JSON 1.1', category: 'security', url: 'https://aws.amazon.com/cloudhsm/', since: '1.7.0' },
  { name: 'S3 Tables', proto: 'REST JSON', category: 'storage', url: 'https://aws.amazon.com/s3/features/tables/', since: '1.7.0' },
  { name: 'SWF', proto: 'JSON 1.0', category: 'devtools', url: 'https://aws.amazon.com/swf/', since: '1.7.0' },
  { name: 'Managed Flink', proto: 'JSON 1.1', category: 'analytics', docker: 'default', url: 'https://aws.amazon.com/managed-service-apache-flink/', since: '1.7.0' },
  { name: 'Application Auto Scaling', proto: 'JSON 1.1', category: 'compute', url: 'https://docs.aws.amazon.com/autoscaling/application/userguide/what-is-application-auto-scaling.html', since: '1.7.0' },
  { name: 'Bedrock AgentCore', proto: 'REST JSON', category: 'ai', url: 'https://aws.amazon.com/bedrock/agentcore/', since: '1.7.0' },
  { name: 'EFS', proto: 'REST JSON', category: 'storage', url: 'https://docs.aws.amazon.com/efs/', since: '2.0.0' },
  { name: 'Redshift', proto: 'Query + Postgres', category: 'analytics', docker: 'default', url: 'https://docs.aws.amazon.com/redshift/', since: '2.0.0' },
  { name: 'EMR Serverless', proto: 'REST JSON', category: 'analytics', url: 'https://docs.aws.amazon.com/emr/latest/EMR-Serverless-UserGuide/', since: '2.0.0' },
  { name: 'EMR on EKS', proto: 'REST JSON', category: 'analytics', url: 'https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/', since: 'main' },
  { name: 'Lake Formation', proto: 'REST JSON', category: 'analytics', url: 'https://docs.aws.amazon.com/lake-formation/', since: '2.0.0' },
  { name: 'ELB Classic', proto: 'Query', category: 'networking', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/', since: '2.0.0' },
  { name: 'Route 53 Resolver', proto: 'JSON 1.1', category: 'networking', url: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html', since: '2.0.0' },
  { name: 'Network Firewall', proto: 'JSON 1.0 / 1.1', category: 'security', url: 'https://docs.aws.amazon.com/network-firewall/', since: '2.0.0' },
  { name: 'Amazon Connect', proto: 'REST JSON', category: 'messaging', url: 'https://docs.aws.amazon.com/connect/', since: '2.0.0' },
  { name: 'Organizations', proto: 'JSON 1.1', category: 'identity', url: 'https://docs.aws.amazon.com/organizations/', since: '2.0.0' },
  { name: 'IAM Identity Center', proto: 'JSON 1.1', category: 'identity', url: 'https://docs.aws.amazon.com/singlesignon/', since: '2.0.0' },
  { name: 'Resource Access Manager', proto: 'REST JSON', category: 'identity', url: 'https://docs.aws.amazon.com/ram/', since: '2.0.0' },
  { name: 'Managed Prometheus', proto: 'REST JSON', category: 'observability', url: 'https://docs.aws.amazon.com/prometheus/', since: '2.0.0' },
  { name: 'Comprehend', proto: 'JSON 1.1', category: 'ai', url: 'https://docs.aws.amazon.com/comprehend/', since: '2.0.0' },
  { name: 'Rekognition', proto: 'JSON 1.1', category: 'ai', url: 'https://docs.aws.amazon.com/rekognition/', since: '2.0.0' },
  { name: 'Control Tower', proto: 'REST JSON', category: 'devtools', url: 'https://docs.aws.amazon.com/controltower/', since: '2.0.0' },
  { name: 'Service Catalog', proto: 'JSON 1.1', category: 'devtools', url: 'https://docs.aws.amazon.com/servicecatalog/', since: '2.0.0' },
  { name: 'Service Quotas', proto: 'JSON 1.1', category: 'devtools', url: 'https://docs.aws.amazon.com/servicequotas/', since: '2.0.0' },
  { name: 'Resource Explorer', proto: 'REST JSON', category: 'devtools', url: 'https://docs.aws.amazon.com/resource-explorer/latest/userguide/welcome.html', since: '2.0.0' },
  { name: 'Fault Injection Service', proto: 'REST JSON', category: 'devtools', url: 'https://docs.aws.amazon.com/fis/', since: '2.0.0' },
  { name: 'CodeGuru Reviewer', proto: 'REST JSON', category: 'devtools', url: 'https://docs.aws.amazon.com/codeguru/latest/reviewer-ug/', since: '2.0.0' },
  { name: 'IAM Access Analyzer', proto: 'REST JSON', category: 'identity', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html', since: '2.1.0' },
  { name: 'AWS Account', proto: 'REST JSON', category: 'identity', url: 'https://docs.aws.amazon.com/accounts/latest/reference/', since: '2.1.0' },
  { name: 'AppIntegrations', proto: 'REST JSON', category: 'messaging', url: 'https://docs.aws.amazon.com/appintegrations/latest/APIReference/', since: '2.1.0' },
  { name: 'Security Hub', proto: 'REST JSON', category: 'security', url: 'https://docs.aws.amazon.com/securityhub/', since: '2.1.0' },
  { name: 'Detective', proto: 'REST JSON', category: 'security', url: 'https://docs.aws.amazon.com/detective/', since: '2.1.0' },
  { name: 'Inspector', proto: 'REST JSON', category: 'security', url: 'https://docs.aws.amazon.com/inspector/', since: '2.1.0' },
  { name: 'Macie', proto: 'REST JSON', category: 'security', url: 'https://docs.aws.amazon.com/macie/', since: '2.1.0' },
  { name: 'Verified Permissions', proto: 'JSON 1.0', category: 'security', url: 'https://docs.aws.amazon.com/verifiedpermissions/', since: '2.1.0' },
  { name: 'Control Catalog', proto: 'REST JSON', category: 'devtools', url: 'https://docs.aws.amazon.com/controlcatalog/latest/APIReference/', since: '2.1.0' },
  { name: 'DataSync', proto: 'JSON 1.1', category: 'storage', url: 'https://docs.aws.amazon.com/datasync/', since: '2.1.0' },
  { name: 'Global Accelerator', proto: 'JSON 1.1', category: 'networking', url: 'https://docs.aws.amazon.com/global-accelerator/', since: '2.1.0' },
  { name: 'CloudWatch OAM', proto: 'REST JSON', category: 'observability', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html', since: '2.1.0' },
  { name: 'Redshift Data API', proto: 'JSON 1.1', category: 'analytics', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/data-api.html', since: '2.1.0' },
  { name: 'Translate', proto: 'JSON 1.1', category: 'ai', url: 'https://docs.aws.amazon.com/translate/', since: '2.1.0' },
  { name: 'AWS Budgets', proto: 'JSON 1.1', category: 'billing', url: 'https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html', since: '2.1.0' },
  { name: 'BCM Pricing Calculator', proto: 'JSON 1.1', category: 'billing', url: 'https://docs.aws.amazon.com/pricing-calculator/latest/userguide/what-is-pricing-calculator.html', since: '2.1.0' },
  { name: 'AWS Marketplace', proto: 'REST JSON + CBOR', category: 'billing', url: 'https://docs.aws.amazon.com/marketplace/', since: '2.1.0' },
  { name: 'Data Lifecycle Manager', proto: 'REST JSON', category: 'storage', url: 'https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-lifecycle.html', since: '2.2.0' },
  { name: 'Timestream for InfluxDB', proto: 'JSON 1.0 + InfluxDB', category: 'database', docker: 'default', url: 'https://docs.aws.amazon.com/timestream/latest/developerguide/timestream-for-influxdb.html', since: '2.2.0' },
  { name: 'DMS', proto: 'JSON 1.1', category: 'database', url: 'https://aws.amazon.com/dms/', since: '2.2.0' },
  { name: 'Redshift Serverless', proto: 'JSON 1.1', category: 'analytics', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-serverless.html', since: '2.2.0' },
  { name: 'CodeArtifact', proto: 'REST JSON', category: 'devtools', docker: 'default', url: 'https://aws.amazon.com/codeartifact/', since: '2.2.0' },
  { name: 'SageMaker', proto: 'JSON 1.1', category: 'ai', docker: 'default', url: 'https://aws.amazon.com/sagemaker/', since: '2.2.0' },
  { name: 'Aurora DSQL', proto: 'REST JSON + PostgreSQL wire', category: 'database', docker: 'default', url: 'https://aws.amazon.com/rds/aurora/dsql/', since: '2.4.0' },
  { name: 'AWS Resource Groups', proto: 'REST JSON', category: 'devtools', url: 'https://docs.aws.amazon.com/ARG/latest/userguide/resource-groups.html', since: '2.4.0' },
  { name: 'AWS Signer', proto: 'REST JSON', category: 'security', url: 'https://docs.aws.amazon.com/signer/', since: '2.5.0' },
  { name: 'EC2 Instance Connect', proto: 'JSON 1.1', category: 'compute', url: 'https://docs.aws.amazon.com/ec2/latest/devguide/ec2-instance-connect-methods.html', since: '2.5.0' },
  { name: 'Payment Cryptography + Data', proto: 'JSON 1.0 / REST JSON', category: 'security', url: 'https://docs.aws.amazon.com/payment-cryptography/', since: '2.5.0' },
  { name: 'QuickSight', proto: 'REST JSON', category: 'analytics', url: 'https://docs.aws.amazon.com/quicksight/', since: '2.5.0' },
  { name: 'X-Ray', proto: 'REST JSON', category: 'observability', url: 'https://docs.aws.amazon.com/xray/', since: '2.5.0' },
];

export const AZURE_SERVICES: CloudService[] = [
  { name: 'Blob Storage', proto: 'REST XML / JSON', category: 'storage', url: 'https://learn.microsoft.com/en-us/azure/storage/blobs/', since: '0.0.1' },
  { name: 'Queue Storage', proto: 'REST JSON', category: 'messaging', url: 'https://learn.microsoft.com/en-us/azure/storage/queues/', since: '0.0.1' },
  { name: 'Table Storage', proto: 'OData / REST JSON', category: 'database', url: 'https://learn.microsoft.com/en-us/azure/storage/tables/', since: '0.0.1' },
  { name: 'Azure Functions', proto: 'HTTP / Timer Triggers', category: 'compute', docker: 'default', url: 'https://learn.microsoft.com/en-us/azure/azure-functions/', since: '0.0.1' },
  { name: 'App Configuration', proto: 'REST JSON · Labels', category: 'devtools', url: 'https://learn.microsoft.com/en-us/azure/azure-app-configuration/', since: '0.2.0' },
  { name: 'Key Vault', proto: 'REST · Secrets / Keys / Certs', category: 'security', url: 'https://learn.microsoft.com/en-us/azure/key-vault/', since: '0.3.0' },
  { name: 'Event Hubs', proto: 'AMQP / Kafka / REST', category: 'messaging', docker: 'default', url: 'https://learn.microsoft.com/en-us/azure/event-hubs/', since: '0.3.0' },
  { name: 'Service Bus', proto: 'AMQP · Topics / Queues', category: 'messaging', docker: 'default', url: 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/', since: '0.3.0' },
  { name: 'Cosmos DB', proto: 'SQL native · Mongo / Cassandra / Gremlin', category: 'database', docker: 'default', url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/', since: '0.3.0' },
  { name: 'AKS', proto: 'REST JSON · k3s', category: 'containers', url: 'https://learn.microsoft.com/en-us/azure/aks/', since: '0.3.0' },
  { name: 'Azure SQL', proto: 'ARM · SQL Server', category: 'database', docker: 'default', url: 'https://learn.microsoft.com/en-us/azure/azure-sql/', since: '0.3.0' },
  { name: 'API Management', proto: 'ARM · REST JSON', category: 'networking', url: 'https://learn.microsoft.com/en-us/azure/api-management/', since: '0.6.0' },
  { name: 'Virtual Machines', proto: 'ARM · REST JSON', category: 'compute', url: 'https://learn.microsoft.com/en-us/azure/virtual-machines/', since: '0.6.0' },
  { name: 'Cache for Redis', proto: 'ARM · Redis', category: 'database', url: 'https://learn.microsoft.com/en-us/azure/azure-cache-for-redis/', since: '0.6.0' },
  { name: 'Container Registry', proto: 'ARM · registry:2', category: 'containers', url: 'https://learn.microsoft.com/en-us/azure/container-registry/', since: '0.6.0' },
  { name: 'Virtual Network', proto: 'ARM · REST JSON', category: 'networking', url: 'https://learn.microsoft.com/en-us/azure/virtual-network/', since: '0.7.0' },
  { name: 'Azure Monitor', proto: 'Logs · Metrics · KQL', category: 'observability', url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/', since: '0.7.0' },
  { name: 'Microsoft Entra ID', proto: 'OAuth2 · OIDC · JWKS', category: 'identity', url: 'https://learn.microsoft.com/en-us/entra/identity/', since: '0.7.0' },
  { name: 'Email Communication', proto: 'REST JSON · ARM', category: 'messaging', url: 'https://learn.microsoft.com/en-us/azure/communication-services/concepts/email/email-overview', since: '0.7.0' },
  { name: 'Event Grid', proto: 'REST JSON · CloudEvents', category: 'messaging', url: 'https://learn.microsoft.com/en-us/azure/event-grid/', since: '0.8.0' },
  { name: 'PostgreSQL Flexible Server', proto: 'ARM · PostgreSQL', category: 'database', docker: 'default', url: 'https://learn.microsoft.com/en-us/azure/postgresql/', since: '0.9.0' },
  { name: 'MySQL Flexible Server', proto: 'ARM · MySQL', category: 'database', docker: 'default', url: 'https://learn.microsoft.com/en-us/azure/mysql/', since: '0.10.0' },
  { name: 'MariaDB Server', proto: 'ARM · MariaDB', category: 'database', docker: 'default', url: 'https://learn.microsoft.com/en-us/azure/mariadb/', since: '0.10.0' },
  { name: 'Managed Identity', proto: 'IMDS · OAuth2 tokens', category: 'identity', url: 'https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/', since: '0.9.0' },
  { name: 'Container Instances', proto: 'ARM · REST JSON', category: 'containers', url: 'https://learn.microsoft.com/en-us/azure/container-instances/', since: '0.12.0' },
  { name: 'Microsoft Graph', proto: 'REST JSON · /v1.0', category: 'identity', url: 'https://learn.microsoft.com/en-us/graph/overview', since: '0.11.0' },
  { name: 'Container Apps', proto: 'ARM · ingress proxy', category: 'containers', url: 'https://learn.microsoft.com/en-us/azure/container-apps/', since: '0.13.0' },
  { name: 'SignalR', proto: 'WebSocket · negotiate', category: 'messaging', url: 'https://learn.microsoft.com/en-us/azure/azure-signalr/', since: '0.13.0' },
  { name: 'Azure Policy', proto: 'ARM · REST JSON', category: 'security', url: 'https://learn.microsoft.com/en-us/azure/governance/policy/', since: '0.15.0' },
  { name: 'Azure RBAC', proto: 'ARM · REST JSON', category: 'identity', url: 'https://learn.microsoft.com/en-us/azure/role-based-access-control/', since: '0.17.0' },
  { name: 'ARM Deployments', proto: 'ARM · Templates', category: 'devtools', url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/', since: '0.16.0' },
  { name: 'Resource Graph', proto: 'ARM · KQL', category: 'devtools', url: 'https://learn.microsoft.com/en-us/azure/governance/resource-graph/', since: '0.16.0' },
  { name: 'Management Groups', proto: 'ARM · REST JSON', category: 'identity', url: 'https://learn.microsoft.com/en-us/azure/governance/management-groups/', since: '0.16.0' },
  { name: 'IoT Hub', proto: 'ARM · access policies', category: 'messaging', url: 'https://learn.microsoft.com/en-us/azure/iot-hub/', since: 'main' },
  { name: 'AI Search', proto: 'ARM · REST JSON · indexes', category: 'analytics', url: 'https://learn.microsoft.com/en-us/azure/search/', since: 'main' },
];

export const GCP_SERVICES: CloudService[] = [
  { name: 'Cloud Storage', proto: 'REST JSON / XML', category: 'storage', url: 'https://cloud.google.com/storage/docs', since: '0.1.0' },
  { name: 'Pub/Sub', proto: 'gRPC', category: 'messaging', url: 'https://cloud.google.com/pubsub/docs', since: '0.1.0' },
  { name: 'Firestore', proto: 'gRPC', category: 'database', url: 'https://cloud.google.com/firestore/docs', since: '0.1.0' },
  { name: 'Datastore', proto: 'HTTP/protobuf', category: 'database', url: 'https://cloud.google.com/datastore/docs', since: '0.1.0' },
  { name: 'Secret Manager', proto: 'gRPC', category: 'security', url: 'https://cloud.google.com/secret-manager/docs', since: '0.1.0' },
  { name: 'IAM', proto: 'REST JSON', category: 'identity', url: 'https://cloud.google.com/iam/docs', since: '0.1.0' },
  { name: 'IAM Credentials', proto: 'REST JSON', category: 'identity', url: 'https://cloud.google.com/iam/docs/reference/credentials/rest', since: '0.6.0' },
  { name: 'OAuth 2.0 Token', proto: 'REST · JWT bearer', category: 'identity', url: 'https://developers.google.com/identity/protocols/oauth2/service-account', since: '0.6.0' },
  { name: 'STS', proto: 'REST · token exchange', category: 'identity', url: 'https://cloud.google.com/iam/docs/reference/sts/rest', since: '0.7.0' },
  { name: 'Managed Kafka', proto: 'REST JSON · Redpanda', category: 'messaging', docker: 'default', url: 'https://cloud.google.com/managed-service-for-apache-kafka/docs', since: '0.1.0' },
  { name: 'Cloud Tasks', proto: 'gRPC · v2', category: 'messaging', url: 'https://cloud.google.com/tasks/docs', since: '0.2.0' },
  { name: 'Cloud Run', proto: 'REST JSON', category: 'compute', docker: 'default', url: 'https://cloud.google.com/run/docs', since: '0.3.0' },
  { name: 'Cloud SQL', proto: 'REST JSON · Postgres / MySQL', category: 'database', docker: 'default', url: 'https://cloud.google.com/sql/docs', since: '0.3.0' },
  { name: 'Cloud Functions', proto: 'REST JSON', category: 'compute', url: 'https://cloud.google.com/functions/docs', since: '0.3.0' },
  { name: 'Cloud KMS', proto: 'gRPC · REST JSON', category: 'security', url: 'https://cloud.google.com/kms/docs', since: '0.3.0' },
  { name: 'Cloud Logging', proto: 'gRPC · REST JSON', category: 'observability', url: 'https://cloud.google.com/logging/docs', since: '0.3.0' },
  { name: 'Cloud Monitoring', proto: 'gRPC · REST JSON', category: 'observability', url: 'https://cloud.google.com/monitoring/docs', since: '0.3.0' },
  { name: 'Cloud Scheduler', proto: 'gRPC · REST JSON', category: 'messaging', url: 'https://cloud.google.com/scheduler/docs', since: '0.3.0' },
  { name: 'GKE', proto: 'REST JSON · k3s', category: 'containers', docker: 'default', url: 'https://cloud.google.com/kubernetes-engine/docs', since: '0.4.0' },
  { name: 'BigQuery', proto: 'REST JSON', category: 'analytics', url: 'https://cloud.google.com/bigquery/docs', since: '0.5.0' },
  { name: 'Eventarc', proto: 'gRPC · REST JSON', category: 'messaging', url: 'https://cloud.google.com/eventarc/docs', since: '0.5.0' },
  { name: 'Firebase Auth', proto: 'REST JSON', category: 'identity', url: 'https://firebase.google.com/docs/auth', since: '0.5.0' },
  { name: 'Resource Manager', proto: 'REST JSON', category: 'devtools', url: 'https://cloud.google.com/resource-manager/docs', since: '0.5.0' },
  { name: 'Service Usage', proto: 'REST JSON · LRO', category: 'devtools', url: 'https://cloud.google.com/service-usage/docs', since: '0.5.0' },
  { name: 'Operations', proto: 'gRPC · REST JSON · LRO', category: 'devtools', url: 'https://google.aip.dev/151', since: '0.3.0' },
  { name: 'Locations', proto: 'gRPC · REST JSON', category: 'devtools', url: 'https://cloud.google.com/docs/geography-and-regions', since: '0.11.0' },
  { name: 'Compute Engine', proto: 'REST JSON · LRO', category: 'compute', url: 'https://cloud.google.com/compute/docs', since: '0.10.0' },
  { name: 'Cloud Billing', proto: 'REST JSON', category: 'billing', url: 'https://cloud.google.com/billing/docs', since: '0.12.0' },
  { name: 'Billing Budgets', proto: 'REST JSON', category: 'billing', url: 'https://cloud.google.com/billing/docs/how-to/budgets', since: 'main' },
];

export const OCI_SERVICES: CloudService[] = [
  { name: 'Object Storage', proto: 'REST JSON · multipart / PAR', category: 'storage', url: 'https://docs.oracle.com/en-us/iaas/Content/Object/home.htm', since: '0.1.0' },
  { name: 'Identity (IAM)', proto: 'REST JSON · work requests', category: 'identity', url: 'https://docs.oracle.com/en-us/iaas/Content/Identity/home.htm', since: '0.1.0' },
  { name: 'Queue', proto: 'REST JSON · DLQ / channels', category: 'messaging', url: 'https://docs.oracle.com/en-us/iaas/Content/queue/home.htm', since: '0.1.0' },
  { name: 'Streaming', proto: 'REST JSON · cursors / groups', category: 'messaging', url: 'https://docs.oracle.com/en-us/iaas/Content/Streaming/home.htm', since: '0.1.0' },
  { name: 'KMS', proto: 'REST JSON · real AES / RSA / ECDSA', category: 'security', url: 'https://docs.oracle.com/en-us/iaas/Content/KeyManagement/home.htm', since: '0.1.0' },
  { name: 'Vault Secrets', proto: 'REST JSON · secret bundles', category: 'security', url: 'https://docs.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingsecrets.htm', since: '0.1.0' },
  { name: 'Functions', proto: 'REST JSON · Fn Project', category: 'compute', docker: 'default', url: 'https://docs.oracle.com/en-us/iaas/Content/Functions/home.htm', since: '0.1.0' },
  { name: 'OKE', proto: 'REST JSON · k3s', category: 'containers', docker: 'default', url: 'https://docs.oracle.com/en-us/iaas/Content/ContEng/home.htm', since: '0.3.0' },
  { name: 'Organizations', proto: 'REST JSON', category: 'identity', url: 'https://docs.oracle.com/en-us/iaas/Content/General/organization/home.htm', since: '0.6.0' },
  { name: 'Governance Rules', proto: 'REST JSON', category: 'security', url: 'https://docs.oracle.com/en-us/iaas/Content/General/organization/add-governance.htm', since: '0.6.0' },
  { name: 'PostgreSQL', proto: 'REST JSON + PostgreSQL wire', category: 'database', docker: 'default', url: 'https://docs.oracle.com/en-us/iaas/Content/postgresql/home.htm', since: '0.6.0' },
  { name: 'Events', proto: 'REST JSON · rules', category: 'messaging', url: 'https://docs.oracle.com/en-us/iaas/Content/Events/home.htm', since: 'main' },
  { name: 'Notifications', proto: 'REST JSON · topics / subscriptions', category: 'messaging', url: 'https://docs.oracle.com/en-us/iaas/Content/Notification/home.htm', since: 'main' },
  { name: 'Monitoring', proto: 'REST JSON · MQL / alarms', category: 'observability', url: 'https://docs.oracle.com/en-us/iaas/Content/Monitoring/home.htm', since: 'main' },
  { name: 'Logging', proto: 'REST JSON · ingestion / search', category: 'observability', url: 'https://docs.oracle.com/en-us/iaas/Content/Logging/home.htm', since: 'main' },
  { name: 'Networking (VCN)', proto: 'REST JSON · core network', category: 'networking', url: 'https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/overview.htm', since: 'main' },
  { name: 'Container Registry', proto: 'REST JSON · registry:2', category: 'containers', docker: 'default', url: 'https://docs.oracle.com/en-us/iaas/Content/Registry/home.htm', since: 'main' },
];

for (const [label, list, expected] of [
  ['AZURE_SERVICES', AZURE_SERVICES, SERVICE_COUNTS.azure],
  ['GCP_SERVICES', GCP_SERVICES, SERVICE_COUNTS.gcp],
  ['OCI_SERVICES', OCI_SERVICES, SERVICE_COUNTS.oci],
] as const) {
  if (list.length !== expected) {
    throw new Error(
      `${label} has ${list.length} entries but SERVICE_COUNTS says ${expected}. ` +
      `The grid enumerates services 1:1 — add or remove the service, don't just edit the count.`
    );
  }
}

for (const s of [...AWS_SERVICES, ...AZURE_SERVICES, ...GCP_SERVICES, ...OCI_SERVICES]) {
  if (s.since !== 'main' && !/^\d+\.\d+\.\d+$/.test(s.since)) {
    throw new Error(`Service "${s.name}" has since: '${s.since}'. Use a release tag like '2.3.0' or 'main'.`);
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
  ['OCI_SERVICES', OCI_SERVICES],
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

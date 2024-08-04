import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

export class MyCloudfrontEcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 2
    });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'MyCluster', {
      vpc: vpc
    });

    // ECS Task Definition
    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');

    const container = taskDefinition.addContainer('MyContainer', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 512,
    });

    container.addPortMappings({
      containerPort: 80,
      protocol: ecs.Protocol.TCP,
    });

    // ECS Service
    const ecsService = new ecs.Ec2Service(this, 'Service', {
      cluster,
      taskDefinition,
    });

    // Security Group for ECS Service
    const ecsSecurityGroup = new ec2.SecurityGroup(this, 'EcsSecurityGroup', {
      vpc,
      description: 'Allow HTTP and HTTPS from CloudFront only',
      allowAllOutbound: true
    });

    // Add rules to allow traffic only from CloudFront managed prefix list
    const cloudfrontPrefixListId = 'com.amazonaws.global.cloudfront.origin-facing'; // CloudFront origin-facing managed prefix list

    ecsSecurityGroup.addIngressRule(
      ec2.Peer.prefixList(cloudfrontPrefixListId),
      ec2.Port.tcp(80),
      'Allow HTTP traffic from CloudFront'
    );

    ecsSecurityGroup.addIngressRule(
      ec2.Peer.prefixList(cloudfrontPrefixListId),
      ec2.Port.tcp(443),
      'Allow HTTPS traffic from CloudFront'
    );

    ecsService.connections.addSecurityGroup(ecsSecurityGroup);

    // Hosted Zone
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', { domainName: 'your.domain.com' });

    // Certificate
    const certificate = new certificatemanager.DnsValidatedCertificate(this, 'Certificate', {
      domainName: 'your.domain.com',
      hostedZone: hostedZone,
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'MyDistribution', {
      defaultBehavior: {
        origin: new cloudfront_origins.HttpOrigin(`${ecsService.loadBalancer.loadBalancerDnsName}`, {
          customHeaders: {
            'X-Forwarded-Proto': 'https',
          },
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: ['beta.eastlondoncommunity.band'],
      certificate: certificate,
    });

    // Route53 Alias Record for CloudFront
    new route53.ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      recordName: 'your',
    });

    // Output the CloudFront domain name
    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: distribution.domainName,
    });
  }
}

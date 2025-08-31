import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as autoscaling from "aws-cdk-lib/aws-autoscaling";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as events from "aws-cdk-lib/aws-events";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const replicaUrl = "s3://johnbucket1a1a1a/db.sqlite3"; // Define your S3 bucket name here
    const s3BucketName = "johnbucket1a1a1a"; // Define your S3 bucket name here

    // VPC
    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 2,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: "PublicSubnet",
        },
      ],
    });

    // Security Group
    const securityGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
      vpc,
      description: "Allow ssh access to ec2 instances",
      allowAllOutbound: true,
    });
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3000),
      "allow dokploy access from the world"
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      "allow https access from the world"
    );
    securityGroup.addIngressRule(
      ec2.Peer.ipv4("3.8.37.24/29"),
      ec2.Port.tcp(22),
      "allow EC2 Instance Connect"
    );

    // IAM Role
    const role = new iam.Role(this, "InstanceRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonEC2ContainerRegistryReadOnly"
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonSSMManagedInstanceCore"
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName("EC2InstanceConnect"), // Add this managed policy
      ],
      inlinePolicies: {
        AssociateAddressPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ["ec2:AssociateAddress", "ses:SendEmail"],
              resources: ["*"], // You can specify the specific resource if needed
            }),
          ],
        }),

        S3AccessPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: [
                "s3:GetObject",
                "s3:PutObject",
                "s3:ListBucket",
                "s3:DeleteObject",
              ],
              resources: [
                `arn:aws:s3:::${s3BucketName}`,
                `arn:aws:s3:::${s3BucketName}/*`,
              ],
            }),
          ],
        }),
      },
    });

    // Allocate an Elastic IP and associate it with the instance
    const eip = new ec2.CfnEIP(this, "EIP");
  // User Data script to install Dokploy and associate Elastic IP
  const userDataScript = `#!/bin/bash
 apt-get update -y
 apt-get install -y unzip

  # Install AWS CLI v2 (ARM/aarch64)
  curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  sudo ./aws/install

   # Associate Elastic IP
  # Avoid proxies for the metadata IP
export NO_PROXY="169.254.169.254"
export no_proxy="169.254.169.254"

TOKEN="$(curl -fsSL -X PUT 'http://169.254.169.254/latest/api/token' \
  -H 'X-aws-ec2-metadata-token-ttl-seconds: 21600')"

INSTANCE_ID="$(curl -fsSL -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/instance-id)"

echo "INSTANCE_ID=$INSTANCE_ID"

aws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id ${eip.attrAllocationId} --region ${this.region}


  # Install Dokploy (official script)
  curl -sSL https://dokploy.com/install.sh  | sh

  # Dokploy is now installed. You can use dokploy CLI to manage deployments.
  # Example: dokploy login, dokploy deploy, etc.
  # See https://docs.dokploy.com/ for usage instructions.

   `;

    const ami = ec2.MachineImage.fromSsmParameter(
      "/aws/service/canonical/ubuntu/server/24.04/stable/current/arm64/hvm/ebs-gp3/ami-id",
      { os: ec2.OperatingSystemType.LINUX }
    );
    // const instance = new ec2.Instance(this, "Instance", {
    //   vpc,
    //   instanceType: new ec2.InstanceType("t4g.micro"),
    //   machineImage: ami,
    //   securityGroup,
    //   role,
    //   userData: ec2.UserData.custom(userDataScript),
    //   vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }, // Ensure the instance is in a public subnet
    // });

    // Auto Scaling Group
    const asg = new autoscaling.AutoScalingGroup(this, "ASG", {
      vpc,
  instanceType: new ec2.InstanceType("t4g.small"),
      machineImage: ami,
      securityGroup,
      role,
      userData: ec2.UserData.custom(userDataScript),
      minCapacity: 1,
      maxCapacity: 1,
  spotPrice: "0.025", // Set the maximum Spot price for t4g.small
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }, // Ensure the instances are in public subnets
    });

    new cdk.CfnOutput(this, "EIP_Output", {
      value: eip.attrPublicIp,
    });
  }
}

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
      ec2.Port.tcp(80),
      "allow http access from the world"
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
              actions: ["ec2:AssociateAddress"],
              resources: ["*"], // You can specify the specific resource if needed
            }),
          ],
        }),

        S3AccessPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ["s3:GetObject", "s3:PutObject", "s3:ListBucket"],
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
    // User Data script to install Docker and run the container
    const userDataScript = `#!/bin/bash
    sudo yum update -y
    sudo amazon-linux-extras install docker -y
    sudo service docker start
    sudo usermod -a -G docker ec2-user
    sudo $(aws ecr get-login --no-include-email --region ${this.region})
    aws ecr get-login-password --region eu-west-2  | docker login --username AWS --password-stdin 984617344736.dkr.ecr.eu-west-2.amazonaws.com
    docker pull 984617344736.dkr.ecr.eu-west-2.amazonaws.com/elcb:latest
    docker run -d -p 80:8000 \
      -e LITESTREAM_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
      -e LITESTREAM_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
      -e AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN \
      -e AWS_REGION=eu-west-2 \
      -e REPLICA_URL=${replicaUrl}\
      984617344736.dkr.ecr.eu-west-2.amazonaws.com/elcb:latest
    # Associate Elastic IP
    INSTANCE_ID=$(curl http://169.254.169.254/latest/meta-data/instance-id)
    aws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id ${eip.attrAllocationId} --region ${this.region}
    `;

    const ami = ec2.MachineImage.genericLinux({
      "eu-west-2": "ami-07eac86c1aa994cde", // Replace with the actual AMI ID
    });
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
      instanceType: new ec2.InstanceType("t4g.micro"),
      machineImage: ami,
      securityGroup,
      role,
      userData: ec2.UserData.custom(userDataScript),
      minCapacity: 1,
      maxCapacity: 1,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }, // Ensure the instances are in public subnets
    });

    new cdk.CfnOutput(this, "EIP_Output", {
      value: eip.attrPublicIp,
    });
  }
}

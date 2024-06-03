import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const destinationBucket = new s3.Bucket(this, "S3Bucket", {
      accessControl: s3.BucketAccessControl.PRIVATE,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "CloudFrontOriginAccessIdentity"
    );
    destinationBucket.grantRead(originAccessIdentity);

    const distribution = new cloudfront.Distribution(
      this,
      "cloudFrontDistribution",
      {
        defaultBehavior: {
          origin: new origins.S3Origin(destinationBucket, {
            originAccessIdentity,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.days(365),
          },
        ],
      }
    );

    new s3deploy.BucketDeployment(this, "S3BucketDeployment", {
      destinationBucket,
      distribution,
      distributionPaths: ["/*"],
      sources: [s3deploy.Source.asset("./public")],
    });

    new cdk.CfnOutput(this, "CloudFrontDistributionDomainName", {
      value: distribution.distributionDomainName,
    });
  }
}

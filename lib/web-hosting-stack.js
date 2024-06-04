// @ts-check

import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";

/**
 * Uses S3 static website hosting
 */
export class WebHostingStack extends cdk.Stack {
  /**
   * @param {import('constructs').Construct} scope
   * @param {string} id
   * @param {cdk.StackProps} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const destinationBucket = new s3.Bucket(this, "S3Bucket", {
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      publicReadAccess: true,
      websiteErrorDocument: "index.html", // still responds with http 404
      websiteIndexDocument: "index.html",
    });

    const distribution = new cloudfront.Distribution(this, "CfDistribution", {
      defaultBehavior: {
        origin: new origins.HttpOrigin(
          destinationBucket.bucketWebsiteDomainName,
          {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
          }
        ),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    new s3deploy.BucketDeployment(this, "S3BucketDeployment", {
      destinationBucket,
      distribution,
      sources: [s3deploy.Source.asset("./public")],
    });

    new cdk.CfnOutput(this, "DomainName", {
      value: distribution.distributionDomainName,
    });
  }
}

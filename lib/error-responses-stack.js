// @ts-check

import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";

/**
 * Handles 404 with CloudFront error responses
 */
export class ErrorResponsesStack extends cdk.Stack {
  /**
   * @param {import('constructs').Construct} scope
   * @param {string} id
   * @param {cdk.StackProps} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const destinationBucket = new s3.Bucket(this, "S3Bucket", {
      accessControl: s3.BucketAccessControl.PRIVATE,
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "CfOriginAccessIdentity"
    );
    destinationBucket.grantRead(originAccessIdentity);

    const distribution = new cloudfront.Distribution(this, "CfDistribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(destinationBucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
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

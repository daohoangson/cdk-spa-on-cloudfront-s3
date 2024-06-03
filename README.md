# cdk-spa-on-cloudfront-s3

Less than 50 lines of JavaScript to deploy a SPA on AWS:

- Use CDK v2
- Use the new `cloudfront.Distribution` construct
- Simplify bucket policy with `cloudfront.OriginAccessIdentity`
- Pre-configured error response

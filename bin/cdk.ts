#!/usr/bin/env node

import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkStack } from "../lib/cdk-stack";

const app = new cdk.App();
new CdkStack(app, "cdk-spa-on-cloudfront-s3", {
  description: "https://github.com/daohoangson/cdk-spa-on-cloudfront-s3",
});

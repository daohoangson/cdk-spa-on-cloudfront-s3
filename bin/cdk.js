#!/usr/bin/env node

import * as cdk from "aws-cdk-lib";
import { CdkStack } from "../lib/cdk-stack.js";

const app = new cdk.App();
new CdkStack(app, "cdk-spa-on-cloudfront-s3", {
  description: "https://github.com/daohoangson/cdk-spa-on-cloudfront-s3",
});

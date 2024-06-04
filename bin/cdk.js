#!/usr/bin/env node

// @ts-check

import * as cdk from "aws-cdk-lib";
import { ErrorResponsesStack } from "../lib/index.js";

const app = new cdk.App();
new ErrorResponsesStack(app, "SpaErrorResponses", {
  description: "https://github.com/daohoangson/cdk-spa-on-cloudfront-s3",
});

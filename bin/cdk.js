#!/usr/bin/env node

// @ts-check

import * as cdk from "aws-cdk-lib";
import {
  ErrorResponsesStack,
  FunctionStack,
  WebHostingStack,
} from "../lib/index.js";

const app = new cdk.App();
new ErrorResponsesStack(app, "SpaErrorResponses", {
  description: "https://github.com/daohoangson/cdk-spa-on-cloudfront-s3",
});
new FunctionStack(app, "SpaFunction", {
  description: "https://github.com/daohoangson/cdk-spa-on-cloudfront-s3",
});
new WebHostingStack(app, "SpaWebHosting", {
  description: "https://github.com/daohoangson/cdk-spa-on-cloudfront-s3",
});

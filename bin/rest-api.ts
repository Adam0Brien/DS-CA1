#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { RestAPIStack } from "../lib/rest-api-stack";
import { AuthAppStack } from "../lib/auth-app-stack";

const app = new cdk.App();
new RestAPIStack(app, "RestAPIStack", { env: { region: "eu-west-1" } });
new AuthAppStack(app, "AuthAPIStack", { env: { region: "eu-west-1" } });

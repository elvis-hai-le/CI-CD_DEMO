![](public/github-header.jpg)

## Continuous Integration/Continuous Deployment demo for SWE40006 - Software Deployment and Evolution

This GitHub repository was used to demonstrate a CI/CD pipeline using GitHub actions for the Continous Integration aspects and AWS CodeDeploy, S3, and EC2 for Continuous Deployment. AWS CloudWatch was used to monitor statistics after deployment.

## What's inside?

The project consists of a Snake application courtesy of [Marc Müller](https://github.com/marcmll/next-snake) developed in NextJS. This was simply to demonstrate code change capabilities. All credits reserved to Müller for core Snake game code, we only made superficial modifications. For deployment, the code was updated to work with a Bun deployment to ensure low overhead during the deployment phase as we were running into issues when using standard NextJS deployments. Additional portions of this repository include a GitHub Actions workflow and deployment script used to Continuous Deploy on an AWS EC2 instance. Unfortunately there are no live servers to demonstrate this application, but feel free to attempt to use this project however you like.

## Team members

Elvis Le
Lucy Williams
Narongdech Soontornekajit
Samuel Hadera


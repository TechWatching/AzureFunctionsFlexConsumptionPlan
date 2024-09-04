# Infrastructure code to provision a Function App on the Flex Consumption Plan

## What is it?

This repository contains 2 items:
- the infrastructure code (in the `infra` folder) needed to provision an Azure Function App on the Flex Consumption plan
- a basic .NET 8 isolated HTTP Trigger Azure Function (in the `src` folder)
  
This [blog article](https://techwatching.dev/posts/flex-consumption-plan) explains how to provision an Azure Function App on the Flex Consumption plan using the code on this repository.

The infrastructure code is a Pulumi TypeScript program that can be executed from the Pulumi CLI. When you execute it, it will provision the following resources:
- a Storage Account with a blob container in it
- a Function App and its associated Service Plan

![Diagram of the Azure resources to provision](https://github.com/user-attachments/assets/095cfb7b-ebeb-4fd7-932c-b724fd711a88)

I suggest you to read [the article](https://techwatching.dev/posts/flex-consumption-plan) before using this code. And if you are not familiar with Pulumi you should check their [documentation](https://www.pulumi.com/docs/) or [learning pathways](https://www.pulumi.com/learn/) too.

## How to use it?

### Prerequisites

You can check [Pulumi documentation](https://www.pulumi.com/docs/get-started/azure/begin/) to set up your environment.
You will have to install on your machine:
- Pulumi CLI
- Azure CLI
- pnpm
- Node.js (can be done using [pnpm](https://bordeauxcoders.com/manage-multiple-nodejs-versions))

You will need an Azure subscription.

You can use any [backend](https://www.pulumi.com/docs/intro/concepts/state/) for your Pulumi program (to store the state and encrypt secrets) but I suggest you to use the default backend: the Pulumi Cloud. It's free for individuals, you will just need to create an account on Pulumi website. If you prefer to use an Azure Blob Storage backend with an Azure Key Vault as the encryption provider you can check [this article](https://www.techwatching.dev/posts/pulumi-azure-backend).

### Execute the Pulumi program

- clone this repository
- log on to your Azure account using Azure CLI
- log on to your Pulumi backend using Pulumi CLI
- install the dependencies using pnpm
- run this command `pulumi up`

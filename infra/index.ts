import * as pulumi from '@pulumi/pulumi'
import * as resources from '@pulumi/azure-native/resources'
import * as storage from '@pulumi/azure-native/storage'
import {AppServicePlan, WebApp, listWebAppHostKeysOutput} from '@pulumi/azure-native/web/v20231201'
import {Config} from "@pulumi/pulumi";
import {RoleAssignment} from "@pulumi/azure-native/authorization";
import {azureBuiltInRoles} from "./azureBuiltInRoles";

const stackName = pulumi.getStack()
const config = new Config()

const resourceGroup = new resources.ResourceGroup(`rg-flexconsumption-${stackName}`)

const storageAccount = new storage.StorageAccount('stflexconsumpdev', {
  resourceGroupName: resourceGroup.name,
  allowBlobPublicAccess: false,
  kind: storage.Kind.StorageV2,
  sku: {
    name: storage.SkuName.Standard_LRS,
  },
})

new storage.BlobContainer('deploymentPackageContainer', {
  resourceGroupName: resourceGroup.name,
  accountName: storageAccount.name,
  containerName: 'deploymentpackage',
})

const servicePlan = new AppServicePlan(`plan-flexconsumption-${stackName}`, {
  resourceGroupName: resourceGroup.name,
  sku: {
    tier: 'FlexConsumption',
    name: 'FC1'
  },
  reserved: true
})

const functionApp = new WebApp(`func-flexconsumption-${stackName}`, {
  resourceGroupName: resourceGroup.name,
  kind: 'functionapp,linux',
  serverFarmId: servicePlan.id,
  identity: {
    type: 'SystemAssigned'
  },
  siteConfig: {
    appSettings: [
      {
        name: 'AzureWebJobsStorage__accountName',
        value: storageAccount.name
      }
    ]
  },
  functionAppConfig: {
    deployment: {
      storage: {
        type: 'blobContainer',
        value: pulumi.interpolate`${storageAccount.primaryEndpoints.blob}deploymentpackage`,
        authentication: {
          type: 'SystemAssignedIdentity'
        }
      }
    },
    scaleAndConcurrency: {
      instanceMemoryMB: 2048,
      maximumInstanceCount: 100
    },
    runtime: {
      name: config.require('functionAppRuntime'),
      version: config.require('functionAppVersion'),
    }
  }
});

new RoleAssignment('storageBlobDataContributor', {
  roleDefinitionId: azureBuiltInRoles.storageBlobDataContributor,
  scope: storageAccount.id,
  principalId: functionApp.identity.apply(p => p!.principalId),
  principalType: 'ServicePrincipal'
})

export const functionAppName = functionApp.name
export const defaultFunctionAppKey = pulumi.secret(listWebAppHostKeysOutput({ name: functionApp.name, resourceGroupName: resourceGroup.name })
  .functionKeys?.apply(x => x?.default))

export const functionEndpoint = pulumi.interpolate`https://${functionApp.defaultHostName}/api/HelloFlexConsumptionPlan?code=${defaultFunctionAppKey}`
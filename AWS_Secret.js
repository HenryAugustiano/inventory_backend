import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export async function getSecret(secretName) {
  const client = new SecretsManagerClient({
    region: "us-east-2",
  });

  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT",
      })
    );
    return JSON.parse(response.SecretString);
  } catch (error) {
    console.error('Error retrieving secret:', error);
    throw error;
  }
}

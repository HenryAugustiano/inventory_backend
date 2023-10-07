const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

async function getSecretKey() {
  const secret_name = "Inventorybackend.env";
  const client = new SecretsManagerClient({
    region: "us-east-2",
  });

  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    console.log(error);
    throw error;
  }

  const secret = response.SecretString;
  console.log('secret at aws.js',secret);
  return secret;
}

module.exports = { getSecretKey };

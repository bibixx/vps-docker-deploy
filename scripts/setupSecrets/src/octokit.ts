import { Octokit } from "octokit";
import { encryptSecret } from "./crypto";

export const setSecretFactory =
  (octokit: Octokit, owner: string, repo: string) =>
  async (secretName: string, secret: string) => {
    const repoPublicKey = await octokit.rest.actions.getRepoPublicKey({
      owner,
      repo,
    });

    let encryptedValue = await encryptSecret(secret, repoPublicKey.data.key);

    await octokit.rest.actions.createOrUpdateRepoSecret({
      owner,
      repo: repo,
      secret_name: secretName,
      key_id: repoPublicKey.data.key_id,
      encrypted_value: encryptedValue,
    });
  };

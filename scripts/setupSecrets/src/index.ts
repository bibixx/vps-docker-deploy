import { Octokit } from "octokit";
import ora from "ora";
import "dotenv/config";
import { getSSHKey } from "./crypto.js";
import { setSecretFactory } from "./octokit.js";
import {
  askForHostPath,
  askForOwner,
  askForProjectName,
  askForRepoList,
  askForRepoString,
  MORE_KEY,
  OTHER_KEY,
} from "./prompts.js";

const BASE_DEPLOY_TARGET_PATH = process.env.BASE_DEPLOY_TARGET_PATH;
const DEPLOY_USER = process.env.DEPLOY_USER;
const DEPLOY_HOST = process.env.DEPLOY_HOST;

(async function () {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    const user = await octokit.rest.users.getAuthenticated();
    const owner = await askForOwner(user.data.login);

    let perPage = 10;
    let chosenRepo: string | undefined;
    while (chosenRepo == null) {
      const reposResponse = await octokit.rest.repos.listForAuthenticatedUser({
        username: owner,
        type: "all",
        sort: "created",
        per_page: perPage,
      });
      const repos = reposResponse.data;
      const repoNames = repos.map((repo) => repo.name);

      let tmpChosenRepo = await askForRepoList(repoNames);

      if (tmpChosenRepo === OTHER_KEY) {
        chosenRepo = await askForRepoString();
      } else if (tmpChosenRepo === MORE_KEY) {
        perPage += 10;
      } else {
        chosenRepo = tmpChosenRepo;
      }
    }

    const projectName = await askForProjectName(chosenRepo);
    const hostPath = await askForHostPath();

    const sshSpinner = ora({
      text: "Getting SSH key from 1Password",
      spinner: "line",
    }).start();
    const sshKey = await getSSHKey();

    sshSpinner.succeed();

    const setSecretsSpinner = ora({
      text: "Setting secrets",
      spinner: "line",
    }).start();

    const setSecret = setSecretFactory(octokit, owner, chosenRepo);
    await Promise.all([
      setSecret(
        "DEPLOY_TARGET_PATH",
        `${BASE_DEPLOY_TARGET_PATH}/${projectName}`
      ),
      setSecret("DEPLOY_HOST_PATH", hostPath),
      setSecret("DEPLOY_USER", DEPLOY_USER),
      setSecret("DEPLOY_HOST", DEPLOY_HOST),
      setSecret("DEPLOY_KEY", sshKey),
    ]);

    setSecretsSpinner.succeed();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();

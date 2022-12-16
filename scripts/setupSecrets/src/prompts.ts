import { prompt } from "enquirer";
import { PromptOptions } from "./enquirer.types";

const immediatePrompt = async (questions: PromptOptions) => {
  if (questions === undefined) {
    throw new Error("Questions is undefined");
  }

  const NAME = "__NAME__";
  const result = await prompt({
    ...questions,
    name: NAME,
  } as any);

  return result[NAME];
};

export const askForOwner = (defaultOwner: string) =>
  immediatePrompt({
    type: "input",
    message: "Who is repository owner?",
    initial: defaultOwner,
  });

export const OTHER_KEY = "[Other]";
export const MORE_KEY = "[More]";
export const askForRepoList = (choices: string[]) =>
  immediatePrompt({
    type: "autocomplete",
    message: "What repository?",
    initial: 0,
    choices: [...choices, OTHER_KEY, MORE_KEY],
  });

export const askForRepoString = () =>
  immediatePrompt({
    type: "input",
    message: "What repository?",
  });

export const askForProjectName = (repoName: string) =>
  immediatePrompt({
    type: "input",
    message: "What is the project's name?",
    initial: repoName,
  });

export const askForHostPath = () =>
  immediatePrompt({
    type: "input",
    message: "Where are the project's files located?",
    initial: process.env.DEFAULT_HOST_PATH,
  });

#!/usr/bin/env node

import * as readline from "node:readline";
import * as fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import {
  getListAsString,
  constructQuestion,
  validateChoice,
  showError,
  showSuccess,
  colors,
  showBanner,
} from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basePath = join(__dirname, "..", "templates");

const projectTypes = ["Monolith", "Microservices"];

const dockerfileList = ["NestJS", "NestJS Microservices", "NextJS"];
const dockerComposeList = ["base", "dev", "prod"];
const gitlabOptionsList = ["root", "service"];

const dockerFilesTemplatesPath = join(basePath, "dockerfiles");
const dockerComposeFilesTemplatesPath = join(basePath, "docker-compose-files");
const gitlabFilesTemplatesPath = join(basePath, "gitlab");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function handleDockerfilesChoice(): void {
  const dockerfileListString = getListAsString(dockerfileList);

  rl.question(
    constructQuestion("Choose Which Dockerfile You Need", dockerfileListString),
    (answer: string) => {
      if (!validateChoice(answer, dockerfileList.length)) {
        showError(
          `Invalid choice '${answer}'. Please choose 1-${dockerfileList.length}`
        );
        return;
      }

      try {
        const dockerFilePaths = fs.readdirSync(dockerFilesTemplatesPath);
        const selectedFile = dockerFilePaths[parseInt(answer) - 1];

        if (!selectedFile) {
          showError("Template file not found");
          return;
        }

        const sourcePath = join(dockerFilesTemplatesPath, selectedFile);
        const destPath = join(process.cwd(), "Dockerfile");

        fs.copyFileSync(sourcePath, destPath);

        showSuccess(
          `Dockerfile created successfully! (${
            dockerfileList[parseInt(answer) - 1]
          })`
        );
        console.log(`${colors.blue}📁 Location:${colors.reset} ${destPath}\n`);
      } catch (error) {
        showError(`Failed to copy Dockerfile: ${error}`);
      } finally {
        rl.close();
      }
    }
  );
}

function handleDockerComposeFilesChoice(): void {
  const dockerComposeFilesListString = getListAsString(dockerComposeList);

  rl.question(
    constructQuestion(
      "Choose Which Docker Compose File You Need",
      dockerComposeFilesListString
    ),
    (answer: string) => {
      if (!validateChoice(answer, dockerComposeList.length)) {
        showError(
          `Invalid choice '${answer}'. Please choose 1-${dockerComposeList.length}`
        );
        return;
      }

      try {
        const dockerComposeFilePaths = fs.readdirSync(
          dockerComposeFilesTemplatesPath
        );
        const dockerComposeName = dockerComposeFilePaths[parseInt(answer) - 1];

        if (!dockerComposeName) {
          showError("Template file not found");
          return;
        }

        const sourcePath = join(
          dockerComposeFilesTemplatesPath,
          dockerComposeName
        );
        const destPath = join(process.cwd(), dockerComposeName);

        fs.copyFileSync(sourcePath, destPath);

        showSuccess(
          `Docker Compose file created successfully! (${
            dockerComposeList[parseInt(answer) - 1]
          })`
        );
        console.log(`${colors.blue}📁 Location:${colors.reset} ${destPath}\n`);
      } catch (error) {
        showError(`Failed to copy Docker Compose file: ${error}`);
      } finally {
        rl.close();
      }
    }
  );
}

function handleGitlabFilesChoice(): void {
  const projectTypesListString = getListAsString(projectTypes);

  rl.question(
    constructQuestion("Choose Project Type", projectTypesListString),
    (projectTypeAnswer: string) => {
      if (!validateChoice(projectTypeAnswer, projectTypes.length)) {
        showError(
          `Invalid choice '${projectTypeAnswer}'. Please choose 1-${projectTypes.length}`
        );
        rl.close();
        return;
      }

      const projectType = projectTypes[parseInt(projectTypeAnswer) - 1];

      if (projectType === "Monolith") {
        handleMonolithGitlab();
      } else if (projectType === "Microservices") {
        handleMicroservicesGitlab();
      }
    }
  );
}

function handleMonolithGitlab(): void {
  try {
    const rootGitlabPath = join(gitlabFilesTemplatesPath, "root-gitlab.yml");
    const serviceGitlabPath = join(
      gitlabFilesTemplatesPath,
      "service-gitlab.yml"
    );
    const destPath = join(process.cwd(), ".gitlab-ci.yml");

    // Use yq to merge the two files
    try {
      execSync(
        `yq eval-all '. as $item ireduce ({}; . * $item)' "${rootGitlabPath}" "${serviceGitlabPath}" > "${destPath}"`,
        { stdio: "inherit" }
      );

      showSuccess("GitLab CI configuration created successfully! (Monolith)");
      console.log(`${colors.blue}📁 Location:${colors.reset} ${destPath}\n`);
      console.log(
        `${colors.yellow}ℹ️  Note:${colors.reset} Combined root and service configurations\n`
      );
    } catch (error) {
      showError(
        "Failed to merge files. Make sure 'yq' is installed (https://github.com/mikefarah/yq)"
      );
      console.log(
        `${colors.yellow}💡 Install yq:${colors.reset} brew install yq (macOS) or snap install yq (Linux)\n`
      );
    }
  } catch (error) {
    showError(`Failed to create GitLab CI file: ${error}`);
  } finally {
    rl.close();
  }
}

function handleMicroservicesGitlab(): void {
  const gitlabOptionsListString = getListAsString(gitlabOptionsList);

  rl.question(
    constructQuestion(
      "What do you want to create?",
      gitlabOptionsListString
    ),
    (answer: string) => {
      if (!validateChoice(answer, gitlabOptionsList.length)) {
        showError(
          `Invalid choice '${answer}'. Please choose 1-${gitlabOptionsList.length}`
        );
        rl.close();
        return;
      }

      try {
        const choice = gitlabOptionsList[parseInt(answer) - 1];
        let sourceFile = "";
        let description = "";

        if (choice === "root") {
          sourceFile = "root-gitlab.yml";
          description = "Root GitLab CI (for project root)";
        } else if (choice === "service") {
          sourceFile = "service-gitlab.yml";
          description = "Service GitLab CI (for microservice)";
        }

        const sourcePath = join(gitlabFilesTemplatesPath, sourceFile);
        const destPath = join(process.cwd(), ".gitlab-ci.yml");

        fs.copyFileSync(sourcePath, destPath);

        showSuccess(`GitLab CI configuration created successfully!`);
        console.log(`${colors.blue}📁 Location:${colors.reset} ${destPath}`);
        console.log(`${colors.blue}📄 Type:${colors.reset} ${description}\n`);

        if (choice === "root") {
          console.log(
            `${colors.yellow}💡 Next steps:${colors.reset}\n` +
              `   1. Create service .gitlab-ci.yml files in each microservice folder\n` +
              `   2. Include them in this root file using:\n` +
              `      include:\n` +
              `        - local: '/path/to/service/.gitlab-ci.yml'\n`
          );
        } else {
          console.log(
            `${colors.yellow}💡 Remember:${colors.reset} Include this file in your root .gitlab-ci.yml\n`
          );
        }
      } catch (error) {
        showError(`Failed to create GitLab CI file: ${error}`);
      } finally {
        rl.close();
      }
    }
  );
}

function main(): void {
  showBanner();

  const serviceAnswersOptions = ["Dockerfile", "Docker Compose", "GitLab CI"];
  const serviceAnswersOptionsListString = getListAsString(
    serviceAnswersOptions
  );

  rl.question(
    constructQuestion(
      "What would you like to create?",
      serviceAnswersOptionsListString
    ),
    (answer: string) => {
      if (!validateChoice(answer, serviceAnswersOptions.length)) {
        showError(
          `Invalid choice '${answer}'. Please choose 1-${serviceAnswersOptions.length}`
        );
        return;
      }

      switch (answer) {
        case "1":
          handleDockerfilesChoice();
          break;
        case "2":
          handleDockerComposeFilesChoice();
          break;
        case "3":
          handleGitlabFilesChoice();
          break;
        default:
          showError(`Provided choice '${answer}' is incorrect`);
      }
    }
  );
}

main();

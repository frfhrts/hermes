#!/usr/bin/env node

import * as readline from "node:readline";
import * as fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basePath = join(__dirname, "..", "templates");

const dockerfileList = ["NestJS", "NestJS Microservices", "NextJS"];
const dockerComposeList = ["base", "dev", "prod"];

const dockerFilesTemplatesPath = join(basePath, "dockerfiles");
const dockerComposeFilesTemplatesPath = join(basePath, "docker-compose-files");

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getListAsString(arrayList: string[]): string {
  return arrayList
    .map((val, index) => {
      return `   ${colors.cyan}${index + 1}.${colors.reset} ${val}`;
    })
    .join("\n");
}

function constructQuestion(questionString: string, options: string): string {
  return `\n${colors.bright}${colors.yellow}${questionString}:${colors.reset}\n\n${options}\n\n${colors.green}❯${colors.reset} Your choice: `;
}

function showBanner(): void {
  console.clear();
  console.log(`
${colors.cyan}${colors.bright}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║                   ⚡  H E R M E S  ⚡                     ║
║                                                           ║
║                                                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝${colors.reset}
  `);
}

function showSuccess(message: string): void {
  console.log(
    `\n${colors.green}✓${colors.reset} ${colors.bright}${message}${colors.reset}\n`
  );
}

function showError(message: string): void {
  console.log(`\n${colors.red}✗ Error:${colors.reset} ${message}\n`);
  process.exit(1);
}

function validateChoice(choice: string, max: number): boolean {
  const num = parseInt(choice);
  return !isNaN(num) && num >= 1 && num <= max;
}

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

function main(): void {
  showBanner();

  const serviceAnswersOptions = ["Dockerfile", "Docker Compose"];
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
        default:
          showError(`Provided choice '${answer}' is incorrect`);
      }
    }
  );
}

main();

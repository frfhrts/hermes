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

const dockerfileListString = getListAsString(dockerfileList);
const dockerComposeFilesListString = getListAsString(dockerComposeList);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getListAsString(arrayList: any) {
  return arrayList
    .map((val: string | number, index: number) => {
      return `${index + 1}. ${val} \n`;
    })
    .join("\n");
}

function constructQuestion(questionString: string, options: string[]) {
  return `\n${questionString}:\n\n${options}\n\nYour Choice:`;
}

function handleDockerfilesChoice() {
  rl.question(
    constructQuestion("Choose Which Dockerfile You Need", dockerfileListString),
    (answer: string) => {
      const dockerFilePaths = fs.readdirSync(`${dockerFilesTemplatesPath}`);

      fs.copyFileSync(
        `${dockerFilesTemplatesPath}/${dockerFilePaths[parseInt(answer) - 1]}`,
        "./Dockerfile"
      );
      rl.close();
    }
  );
}

function handleDockerComposeFilesChoice() {
  rl.question(
    constructQuestion(
      "Choose Which docker compose You Need",
      dockerComposeFilesListString
    ),
    (answer: string) => {
      const dockerComposeFilePaths = fs.readdirSync(
        `${dockerComposeFilesTemplatesPath}`
      );
      const dockerComposeName = dockerComposeFilePaths[parseInt(answer) - 1];

      fs.copyFileSync(
        `${dockerComposeFilesTemplatesPath}/${dockerComposeName}`,
        `./${dockerComposeName}`
      );
      rl.close();
    }
  );
}

function main() {
  const serviceAnswersOptions = ["Dockerfiles", "docker-compose files"];

  console.log(`
    ===========================================================\n
    ========================   HERMES  ========================\n
    ===========================================================\n
    `);

  const serviceAnswersOptionsListString = getListAsString(
    serviceAnswersOptions
  );

  rl.question(
    constructQuestion(
      "Choose what you want to setup",
      serviceAnswersOptionsListString
    ),
    (answer: string) => {
      switch (answer) {
        case "1":
          handleDockerfilesChoice();
          break;
        case "2":
          handleDockerComposeFilesChoice();
          break;
        default:
          throw new Error(`Provided Choice '${answer}' Is Incorrect`);
      }
    }
  );
}

main();

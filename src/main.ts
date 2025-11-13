import * as readline from "node:readline";
import * as fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function getListAsString(arrayList: any) {
  return arrayList
    .map((val: string | number, index: number) => {
      return `${index + 1}. ${val} \n`;
    })
    .join("\n");
}
function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const dockerfileList = ["NestJS", "NestJS Microservices", "NextJS"];
  const dockerFilesTemplatesPath = join(__dirname, "..", "templates", "dockerfiles");
  console.log(`
    ===========================================================\n
    ========================   HERMES  ========================\n
    ===========================================================\n
    `);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const listString = getListAsString(dockerfileList);

  rl.question(
    `Choose Which Dockerfile You Need:\n\n${listString}\n\nYour choice: `,
    (answ: string) => {
      const dockerFilePaths = fs.readdirSync(`${dockerFilesTemplatesPath}`);
      fs.copyFileSync(
        `${dockerFilesTemplatesPath}/${dockerFilePaths[parseInt(answ) - 1]}`,
        "./Dockerfile"
      );
      rl.close();
    }
  );
}

main();

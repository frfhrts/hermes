export const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

export function getListAsString(arrayList: string[]): string {
  return arrayList
    .map((val, index) => {
      return `   ${colors.cyan}${index + 1}.${colors.reset} ${val}`;
    })
    .join("\n");
}

export function constructQuestion(questionString: string, options: string): string {
  return `\n${colors.bright}${colors.yellow}${questionString}:${colors.reset}\n\n${options}\n\n${colors.green}❯${colors.reset} Your choice: `;
}

export function showBanner(): void {
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

export function showSuccess(message: string): void {
  console.log(
    `\n${colors.green}✓${colors.reset} ${colors.bright}${message}${colors.reset}\n`
  );
}

export function showError(message: string): void {
  console.log(`\n${colors.red}✗ Error:${colors.reset} ${message}\n`);
  process.exit(1);
}

export function validateChoice(choice: string, max: number): boolean {
  const num = parseInt(choice);
  return !isNaN(num) && num >= 1 && num <= max;
}

# Hermes

A CLI tool for quickly scaffolding Docker and GitLab CI configurations for your projects.

## What is Hermes?

Hermes is a command-line interface tool that helps developers quickly generate essential DevOps configuration files. It provides templates for:

- **Dockerfiles** - Pre-configured for NestJS, NestJS Microservices, and NextJS projects
- **Docker Compose files** - Base, development, and production configurations
- **GitLab CI/CD** - Ready-to-use CI/CD pipelines for both monolith and microservices architectures

## Features

- Interactive CLI interface with easy-to-use prompts
- Works from any directory - templates are bundled with the tool
- Support for both monolith and microservices architectures
- Automatic file merging for GitLab CI configurations (monolith mode)
- Helpful guidance for microservices setup

## Installation

### Prerequisites

- Node.js (v14 or higher)
- For GitLab CI monolith setup: [yq](https://github.com/mikefarah/yq) (YAML processor)

### Install from source

```bash
# Clone the repository
git clone git@github.com:frfhrts/hermes.git
cd hermes

chmod +x install.sh
./install.sh

```

## Usage

Simply run `hermes` from any directory:

```bash
hermes
```

The CLI will guide you through an interactive menu:

### 1. Choose what to create

- Dockerfile
- Docker Compose
- GitLab CI

### 2. Select your template

**For Dockerfiles:**

- NestJS
- NestJS Microservices
- NextJS

**For Docker Compose:**

- base
- dev
- prod

**For GitLab CI:**

- **Monolith**: Automatically merges root and service configurations into a single `.gitlab-ci.yml`
- **Microservices**: Choose between:
  - Root GitLab CI (for project root)
  - Service GitLab CI (for individual microservices)

### Examples

#### Creating a Dockerfile

```bash
$ hermes
# Select: 1 (Dockerfile)
# Choose: 1 (NestJS)
# � Dockerfile created in current directory
```

#### Creating GitLab CI for Microservices

```bash
# In your project root
$ hermes
# Select: 3 (GitLab CI)
# Choose: 2 (Microservices)
# Choose: 1 (root)
# � Root .gitlab-ci.yml created

# Then in each microservice directory
$ cd services/api
$ hermes
# Select: 3 (GitLab CI)
# Choose: 2 (Microservices)
# Choose: 2 (service)
# � Service .gitlab-ci.yml created
```

## Requirements for GitLab CI (Monolith)

For monolith GitLab CI setup, Hermes uses `yq` to merge configuration files. Install it:

**macOS:**

```bash
brew install yq
```

**Linux:**

```bash
snap install yq
```

**OR**

```bash
sudo wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64
sudo chmod +x /usr/local/bin/yq
```

**Other platforms:**
See [yq installation guide](https://github.com/mikefarah/yq#install)

## Uninstall

### installed from source

```bash
chmod +x uninstall.sh
./uninstall.sh
```

## Contributing

Contributions are welcome! Here's how you can help:

### Setting up for development

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone git@github.com:YOUR_USERNAME/hermes.git
   cd hermes
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Make your changes
5. Build and test:
   ```bash
   npm run build
   npm link  # Test locally
   hermes    # Run the tool
   ```

### Adding new templates

1. Add your template file to the appropriate directory:

   - `templates/dockerfiles/` for Dockerfiles
   - `templates/docker-compose-files/` for Docker Compose files
   - `templates/gitlab/` for GitLab CI files

2. Update the corresponding array in `src/main.ts`:

   - `dockerfileList` for Dockerfiles
   - `dockerComposeList` for Docker Compose files
   - `gitlabOptionsList` for GitLab CI files

3. Test your changes locally

### Submitting changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Commit your changes:
   ```bash
   git add .
   git commit -m "Add your descriptive commit message"
   ```
3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
4. Open a Pull Request on GitHub

### Code style

- Use TypeScript
- Follow existing code patterns
- Add comments for complex logic
- Test your changes before submitting


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Repository

[https://github.com/frfhrts/hermes](https://github.com/frfhrts/hermes)

## Issues and Support

Found a bug or have a feature request? Please [open an issue](https://github.com/frfhrts/hermes/issues) on GitHub.

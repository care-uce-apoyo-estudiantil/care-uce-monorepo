# UCE Integrated Student Support System (CareUCE)

##  About the Project
The UCE Integrated Student Support System is a highly available, event-driven distributed architecture designed to centralize and automate student welfare services (Psychology, Social Work, and Psychopedagogy). It eliminates information silos, ensuring immediate crisis response (e.g., suicide ideation prevention) while strictly maintaining medical confidentiality through advanced architectural patterns like CQRS and Hexagonal Architecture.

##  Architecture & Tech Stack
This project is structured as a **Monorepo** managed by **Nx** to share interfaces and optimize CI/CD pipelines.

* **Backend / Microservices:** TypeScript, NestJS (Database-per-service pattern)
* **Frontend (Clients):** React.js (Web), React Native (Mobile), Electron JS (Desktop)
* **Databases (Polyglot Persistence):** PostgreSQL, MongoDB, Redis, ElasticSearch
* **Event Bus & Messaging:** Apache Kafka, RabbitMQ, MQTT
* **DevOps & Infrastructure:** AWS (EC2 t3.medium), Terraform, Docker, Cloudflare WAF, GitHub Actions
* **Task Management:** Huly

##  Prerequisites & Dependencies
To run this project locally, ensure you have the following installed:

* **Node.js:** v20.x or higher
* **npm:** v10.x or higher
* **Git:** v2.x or higher
* **Docker & Docker Compose:** Required for local database spinning.

##  Getting Started (Local Environment)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/care-uce-apoyo-estudiantil/care-uce-monorepo.git
   cd care-uce-monorepo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development servers:** *(Specific commands will be added as Nx apps are generated).*

## Git Workflow & CI/CD Guidelines
To maintain code quality and prevent broken deployments, the team strictly follows the **GitHub Flow** and **Conventional Commits** standards.

### 1. Branching Strategy
* `main`: The production-ready branch. **Direct pushes are strictly prohibited.**
* `feature/<ticket-id>-<short-desc>`: Used for new features (e.g., `feature/CARE-01-login-ui`).
* `bugfix/<ticket-id>-<short-desc>`: Used for fixing bugs.

### 2. Commit Naming Convention
All commits MUST be in English and follow the Conventional Commits format to trigger automated semantic releases:

* `feat:` A new feature (e.g., `feat: add JWT authentication in NestJS`)
* `fix:` A bug fix (e.g., `fix: resolve Redis connection timeout`)
* `docs:` Documentation changes only (e.g., `docs: update README with workflow`)
* `chore:` Routine tasks, dependencies (e.g., `chore: update Nx workspace`)
* `refactor:` Code changes that neither fix a bug nor add a feature.

### 3. Pull Request (PR) Lifecycle
1. The developer assigns themselves a ticket in **Huly**.
2. Creates a local branch: `git checkout -b feature/CARE-01`.
3. Commits the code using Conventional Commits.
4. Pushes the branch and opens a Pull Request targeting `main`.
5. The PR description MUST include a reference to the Huly ticket (e.g., `Resolves #CARE-01`).
6. **Code Review:** At least one team member (or the DevOps Lead) must approve the PR.
7. **CI Checks:** GitHub Actions will automatically run linting and unit tests.
8. **Merge:** Once approved and checks pass, the PR is merged via *Squash and Merge* to keep the history clean.

## Team Roles
* **Scrum Master / BA:** Jimmy Quimba
* **DevOpsSec / SRE:** Donovan Pilicita
* **Back-End Developer:** Carlos Robayo
* **Front-End / UI-UX:** Davinson Diaz

# CareUCE Web Portal (Admin)

Administrative dashboard for UCE authorities to manage student support services and crisis alerts.

![Framework](https://img.shields.io/badge/framework-React_18-brightgreen)
![Styling](https://img.shields.io/badge/styles-TailwindCSS-38b2ac)
![Architecture](https://img.shields.io/badge/pattern-Atomic_Design-orange)

## 🏗 Architecture

The project follows the **Atomic Design** methodology, ensuring modularity, reusability, and maintainability across the UI components. The project is part of a larger Nx Monorepo, facilitating shared library management.

```mermaid
graph TD
    Page[Page: Auth/Dashboard] --> Template[Template: AdminTemplate]
    Template --> Organism[Organism: Sidebar/AuthForm]
    Organism --> Molecule[Molecule: OAuthButtons]
    Molecule --> Atom[Atom: InputField/Button]

1. Initial Setup

Setup & Installation
Important: This workspace is an Nx Monorepo. Always perform installation commands from the root of the repository (care-uce-monorepo/) to ensure proper dependency resolution.

# Install dependencies from the root
npm install

2. Development Workflow
To run the web application in development mode:

# Start the web development server
npx nx serve care-uce-web

Component Documentation & UI Testing
This project utilizes Storybook for UI component isolation and documentation.

# Launch Storybook
npx nx storybook care-uce-web

📂 Project Structure
src/components/atoms: Base UI elements (e.g., Button, InputField).

src/components/molecules: Combinations of atoms (e.g., OAuthButtons).

src/components/organisms: Complex UI sections (e.g., Sidebar, AuthForm).

src/components/templates: Page layouts (e.g., AdminTemplate).

src/pages: Full routed views (e.g., AuthPage, DashboardPage).

src/utils: Shared logic, types, and logging utilities.


🛠 Prerequisites
Node.js: v18.x or higher.

NX: Recommended to have nx CLI installed globally, though npx nx works fine.

VS Code Extensions: Tailwind CSS IntelliSense (Recommended).


📋 Next Steps
Integration with auth-service (Backend) via Axios.

JWT Token persistence and session management.

WebSockets implementation for real-time Crisis Alerts.


```

# CareUCE

### Integrated Student Support System · Central University of Ecuador

**A resilient, event-driven platform that unifies Psychology, Social Work, and Psychopedagogy services — enabling immediate crisis response while protecting medical confidentiality by design.**

![Status](https://img.shields.io/badge/status-in%20development-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Cloud](https://img.shields.io/badge/deployed%20on-AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Monorepo](https://img.shields.io/badge/monorepo-Nx-143055?style=for-the-badge&logo=nx&logoColor=white)

**[Overview](#-overview)** · **[Features](#-key-features)** · **[Screenshots](#-screenshots)** · **[Architecture](#-architecture)** · **[Tech Stack](#-tech-stack)** · **[Infrastructure](#-cloud-infrastructure)** · **[Team](#-team)**

---

## Overview

**CareUCE** centralizes the university's student welfare services — Psychology, Social Work, and Psychopedagogy — into a single, coherent digital ecosystem. Historically operating in disconnected silos, these departments struggled to share critical information during time-sensitive situations, such as suicide-risk indicators or emergency welfare cases.

CareUCE closes that gap with a **highly available, event-driven distributed architecture** built on **Hexagonal Architecture** and **CQRS** principles, ensuring that:

- **Crisis signals travel instantly** across departments through an asynchronous event bus.
- **Clinical confidentiality is enforced architecturally**, not just procedurally — sensitive data is isolated per bounded context.
- **Each domain evolves independently**, thanks to a database-per-service microservices design.
- **Every stakeholder gets the right interface** — a web admin portal, a native mobile app for students, and a desktop client for on-site staff.

---

## Key Features

### Intelligent Triage

Every case entering the system is classified by urgency (`Alta` / `Media` / `Baja`), routed automatically, and tracked through its full lifecycle — from `Pendiente` to `Resuelto` — so no student in crisis is ever left waiting.

### Confidential Clinical Records

Psychological notes and treatment history live in an isolated, document-oriented store, linked to — but decoupled from — the triage and identity domains, preserving strict clinical confidentiality.

### Appointment Scheduling

A dedicated service manages counseling and follow-up appointments, keeping scheduling logic independent from clinical and identity data.

### Secure Identity & Access

Centralized authentication and authorization issue and validate credentials across every downstream service, using JWT-based session control.

### Multi-Platform by Design

| Platform           | Purpose                                                                                  | Stack                                  |
| ------------------ | ---------------------------------------------------------------------------------------- | -------------------------------------- |
| 🖥️ **Web Portal**  | Administrative dashboard for authorities to manage cases, students, and real-time alerts | React 18 · Atomic Design · TailwindCSS |
| 📱 **Mobile App**  | Primary touchpoint for students to reach out and follow their cases                      | React Native · Expo                    |
| 🪟 **Desktop App** | On-site tool for counselors and front-desk staff                                         | Electron                               |

---

## Screenshots

**Login** <br>
<img width="680" height="336" alt="Screenshot_184" src="https://github.com/user-attachments/assets/67e4bc37-8944-475d-b9e9-d14d4ae00e9d"/>

**Admin Dashboard** — real-time overview of active cases and alerts <br>

<img width="680" height="336" alt="Screenshot_185" src="https://github.com/user-attachments/assets/c780cb0a-ad35-41b1-9a9f-139f8a390339" />

---

## Architecture

CareUCE is organized as a **domain-driven microservices ecosystem**, where each backend service owns its data and communicates state changes asynchronously — decoupling the departments that once operated in isolation.

```mermaid
flowchart TB
    subgraph Clients["Client Applications"]
        WEB[" Web Portal<br/>React"]
        MOB[" Mobile App<br/>React Native"]
        DESK[" Desktop App<br/>Electron"]
    end

    GW[" API Gateway<br/>Nginx"]

    subgraph Services["Backend Microservices · NestJS"]
        AUTH[" Auth Service<br/>Identity & Access"]
        TRIAGE[" Triage Service<br/>Case Intake & Prioritization"]
        CLINICAL[" Clinical Service<br/>Confidential Records"]
        APPT[" Appointment Service<br/>Scheduling"]
    end

    BUS([" Event Bus<br/>Apache Kafka"])

    subgraph Data["Polyglot Persistence"]
        PGA[("PostgreSQL<br/>auth_db")]
        PGT[("PostgreSQL<br/>triage_db")]
        PGP[("PostgreSQL<br/>appointment_db")]
        MONGO[("MongoDB<br/>clinical_db")]
    end

    WEB --> GW
    MOB --> GW
    DESK --> GW

    GW --> AUTH
    GW --> TRIAGE
    GW --> CLINICAL
    GW --> APPT

    AUTH --> PGA
    TRIAGE --> PGT
    APPT --> PGP
    CLINICAL --> MONGO

    TRIAGE -- "Case Created / Escalated" --> BUS
    BUS -- "Consumes Event" --> CLINICAL
```

### Guiding Architectural Principles

- **Hexagonal Architecture** — domain logic stays isolated from frameworks and infrastructure, keeping services testable and swappable.
- **CQRS** — read and write paths are modeled separately where it matters most, optimizing for both responsiveness and data integrity.
- **Database-per-Service** — each microservice owns its persistence layer, eliminating cross-service coupling and enforcing confidentiality boundaries.
- **Event-Driven Communication** — Kafka propagates domain events (e.g., a new triage case) so dependent services react without tight synchronous coupling.

---

## Tech Stack

**Backend & Services**

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)

**Client Applications**

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=flat-square&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

**Data & Messaging**

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=flat-square&logo=apachekafka&logoColor=white)

**Infrastructure & Tooling**

![AWS](https://img.shields.io/badge/AWS-FF9900?style=flat-square&logo=amazonaws&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=flat-square&logo=terraform&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![Nx](https://img.shields.io/badge/Nx_Monorepo-143055?style=flat-square&logo=nx&logoColor=white)

This project is structured as an **Nx Monorepo**, sharing interfaces and tooling across every application while keeping build and CI/CD pipelines fast through affected-based task execution and remote caching.

---

## Cloud Infrastructure

CareUCE runs entirely on **AWS**, provisioned and versioned end-to-end with **Terraform** for reproducible, auditable environments across `qa` and `prod`.

```mermaid
flowchart TB
    subgraph VPC["AWS VPC"]
        direction TB
        subgraph Public["Public Subnet"]
            ALB[" Application Load Balancer"]
            BASTION[" Bastion Host<br/>(SSH Gateway)"]
        end

        subgraph Private["Private Subnet"]
            ASG[" Auto Scaling Group<br/>EC2 t3.medium — App Services"]
            DATASVC[" Data Services Instance<br/>Kafka + MongoDB"]
            RDS[(" Amazon RDS<br/>auth · triage · appointment")]
        end
    end

    CF[" Cloudflare WAF"] --> ALB
    ALB --> ASG
    BASTION -.SSH.-> ASG
    BASTION -.SSH.-> DATASVC
    ASG --> RDS
    ASG --> DATASVC
```

- **Compute** — an Auto Scaling Group of `t3.medium` EC2 instances behind an Application Load Balancer, scaling on CPU and request-count policies.
- **Data Layer** — managed **Amazon RDS (PostgreSQL)** instances per relational service, plus a dedicated EC2 instance running Kafka and MongoDB for event streaming and document storage.
- **Network Security** — all application and data resources sit in private subnets, reachable only through the load balancer or a hardened bastion host.
- **Edge Protection** — **Cloudflare WAF** shields the platform from common web exploits and malicious traffic before it ever reaches AWS.
- **Infrastructure as Code** — every environment (`qa`, `prod`) is fully described in Terraform modules, enabling consistent, repeatable deployments.
- **CI/CD** — GitHub Actions automate linting, testing, and container builds on every pull request targeting `main`.

---

## Security & Confidentiality

- **JWT-based authentication** issued and validated centrally by the Auth Service.
- **Isolated clinical data store** — psychological notes never share a database with identity or scheduling data.
- **Least-privilege network topology** — security groups scope traffic strictly between the load balancer, application tier, and data tier.
- **Encrypted, versioned infrastructure** — no manual, undocumented changes to production resources.

---

## Team

| Role                            | Member           |
| ------------------------------- | ---------------- |
| Scrum Master / Business Analyst | Jimmy Quimba     |
| DevOpsSec / SRE                 | Donovan Pilicita |
| Back-End Developer              | Carlos Robayo    |
| Front-End / UI-UX               | Davinson Diaz    |

---

**CareUCE** — because every student's wellbeing deserves a system that responds as fast as they need it to.

<sub>© Universidad Central del Ecuador · CareUCE Project</sub>

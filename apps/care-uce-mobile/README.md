# CareUCE Monorepo

Integrated Student Support System for the Central University of Ecuador (UCE).

## 🏗 Architecture
This project uses an **Nx Monorepo** architecture to manage multiple applications and shared libraries, ensuring code reusability and unified maintenance.

* **Monorepo Manager:** Nx
* **Frontend Framework:** React Native & Expo (SDK 54)
* **Web:** React.js via `react-native-web`
* **Language:** TypeScript 5.3.3

## 🚀 Setup & Installation

### 1. Initial Setup
This workspace uses a unified `node_modules` strategy at the root level to prevent dependency duplication. **Always run install commands from the root.**

```bash
# Clean previous installations
rmdir /s /q node_modules
rmdir /s /q apps\care-uce-mobile\node_modules
rmdir /s /q apps\care-uce-mobile\.expo
del package-lock.json

# Install dependencies from root
npm install --legacy-peer-deps

Web Development (Recommended for UI/UX Validation)
To run the web version, execute:

cd apps/care-uce-mobile
npx expo start -c --web

Mobile DevelopmentThe project is configured for EAS Development Builds to support the required native modules (e.g., ExpoUI).
Note: Standard Expo Go may throw [runtime no ready] errors due to React 19 version mismatches and native module binding requirements in SDK 54.  
To run natively:

npx expo start --tunnel



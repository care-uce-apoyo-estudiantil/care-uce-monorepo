// apps/backend/triage-service/src/app/triage/wasm/index.ts

// Retornamos un código entero que representará el RiskLevel
// 3: CRITICAL, 2: HIGH, 1: MODERATE, 0: LOW
export function evaluateRiskLevel(totalScore: i32): i32 {
  if (totalScore >= 20) {
    return 3;
  } else if (totalScore >= 15) {
    return 2;
  } else if (totalScore >= 10) {
    return 1;
  }
  return 0;
}
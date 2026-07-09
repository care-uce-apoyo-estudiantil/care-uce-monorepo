export interface JwtPayload {
  /** User ID (UUID) – maps to `user.id` */
  sub: string;
  /** User email address */
  email: string;
  /** User role string (matches UserRole enum values) */
  role: string;
}

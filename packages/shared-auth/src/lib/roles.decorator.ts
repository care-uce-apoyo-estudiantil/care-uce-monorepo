import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator that assigns required roles to a route handler.
 * Used together with `RolesGuard` to restrict access by role.
 *
 * @example
 * ```ts
 * @Roles('admin', 'psychologist')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Get('reports')
 * getReports() { ... }
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

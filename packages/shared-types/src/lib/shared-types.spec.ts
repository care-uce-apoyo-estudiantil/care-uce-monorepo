import { UserRole } from './enums/user-role.enum.js';
import type { JwtPayload } from './interfaces/jwt-payload.interface.js';
import type { Student } from './interfaces/student.interface.js';

describe('shared-types', () => {
  it('should have all UserRole values', () => {
    expect(UserRole.STUDENT).toBe('student');
    expect(UserRole.PSYCHOLOGIST).toBe('psychologist');
    expect(UserRole.SOCIAL_WORKER).toBe('social_worker');
    expect(UserRole.PSYCHOPEDAGOGUE).toBe('psychopedagogue');
    expect(UserRole.ADMIN).toBe('admin');
  });

  it('should allow creating a JwtPayload object', () => {
    const payload: JwtPayload = {
      sub: '123',
      email: 'test@uce.edu.ec',
      role: UserRole.STUDENT,
    };
    expect(payload.sub).toBe('123');
    expect(payload.email).toBe('test@uce.edu.ec');
    expect(payload.role).toBe('student');
  });

  it('should allow creating a Student object', () => {
    const student: Student = {
      id: '456',
      email: 'student@uce.edu.ec',
      role: UserRole.STUDENT,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    expect(student.id).toBe('456');
    expect(student.is_active).toBe(true);
  });
});

import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles/roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  const mockContext = (role: string, requiredRoles: string[]) =>
    ({
      getHandler: () => 'handler',
      getClass: () => 'class',
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role },
        }),
      }),
    }) as unknown as ExecutionContext;

  it('should allow access when no role is required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const result = guard.canActivate(mockContext('USER', []));
    expect(result).toBe(true);
  });

  it('should allow access when role matches', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    const result = guard.canActivate(mockContext('ADMIN', ['ADMIN']));
    expect(result).toBe(true);
  });

  it('should deny access when role does not match', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    expect(() => guard.canActivate(mockContext('USER', ['ADMIN']))).toThrow();
  });
});

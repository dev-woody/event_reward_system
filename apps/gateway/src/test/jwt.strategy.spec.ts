import { JwtStrategy } from "src/auth/jwt.strategy";

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should validate JWT payload correctly', async () => {
    const payload = {
      sub: 'user123',
      username: 'tester',
      role: 'ADMIN',
    };

    const result = await strategy.validate(payload);
    expect(result).toEqual({
      userId: 'user123',
      username: 'tester',
      role: 'ADMIN',
    });
  });
});

import { Test } from '@nestjs/testing';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { testMikroOrmConfig } from '../../src/config/mikro-orm.config';
import { VerifyEmailHandler } from '../../src/features/auth/commands/verifyEmail/verify-email.handler';
import { User, UserRole } from '../../src/domain/user/user.entity';
import { EmailVerification } from '../../src/domain/auth/email-verification.entity';
import { VerifyEmailCommand } from '../../src/features/auth/commands/verifyEmail/verify-email.command';
import { AuthError } from '../../src/features/auth/auth.error';

describe('VerifyEmailHandler', () => {
  let handler: VerifyEmailHandler;
  let em: EntityManager;
  let orm: MikroORM;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(testMikroOrmConfig)],
      providers: [VerifyEmailHandler],
    }).compile();

    handler = moduleRef.get<VerifyEmailHandler>(VerifyEmailHandler);
    em = moduleRef.get<EntityManager>(EntityManager);
    orm = moduleRef.get<MikroORM>(MikroORM);
  });

  afterAll(async () => {
    await orm.close();
  });

  beforeEach(async () => {
    const fork = em.fork();

    // Clear previous test data
    await fork.execute('TRUNCATE TABLE "user" CASCADE');
    await fork.execute('TRUNCATE TABLE email_verification CASCADE');

    // Create test user
    const testUser = fork.create(User, {
      email: 'test@example.com',
      fullName: 'Test User',
      password: 'password',
      role: UserRole.CANDIDATE,
      isVerified: false,
    });

    // Create test verification
    fork.create(EmailVerification, {
      token: 'valid-token',
      expiresAt: new Date(Date.now() + 60 * 30 * 1000),
      user: testUser,
    });

    await fork.flush();
    fork.clear();
  });

  it('should successfully verify email when token is valid', async () => {
    // Arrange
    const command = new VerifyEmailCommand({ token: 'valid-token' });

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(result.isSuccess).toBe(true);

    // Verify database state
    const fork = em.fork();
    const updatedUser = await fork.findOne(User, {
      email: 'test@example.com',
    });
    const updatedVerification = await fork.findOne(EmailVerification, {
      token: 'valid-token',
    });

    expect(updatedUser?.isVerified).toBe(true);
    expect(updatedVerification?.usedAt).toBeDefined();
  });

  it('should fail when token is invalid', async () => {
    // Arrange
    const command = new VerifyEmailCommand({ token: 'invalid-token' });

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe(AuthError.InvalidToken);

    // Verify database state unchanged
    const fork = em.fork();
    const user = await fork.findOne(User, { email: 'test@example.com' });
    const verification = await fork.findOne(EmailVerification, {
      token: 'valid-token',
    });

    expect(user?.isVerified).toBe(false);
    expect(verification?.usedAt).toBeNull();
  });

  it('should fail when token is expired', async () => {
    const fork = em.fork();

    await fork.execute(`
        UPDATE email_verification
        SET expires_at = NOW() - INTERVAL '1 hour'
        WHERE token = 'valid-token'
      `);

    // Arrange
    const command = new VerifyEmailCommand({ token: 'valid-token' });

    //Act
    const result = await handler.execute(command);

    //Assert
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe(AuthError.InvalidToken);
  });
});

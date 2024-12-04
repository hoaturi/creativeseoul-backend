import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SignUpHandler } from './commands/signUp/sign-up.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../../domain/user/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([User]), JwtModule],
  controllers: [AuthController],
  providers: [SignUpHandler],
})
export class AuthModule {}

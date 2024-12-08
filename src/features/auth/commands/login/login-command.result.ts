import { AuthenticatedUserDto } from '../../dtos/authenticated-user.dto';
import { TokenPair } from './token-pair.interface';

export class LoginCommandResult {
  public readonly tokens: TokenPair;
  public readonly user: AuthenticatedUserDto;

  constructor(tokens: TokenPair, user: AuthenticatedUserDto) {
    this.tokens = tokens;
    this.user = user;
  }
}

import { IsString, Matches, MaxLength, Min, MinLength } from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'password only accepts a-z, A-Z, 0-9',
  })
  password: string;
}

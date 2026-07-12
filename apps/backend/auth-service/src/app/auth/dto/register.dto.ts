import {
  IsString,
  IsEmail,
  Length,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @Length(10, 10, { message: 'ID Card must be exactly 10 digits long' })
  @Matches(/^[0-9]+$/, { message: 'ID Card must contain only numbers' })
  idCard!: string;

  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+(@uce\.edu\.ec|@gmail\.com)$/, {
    message: 'Email must be exclusively @uce.edu.ec or @gmail.com',
  })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain at least one letter, one number, and one special character',
  })
  password!: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword!: string;
}

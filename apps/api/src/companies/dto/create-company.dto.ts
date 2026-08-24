import { IsString, IsUrl, Length, IsInt, Min } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @Length(1, 200)
  companyName: string;

  @IsUrl()
  website: string;

  @IsString()
  @Length(1, 100)
  industry: string;

  @IsInt()
  @Min(0)
  employeeCount: number;
}

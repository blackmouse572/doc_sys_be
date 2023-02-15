import { ApiProperty } from '@nestjs/swagger';
import { DocType, IssueMarkType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { Document } from '../entities/document.entity';

export class CreateDocumentDto extends Document {
  @IsEnum(DocType)
  @ApiProperty()
  type: DocType;

  @IsEnum(IssueMarkType)
  @ApiProperty()
  issueMark: IssueMarkType;

  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  dateRelease: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  dataAvailable: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  dateExpired: Date;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  content: string;
}

import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { FilterOperationType, FilterOrder } from '../filter.enum';
import {
  GeneratedFindOptions,
  IGeneratedFilter,
} from '../interface/filter.interface';

export interface IFilter<T = any> {
  filter?: Array<ISingleFilter<T>>;
  order?: Array<ISingleOrder<T>>;
  offset?: number;
  limit?: number;
}

export interface ISingleFilter<T = any> {
  field: keyof T & string;
  type: FilterOperationType;
  value: any;
}

export interface ISingleOrder<T = any> {
  field: keyof T & string;
  dir: FilterOrder;
}

export class SingleFilter<T = any> implements ISingleFilter<T> {
  @IsString()
  field!: keyof T & string;

  @IsEnum(FilterOperationType)
  type!: FilterOperationType;

  @IsDefined()
  value: any;
}

export class SingleOrder<T = any> implements ISingleOrder<T> {
  @IsString()
  field!: keyof T & string;

  @IsIn(['asc', 'desc'])
  dir!: FilterOrder;
}

export class SingleFilterOrder<T = any> implements ISingleOrder<T> {
  @IsString()
  field!: keyof T & string;
  @IsIn(['asc', 'desc'])
  dir!: FilterOrder;
}

export class Filter<T = any> implements IFilter<T> {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleFilter)
  @IsOptional()
  filter?: Array<SingleFilter<T>>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleFilterOrder)
  @IsOptional()
  order?: Array<SingleFilterOrder<T>>;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset = 0;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit = 100;
}

export class FilterDto<TWhereInput>
  extends Filter
  implements IGeneratedFilter<TWhereInput>
{
  // This will be set by filter pipe
  findOptions!: GeneratedFindOptions<TWhereInput>;
}

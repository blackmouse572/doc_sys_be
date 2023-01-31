import { IFilter } from '../dto/filter.dto';
import { FilterOrder } from '../filter.enum';

export type GeneratedFindOptions<TWhereInput> = {
  where: TWhereInput;
  skip: number | undefined;
  take: number | undefined;
  // This can be "any" because we might order by relations, therefore this will be an object
  orderBy: Array<{ [p in keyof TWhereInput]?: FilterOrder | any }>;
};

export interface IGeneratedFilter<TWhereInput> extends IFilter {
  findOptions: GeneratedFindOptions<TWhereInput>;
}

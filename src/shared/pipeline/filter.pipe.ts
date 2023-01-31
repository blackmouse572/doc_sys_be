import { Injectable, PipeTransform } from '@nestjs/common';
import { IFilter } from '../dto/filter.dto';
import { IGeneratedFilter } from '../interface/filter.interface';
import { FilterParser } from '../parse/filter.parse';

/**
 * This pipe transforms Tabulator-like filters (usually in query parameters) to a FilterDto for a specified model.
 * Instantiate this pipe with a mapping { [TabulatorFilterName]: PrismaFieldName}.
 * The output FilterDto will have a field findOptions, that can directly be used in prismaService.model.findMany(findOptions), but it is also
 * possible to change the find options first (e.g. include additional models or to limit the query).
 *
 * TDto defines the structure of the TabulatorFilter, TModel defines the used sequelize model (to offer typechecking).
 * It is also possible (and allowed) to use this pipe using FilterPipe<any, MySpecificModel> if there is no specific TDto
 * (e.g. the mapped filter names are the same as in the DB and a specific Dto is not needed because the filter is autogenerated, e.g. by Tabulator)
 *
 * It is also possible to add virtual fields that are not added to where clause automatically (i.e. when the queried field is not applied directly to the
 * entity, but to an included entity instead). See tenant/management/tenant.management.controller.ts (GET /) for an example.
 * To ensure ordering works correctly, you have to specify a model path for sequelize and specify the name of the virtual field in the Entity (dbName).
 * order is applied automatically, however, you'll have to add the where-clauses yourself to the relevant part of the findAll-options
 * (see tenant.management.service.ts for example). Usually you can use filterDto.getAllVirtualWhere(['virtual', 'field', 'names']) to get the partial where
 * clause used for these fields.
 *
 * See filter/filter.parser.ts for FilterParser implementation details.
 */
@Injectable()
export class FilterPipe<TDto, TWhereInput>
  implements PipeTransform<IFilter<TDto>, IGeneratedFilter<TWhereInput>>
{
  private readonly filterParser: FilterParser<TDto, TWhereInput>;

  constructor(mapping: { [p in keyof TDto]?: keyof TWhereInput & string }) {
    this.filterParser = new FilterParser<TDto, TWhereInput>(mapping);
  }

  public transform(value: IFilter<TDto>): IGeneratedFilter<TWhereInput> {
    return {
      ...value,
      findOptions: this.filterParser.generateQueryFindOptions(value),
    };
  }
}

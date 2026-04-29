import { Request, Response } from 'express';
import { ridesService } from '../../application/rides.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToPaginatedRidesListOutputDTO } from '../mappers/map-to-paginated-rides-list-paginated-output-dto.util';
import { matchedData } from 'express-validator';
import { GetRidesListQueryInputDTO } from '../input-dto/get-rides-list-query.input-dto';
import { applyDefaultPaginationSettings } from '../../../core/utils/apply-default-pagination-settings ';

export async function getRidesListHandler(req: Request<{}, {}, {}, GetRidesListQueryInputDTO>, res: Response) {
  try {
    const sanitizedQueryInput = matchedData<GetRidesListQueryInputDTO>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const sanitizedQueryInputWithDefaultPaginationSettings = applyDefaultPaginationSettings(sanitizedQueryInput);
    const { items, totalCount } = await ridesService.findMany(sanitizedQueryInputWithDefaultPaginationSettings);

    const paginatedRidesListOutput = mapToPaginatedRidesListOutputDTO(items, {
      pageNumber: sanitizedQueryInputWithDefaultPaginationSettings.pageNumber,
      pageSize: sanitizedQueryInputWithDefaultPaginationSettings.pageSize,
      totalCount,
    });

    res.send(paginatedRidesListOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}

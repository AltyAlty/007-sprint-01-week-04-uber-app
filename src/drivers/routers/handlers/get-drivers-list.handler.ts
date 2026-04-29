import { Request, Response } from 'express';
import { driversService } from '../../application/drivers.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToPaginatedDriversListOutputDTO } from '../mappers/map-to-paginated-drivers-list-output-dto.util';
import { matchedData } from 'express-validator';
import { applyDefaultPaginationSettings } from '../../../core/utils/apply-default-pagination-settings ';
import { GetDriversListQueryInputDTO } from '../input-dto/get-drivers-list-query.input-dto';

/*Функция-обработчик "getDriversListHandler()" для GET-запросов для получения данных по всем водителям при помощи
query-параметров.*/
export async function getDriversListHandler(req: Request<{}, {}, {}, GetDriversListQueryInputDTO>, res: Response) {
  try {
    /*Функция "matchedData()" из библиотеки express-validator берет из объекта "req" только те поля, которые ранее
    прошли через валидаторы и санитайзеры на основе библиотеки express-validator.*/
    const sanitizedQueryInput = matchedData<GetDriversListQueryInputDTO>(req, {
      /*Берем данные только из объекта "req.query".*/
      locations: ['query'],
      /*Включить опциональные поля, то есть те, для которых в валидаторах использовался метод "optional()", даже если
      они не пришли в запросе или были пропущены.*/
      includeOptionals: true,
    });

    /*Добавляем к объекту с query-параметрами поля, чтобы этот объект соответствовал типу
    "defaultPaginationSettingsType".*/
    const sanitizedQueryInputWithDefaultPaginationSettings = applyDefaultPaginationSettings(sanitizedQueryInput);
    /*Просим сервис "driversService" найти данные по водителям.*/
    const { items, totalCount } = await driversService.findMany(sanitizedQueryInputWithDefaultPaginationSettings);

    /*Преобразовываем данные по водителям из БД в подготовленные для пагинации данные по водителям.*/
    const paginatedDriversListOutput = mapToPaginatedDriversListOutputDTO(items, {
      pageNumber: sanitizedQueryInputWithDefaultPaginationSettings.pageNumber,
      pageSize: sanitizedQueryInputWithDefaultPaginationSettings.pageSize,
      totalCount,
    });

    /*Отправляем преобразованные для пагинации данные по водителям клиенту.*/
    res.send(paginatedDriversListOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
}

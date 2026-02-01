import type { Request, RequestHandler, Response } from 'express';
import { logger } from '@/common/lib/logger';
import { itemService } from './itemService';

class ItemController {
  public getItems: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await itemService.findAll();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getItem: RequestHandler = async (req: Request, res: Response) => {
    logger.debug(`GETITEM - Request params: ${JSON.stringify(req.params)}`);
    const itemId = req.params.itemId as string;
    const serviceResponse = await itemService.findByIdAsync(itemId);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createItem: RequestHandler = async (req: Request, res: Response) => {
    logger.debug(`CREATEITEM - Request body: ${JSON.stringify(req.body)}`);
    const itemData = req.body;
    const serviceResponse = await itemService.createItem(itemData);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateItem: RequestHandler = async (req: Request, res: Response) => {
    logger.debug(`UPDATEITEM - Request params: ${JSON.stringify(req.params)}`);
    logger.debug(`UPDATEITEM - Request body: ${JSON.stringify(req.body)}`);
    const itemId = req.params.itemId as string;
    const itemData = req.body;
    const serviceResponse = await itemService.updateItemByIdAsync(itemId, itemData);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteItem: RequestHandler = async (req: Request, res: Response) => {
    logger.debug(`DELETEITEM - Request parameter: ${JSON.stringify(req.params)}`);
    const itemId = req.params.itemId as string;
    const serviceResponse = await itemService.deleteItemByIdAsync(itemId);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const itemController = new ItemController();

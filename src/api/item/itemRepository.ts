import type { ItemCreatePayload, ItemUpdatePayload } from '@/api/item/itemModel';
import { ItemModel } from '@/api/item/itemModel';
import { logger } from '@/common/lib/logger';

export class ItemRepository {
  async findAllAsync(): Promise<ItemCreatePayload[]> {
    logger.debug('Fetching all items');
    return ItemModel.find({}).sort({ createdAt: -1 }).exec();
  }

  async findByIdAsync(id: string): Promise<ItemCreatePayload | null> {
    logger.debug(`Find by ID item with id: ${id}`);
    return ItemModel.findById(id).exec();
  }

  /**
   * Create a new item in the database
   * @param {Object} data - The data for the new item
   * @returns {Promise<Object>} - A promise that resolves to the new Item object
   */
  async createAsync(data: ItemCreatePayload): Promise<ItemCreatePayload> {
    const item = new ItemModel(data);
    return item.save();
  }

  async updateAsync(id: string, data: ItemUpdatePayload): Promise<ItemCreatePayload | null> {
    const updated = await ItemModel.findOneAndUpdate({ _id: id }, data);
    return updated;
  }

  async deleteByIdAsync(itemId: string): Promise<ItemCreatePayload | null> {
    const deleted = await ItemModel.findByIdAndDelete(itemId).exec();
    return deleted;
  }
}

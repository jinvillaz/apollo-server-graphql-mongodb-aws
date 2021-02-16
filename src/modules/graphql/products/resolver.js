import log4js from 'log4js';
import scapeStringRegex from 'escape-string-regexp';
import mongoose from 'mongoose';
import { UserInputError } from 'apollo-server-express';
import RoleValidator from '../role-validator';
import { CreateValidator, UpdateValidator } from './schema-validator';
import Utils from '../../../utils/utils';
import notificationHandler from '../../notification';

const logger = log4js.getLogger('ProductResolver');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const ANONYMUS = 'anonymus';

export default class ProductResolver {
  static Product;

  static SearchProduct;

  static Users;

  static loadModels() {
    ProductResolver.Product = mongoose.model('Product');
    ProductResolver.SearchProduct = mongoose.model('SearchProduct');
    ProductResolver.Users = mongoose.model('User');
  }

  static async getProducts(_, args) {
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = args;
    let query = args.query;
    if (!query || (query && query.length === 0)) {
      query = {};
    } else {
      const condition = { $regex: scapeStringRegex(query), $options: 'i' };
      query = {
        $or: [{ sku: condition }, { name: condition }, { brand: condition }],
      };
    }
    const options = {
      page,
      limit,
      lean: true,
      customLabels: {
        docs: 'products',
        page: 'currentPage',
      },
    };
    return await ProductResolver.Product.paginate(query, options);
  }

  static async getProduct(_, { id }, { user }) {
    if (!id || (id && !mongoose.Types.ObjectId.isValid(id))) return null;
    if (user.role === ANONYMUS) {
      try {
        const searchProductToSave = new ProductResolver.SearchProduct({ productId: id });
        logger.info('Save specific consulting product ', id);
        await searchProductToSave.save();
      } catch (ex) {
        logger.warn('Error to save search ', ex.message);
      }
    }
    return await ProductResolver.Product.findById(id);
  }

  static async addProduct(_, { query }, { user }) {
    RoleValidator.validateAdminUser(user);
    try {
      CreateValidator.validateSync(query);
      const { name, sku, brand, price } = query;
      const productToSave = new ProductResolver.Product({ name, sku, brand, price });
      return await productToSave.save();
    } catch (error) {
      throw new UserInputError(error.message);
    }
  }

  static async updateProduct(_, { id, query }, { user }) {
    RoleValidator.validateAdminUser(user);
    try {
      if (!id || (id && !mongoose.Types.ObjectId.isValid(id))) return null;
      const oldData = await ProductResolver.Product.findById(id).lean().exec();
      if (!oldData) return oldData;
      query = Utils.getValidData(query);
      UpdateValidator.validateSync(query);
      const newData = { ...query };
      query = {
        $set: { ...query },
      };
      const result = await ProductResolver.Product.findByIdAndUpdate(id, query, { new: true }).lean().exec();
      const users = await ProductResolver.Users.find({ $and: [{ role: 'admin' }, { _id: { $ne: user.id } }] });
      notificationHandler.sentProductNotification(users, oldData, newData);
      return result;
    } catch (error) {
      throw new UserInputError(error.message);
    }
  }

  static deleteProduct(_, { id }, { user }) {
    RoleValidator.validateAdminUser(user);
    if (!id || (id && !mongoose.Types.ObjectId.isValid(id))) return null;
    return ProductResolver.Product.findByIdAndDelete(id).exec();
  }
}

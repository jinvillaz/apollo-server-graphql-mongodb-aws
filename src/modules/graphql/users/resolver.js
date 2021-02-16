import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import log4js from 'log4js';
import scapeStringRegex from 'escape-string-regexp';
import mongoose from 'mongoose';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import RoleValidator from '../role-validator';
import { CreateValidator, UpdateValidator } from './schema-validator';

const logger = log4js.getLogger('UserResolver');

export default class UserResolver {
  static User;

  static loadModels() {
    UserResolver.User = mongoose.model('User');
  }

  static getUsers(_, { query }, { user }) {
    RoleValidator.validateAdminUser(user);
    if (!query || (query && query.length === 0)) {
      query = {};
    } else {
      const condition = { $regex: scapeStringRegex(query), $options: 'i' };
      query = {
        $or: [{ email: condition }, { name: condition }],
      };
    }
    return UserResolver.User.find(query);
  }

  static getUser(_, { id }, { user }) {
    RoleValidator.validateAdminUser(user);
    if (!id || (id && !mongoose.Types.ObjectId.isValid(id))) return null;
    return UserResolver.User.findById(id);
  }

  static async addUser(_, { query }, { user }) {
    RoleValidator.validateAdminUser(user);
    try {
      CreateValidator.validateSync(query);
      const { name, email, password } = query;
      logger.info(name, email, password);
      const userToSave = new UserResolver.User({ name, email, password: await bcrypt.hash(password, 10) });
      return await userToSave.save();
    } catch (error) {
      throw new UserInputError(error.message);
    }
  }

  static async updateUser(_, { id, query }, { user }) {
    RoleValidator.validateAdminUser(user);
    try {
      if (!id || (id && !mongoose.Types.ObjectId.isValid(id))) return null;
      const { name, password, email } = query;
      if (email) {
        throw new Error('The email cannot be updated.');
      }
      UpdateValidator.validateSync(query);
      query = {
        $set: {},
      };
      if (name) {
        query.$set.name = name;
      }
      if (password) {
        query.$set.password = await bcrypt.hash(password, 10);
      }
      return await UserResolver.User.findByIdAndUpdate(id, query, { new: true }).exec();
    } catch (error) {
      throw new UserInputError(error.message);
    }
  }

  static deleteUser(_, { id }, { user }) {
    RoleValidator.validateAdminUser(user);
    if (!id || (id && !mongoose.Types.ObjectId.isValid(id))) return null;
    return UserResolver.User.findByIdAndDelete(id).exec();
  }

  static async login(_, { email, password }) {
    try {
      const user = await UserResolver.User.findOne({ email });
      if (!user) {
        const message = `Invalid credentials [${email}]`;
        logger.warn(message);
        throw new Error(message);
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        const message = `Invalid credentials`;
        logger.warn(message);
        throw new Error(message);
      }
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1d',
      });
      return {
        token,
        user,
      };
    } catch (error) {
      throw new AuthenticationError(error.message);
    }
  }
}

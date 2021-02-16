import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import log4js from 'log4js';
import scapeStringRegex from 'escape-string-regexp';
import mongoose from 'mongoose';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { UserValidator } from '../user-validator';
import { CreateValidator, UpdateValidator } from './schema-validator';

const logger = log4js.getLogger('UserResolver');
const ANONYMUS = 'anonymus';

export default class UserResolver {
  static User;

  static loadModels() {
    UserResolver.User = mongoose.model('User');
  }

  static getUsers(_, { query }, { user }) {
    UserValidator.validateAdminUser(user);
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
    UserValidator.validateAdminUser(user);
    if (!id || (id && !mongoose.Types.ObjectId.isValid(id))) return null;
    return UserResolver.User.findById(id);
  }

  static async addUser(_, { query }, { user }) {
    UserValidator.validateAdminUser(user);
    try {
      CreateValidator.validateSync(query);
      const { name, email, password } = query;
      const userToSave = new UserResolver.User({ name, email, password: await bcrypt.hash(password, 10) });
      return await userToSave.save();
    } catch (error) {
      throw new UserInputError(error.message);
    }
  }

  static async updateUser(_, { id, query }, { user }) {
    UserValidator.validateAdminUser(user);
    try {
      if (!id || (id && !mongoose.Types.ObjectId.isValid(id))) return null;
      const userFounded = await UserResolver.User.findById(id).lean().exec();
      if (!userFounded) return userFounded;
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
    UserValidator.validateAdminUser(user);
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
      UserResolver.User.findByIdAndUpdate(user._id, { $push: { tokens: token } }).exec();
      return {
        token,
        user,
      };
    } catch (error) {
      throw new AuthenticationError(error.message);
    }
  }

  static async logout(_, args, { user, token }) {
    if (user.role === ANONYMUS) throw new AuthenticationError('Invalid credentials');
    await UserResolver.User.findOneAndUpdate({ tokens: token }, { $pull: { tokens: token } }, { multi: false }).exec();
    return 'Logout was success,';
  }
}

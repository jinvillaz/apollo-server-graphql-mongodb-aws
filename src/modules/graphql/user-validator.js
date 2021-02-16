import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import log4js from 'log4js';
import mongoose from 'mongoose';

const logger = log4js.getLogger('App');

const ANNONYMUS_USER = { role: 'anonymus' };

export class UserValidator {
  static validateAdminUser(user) {
    if (user.role !== 'admin') throw new AuthenticationError(`You don't have permission!`);
  }

  /**
   * Gets user from token.
   * @param {*} req param Express.
   */
  static async getUser({ req }) {
    let token = req.get('Authorization') || '';
    token = token.replace('Bearer ', '');
    try {
      if (token) {
        const User = mongoose.model('User');
        const userResult = await User.findOne({ tokens: token });
        if (!userResult) return { user: ANNONYMUS_USER };
        return { user: jwt.verify(token, process.env.JWT_SECRET), token };
      }
      return { user: ANNONYMUS_USER };
    } catch (error) {
      if (error.message.includes('jwt expired')) {
        logger.warn(error.message);
        const User = mongoose.model('User');
        await User.findOneAndUpdate({ tokens: token }, { $pull: { tokens: token } }, { multi: false }).exec();
      }
      return { user: ANNONYMUS_USER };
    }
  }
}

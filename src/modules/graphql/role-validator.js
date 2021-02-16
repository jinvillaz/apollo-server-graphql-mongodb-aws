import { AuthenticationError } from 'apollo-server-express';

export default class RoleValidator {
  static validateAdminUser(user) {
    if (user.role !== 'admin') throw new AuthenticationError(`You don't have permission!`);
  }
}

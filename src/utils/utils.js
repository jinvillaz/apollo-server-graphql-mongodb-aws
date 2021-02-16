import jwt from 'jsonwebtoken';

export default class Utils {
  /**
   * Gets user from token.
   * @param {*} req param Express.
   */
  static getUser(req) {
    try {
      let token = req.get('Authorization') || '';
      token = token.replace('Bearer ', '');
      if (token) {
        return { user: jwt.verify(token, process.env.JWT_SECRET) };
      }
      return { user: { role: 'anonymus' } };
    } catch (error) {
      return { user: { role: 'anonymus' } };
    }
  }

  /**
   * Gets a new object without empty values [null, undefined, '']
   * @param {*} data object to validate.
   */
  static getValidData(data = {}) {
    return Object.entries(data).reduce((a, [k, v]) => (v ? ((a[k] = typeof v == 'string' ? v.trim() : v), a) : a), {});
  }
}

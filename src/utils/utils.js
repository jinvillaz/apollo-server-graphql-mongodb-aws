export default class Utils {
  /**
   * Gets a new object without empty values [null, undefined, '']
   * @param {*} data object to validate.
   */
  static getValidData(data = {}) {
    return Object.entries(data).reduce((a, [k, v]) => (v ? ((a[k] = typeof v == 'string' ? v.trim() : v), a) : a), {});
  }

  /**
   * Compares two objects, validates if every value in the second is the same in the first object.
   * @param {*} a first param.
   * @param {*} b second param.
   * @returns true if they are equals the other way returns false.
   */
  static compare(a, b) {
    for (const [key, value] of Object.entries(b)) {
      if (a[key] !== value) return false;
    }
    return true;
  }
}

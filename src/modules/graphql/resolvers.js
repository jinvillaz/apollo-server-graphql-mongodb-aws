import UserResolver from './users/resolver';
import ProductResolver from './products/resolver';

export class Resolvers {
  static loadModels() {
    UserResolver.loadModels();
    ProductResolver.loadModels();
  }

  static getResolvers() {
    return {
      Query: {
        getUsers: UserResolver.getUsers,
        getUser: UserResolver.getUser,
        getProducts: ProductResolver.getProducts,
        getProduct: ProductResolver.getProduct,
      },
      Mutation: {
        addUser: UserResolver.addUser,
        updateUser: UserResolver.updateUser,
        deleteUser: UserResolver.deleteUser,
        login: UserResolver.login,
        addProduct: ProductResolver.addProduct,
        updateProduct: ProductResolver.updateProduct,
        deleteProduct: ProductResolver.deleteProduct,
      },
    };
  }
}

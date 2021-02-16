import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema;

const searchProductSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  },
  {
    timestamps: true,
  }
);
searchProductSchema.indexes();
searchProductSchema.plugin(uniqueValidator, { message: 'The {PATH} {VALUE} already exist.' });

const User = mongoose.model('SearchProduct', searchProductSchema);
export default User;

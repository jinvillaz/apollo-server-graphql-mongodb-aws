import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);
productSchema.indexes();
productSchema.plugin(uniqueValidator, { message: 'The {PATH} {VALUE} already exist.' });
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);
export default Product;

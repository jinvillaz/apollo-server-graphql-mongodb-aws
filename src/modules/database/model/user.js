import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: 'admin',
    },
    tokens: [String],
  },
  {
    timestamps: true,
  }
);
userSchema.indexes();
userSchema.plugin(uniqueValidator, { message: 'The {PATH} {VALUE} already exist.' });

const User = mongoose.model('User', userSchema);
export default User;

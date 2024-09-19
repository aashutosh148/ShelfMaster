import { Schema, model } from 'mongoose';
import Joi from 'joi';

const BorrowSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: Schema.Types.ObjectId, ref: 'Books', required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: {
    type: Date,
    default: function() {
      const now = new Date();
      return new Date(now.setDate(now.getDate() + 14));
    }
  },
  returnDate: { type: Date }
});

const Borrow = model('Borrow', BorrowSchema);

const validateBorrow = (data) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    book: Joi.string().required(),
    borrowDate: Joi.date().default(Date.now),
    dueDate: Joi.date().default(() => {
      const now = new Date();
      return new Date(now.setDate(now.getDate() + 14));
    }),
    returnDate: Joi.date().optional()
  });
  return schema.validate(data);
};

export { validateBorrow, Borrow };





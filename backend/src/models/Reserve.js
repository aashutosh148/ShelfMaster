import { Schema, model } from 'mongoose';
import Joi from 'joi';

const ReserveSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: Schema.Types.ObjectId, ref: 'Books', required: true },
  reserveDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'fulfilled', 'cancelled'], default: 'pending' }
});

const validateReserve = (data) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    book: Joi.string().required(),
    reserveDate: Joi.date().default(Date.now),
    status: Joi.string().valid('pending', 'fulfilled', 'cancelled').default('pending')
  });
  return schema.validate(data);
};

const Reserve = model('Reserve', ReserveSchema);

export { validateReserve, Reserve };

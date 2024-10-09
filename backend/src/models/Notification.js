import { model, Schema } from 'mongoose';
import Joi from 'joi';

const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

const validateNotification = (data) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    message: Joi.string().required(),
    read: Joi.boolean().default(false),
    date: Joi.date().default(Date.now)
  });
  return schema.validate(data);
};

export { validateNotification, Notification };


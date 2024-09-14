import { Schema, model } from 'mongoose';
import Joi from 'joi';


const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['admin',
      'user'],
    default: 'user'
  },

  borrowedBooks: [{
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book'
    },

    borrowDate: {
      type: Date,
      default: Date.now
    },

    dueDate: { type: Date }
  }],

  reservations: [{
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book'
    },

    reservedAt: {
      type: Date,
      default: Date.now
    }
  }],

  notifications: [{ type: String }],

  fines: [{
    fineId: {
      type: Schema.Types.ObjectId,
      ref: 'Fine'
    },

    fineAmount: { type: Number }
  }]
});

const User = model('User', UserSchema);

const validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'user').default('user'),
    borrowedBooks: Joi.array().items(Joi.object({
      bookId: Joi.string().required(),
      borrowDate: Joi.date().default(Date.now),
      dueDate: Joi.date().optional()
    })).optional(),
    reservations: Joi.array().items(Joi.object({
      bookId: Joi.string().required(),
      reservedAt: Joi.date().default(Date.now)
    })).optional(),
    notifications: Joi.array().items(Joi.string()).optional(),
    fines: Joi.array().items(Joi.object({
      fineId: Joi.string().required(),
      fineAmount: Joi.number().min(0).required()
    })).optional()
  });

  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};




export { User, validateUser, validateLogin };

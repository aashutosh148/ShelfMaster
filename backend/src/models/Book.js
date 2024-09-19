import { Schema, model } from 'mongoose';
import Joi from 'joi';


const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  genre: [{
    type: String
  }],
  publicationYear: {
    type: Number
  },
  totalCopies: {
    type: Number,
    default: 1
  },
  availableCopies: {
    type: Number,
    default: 1
  },
  borrowedBy: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    borrowedDate: {
      type: Date,
      default: Date.now()
    },
    dueDate: {
      type: Date
    }
  }]
});

const Books = model('Books', bookSchema);

const validateBook = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.array().items(Joi.string()).optional(),
    publicationYear: Joi.number().optional(),
    totalCopies: Joi.number().default(1),
    availableCopies: Joi.number().default(1),
    borrowedBy: Joi.array().items({
      userId: Joi.string().required(),
      borrowedDate: Joi.date().required(),
      dueDate: Joi.date().required()
    }).optional()
  });
  return schema.validate(data);
};


export { Books, validateBook };

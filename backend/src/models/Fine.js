import { Schema, model } from "mongoose";
import Joi from "joi";

const FineSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  paid: { type: Boolean, default: false },
});

const validateFine = (data) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    book: Joi.string().required(),
    amount: Joi.number().required(),
    reason: Joi.string().required(),
    paid: Joi.boolean().default(false),
  });
  return schema.validate(data);
}

const Fine = model("Fine", FineSchema);

export { validateFine, Fine };

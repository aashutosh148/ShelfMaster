import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  borrowedBooks: [{
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date }
  }],
  reservations: [{
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    reservedAt: { type: Date, default: Date.now }
  }],
  notifications: [{ type: String }],
  fines: [{
    fineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fine' },
    fineAmount: { type: Number }
  }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

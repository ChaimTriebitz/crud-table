const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({
   bank: { type: String },
   contact: { type: String },
   position: { type: String },
   category: { type: String, enum: ['category1', 'category2', 'category3'] },
   email: { type: String },
   cell: { type: Number },
   office: { type: Number },
   lender: { type: String },
   website: { type: String },
   loan: { type: String },
   territories: { type: String },
   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Bank', BankSchema);

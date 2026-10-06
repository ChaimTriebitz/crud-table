const mongoose = require('mongoose');

const LenderSchema = new mongoose.Schema({
   lender: { type: String },
   type: { type: [String], enum: ['CMBS', 'Construction Loan', 'Bank', 'Fund', 'Freddie Fannie', 'SBL'] },
   deal_size: { type: String },
   contact: { type: String },
   position: { type: String, enum: ['Team Leader', 'Assistant Vice President', 'Originator', 'Loan Officer', 'MANAGING DIRECTOR'] },
   office: { type: String },
   cell: { type: String },
   email: { type: String },
   notes: { type: String },
   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Lender', LenderSchema);

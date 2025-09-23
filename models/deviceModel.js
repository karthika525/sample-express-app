const mongoose = require('mongoose');
const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    warrantyMonths: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Device', deviceSchema);





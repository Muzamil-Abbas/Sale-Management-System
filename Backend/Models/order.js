import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['JazzCash', 'Easypaisa', 'Bank', 'Cash on Delivery'], required: true },
  status: { type: String, enum: ['Pending Payment', 'Paid', 'Failed'], default: 'Pending Payment' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;

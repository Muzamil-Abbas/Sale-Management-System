import Order from '../Models/order';

export const createPayment = async (req, res) => {
  try {
    const { cust_email, amount, method } = req.body;

    if (!cust_email || !amount || !method) {
      return res.status(400).json({ message: "Missing payment fields" });
    }

    let paymentUrl = "";

    if (method === "jazzcash") {
      // TODO: Integrate real JazzCash API here
      paymentUrl = `https://jazzcash.com/payment?amount=${amount}&email=${encodeURIComponent(cust_email)}`;
    } else if (method === "easypaisa") {
      // TODO: Integrate real Easypaisa API here
      paymentUrl = `https://easypaisa.com/payment?amount=${amount}&email=${encodeURIComponent(cust_email)}`;
    } else if (method === "bank") {
      // TODO: Provide actual bank payment instructions or link
      paymentUrl = `https://yourbank.com/pay?amount=${amount}&email=${encodeURIComponent(cust_email)}`;
    } else if (method === "cod") {
      // Create COD order in DB with pending payment status
      const order = new Order({
        customerEmail: cust_email,
        amount,
        paymentMethod: "Cash on Delivery",
        status: "Pending Payment",
      });
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Order placed successfully (Cash on Delivery)",
        orderId: order._id,
      });
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // For online payments, create order with Pending Payment status
    const order = new Order({
      customerEmail: cust_email,
      amount,
      paymentMethod: method.charAt(0).toUpperCase() + method.slice(1), // Capitalize
      status: "Pending Payment",
    });
    await order.save();

    return res.status(200).json({ paymentUrl, orderId: order._id });
  } catch (error) {
    console.error("Payment creation error:", error);
    return res.status(500).json({ message: "Server error during payment creation" });
  }
};

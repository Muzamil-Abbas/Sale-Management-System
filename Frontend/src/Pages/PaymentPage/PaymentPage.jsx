import React, { useState } from "react";
import Aside from '../../Components/Aside/Aside';
import baseUrl from '../../utils/baseurl';

const PaymentPage = () => {
  const [custEmail, setCustEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("jazzcash");
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    if (!custEmail || !amount) {
      setMessage("Please enter valid email and amount.");
      return;
    }

    try {
      if (paymentMethod === "cod") {
        const res = await fetch(`${baseUrl}/createCODOrder`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ cust_email: custEmail, amount }),
        });
        const data = await res.json();
        if (data.success) {
          setMessage("Order placed successfully (Cash on Delivery).");
        } else {
          setMessage("Failed to place COD order.");
        }
        return;
      }

      const res = await fetch(`${baseUrl}/createPayment`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          cust_email: custEmail,
          amount,
          method: paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setMessage("Failed to get payment URL");
      }
    } catch (error) {
      console.error(error);
      setMessage("Payment initiation failed");
    }
  };

  return (
    <div className='md:w-[80%] md:mx-auto'>
      <div className="drawer lg:drawer-open">
        <input id="sidebar_drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-6 bg-gray-900 text-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Make a Payment</h2>

          <input
            type="email"
            placeholder="Customer Email"
            value={custEmail}
            onChange={(e) => setCustEmail(e.target.value)}
            className="w-full border border-gray-700 bg-gray-800 text-white rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-700 bg-gray-800 text-white rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-700 bg-gray-800 text-white rounded-lg p-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="jazzcash">JazzCash</option>
            <option value="easypaisa">Easypaisa</option>
            <option value="bank">Bank Transfer</option>
            <option value="cod">Cash on Delivery</option>
          </select>

          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {paymentMethod === "cod" ? "Place COD Order" : "Pay Now"}
          </button>

          {message && (
            <div className="mt-4 text-red-400 text-center">{message}</div>
          )}
        </div>

        <div className="drawer-side md:h-[80vh] h-full">
          <label htmlFor="sidebar_drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <Aside />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

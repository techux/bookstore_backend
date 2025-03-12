import razorpay from '../utils/razorpay.js'

export const createOrder = async (req, res) => {
    try {
      const { amount, currency = 'INR', receipt = 'receipt_1' } = req.body;
  
      // Options for creating an order
      const options = {
        amount: amount * 100, // Convert amount to smallest currency unit (paise for INR)
        currency,
        receipt,
      };
  
      // Create the order with Razorpay
      const order = await razorpay.orders.create(options);
  
      // Send the created order as a response
      res.status(201).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to create order. Try again later.',
      });
    }
  }


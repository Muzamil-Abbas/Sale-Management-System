import User from '../Models/userModel.js';
import Sale from '../Models/salesModal.js';
import Product from '../Models/productModal.js';

// 🟢 Get All Sales for a User
export const getSalesController = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId }).populate("sales");
        if (!user) {
            return res.status(404).json({ status: false, message: "Unauthorized user" });
        }

        return res.status(200).json({ status: true, data: user.sales });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed getting sales data' });
    }
};

// 🟢 Create New Sale
export const createNewSaleController = async (req, res) => {
    try {
        const { cust_name, cust_email, cust_contact, cartItems } = req.body;

        const user = await User.findOne({ _id: req.user.userId });
        if (!user) {
            return res.status(404).json({ status: false, message: "Unauthorized user" });
        }

        // Create new sale
        const sale = await Sale.create({
            cust_name,
            cust_email,
            cust_contact,
            cartItems,
            userId: req.user.userId
        });

        // Add sale ID to user
        user.sales.push(sale._id);
        await user.save();

        // Update product stock
        for (let i = 0; i < cartItems.length; i++) {
            const product = await Product.findOne({ _id: cartItems[i].c_id });
            if (product) {
                product.p_stock -= cartItems[i].c_quantity;
                await product.save();
                console.log("Updated stock for:", cartItems[i].c_id);
            }
        }

        return res.status(200).json({ status: true, message: "Sale created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to create sales' });
    }
};

// 🟢 Delete Sale
export const deleteSaleController = async (req, res) => {
    try {
        const { salesId } = req.body;

        const user = await User.findOne({ _id: req.user.userId });
        if (!user) {
            return res.status(404).json({ status: false, message: "Unauthorized user" });
        }

        await Sale.deleteOne({ _id: salesId });

        // Remove from user.sales array
        const index = user.sales.indexOf(salesId);
        if (index > -1) {
            user.sales.splice(index, 1);
            await user.save();
        }

        return res.status(200).json({ status: true, message: "Sale deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to delete sales' });
    }
};

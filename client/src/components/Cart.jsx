/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';

const Cart = ({ isCollapsed, setIsCollapsed, cartItems, setCartItems }) => {
    const [cost, setCost] = useState(0);

    useEffect(() => {
        calculateTotalCost();
    }, [cartItems]);

    const calculateTotalCost = () => {
        let totalCost = 0;
        cartItems.forEach((product) => {
            totalCost += product.price;
        });
        setCost(totalCost);
    };

    const removeItem = (productId) => {
        const existingItem = cartItems.find(item => item.id === productId);

        if (existingItem) {
            setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
            toast.success("Item removed from cart");
        }
    }

    return (
        <>
            {!isCollapsed && (
                <motion.aside
                    initial={{ width: 0 }}
                    animate={{ width: 400 }}
                    exit={{ width: 0, transition: { delay: 0.7, duration: 0.3 } }}
                    className="overflow-auto max-h-screen min-h-screen fixed top-0 right-0 backdrop-blur-sm bg-[#ffffffde] p-6 z-50"

                >
                    <ClearIcon
                        className="block text-xl cursor-pointer"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    />
                    {cartItems.length ? cartItems.map((product, id) => (
                        <div className='hover:z-40 hover:shadow-md hover:rounded-md duration-300 hover:cursor-pointer p-2 flex gap-2 justify-between'>
                            <div className='w-24 h-24 p-5'>
                                <img src={product.image} alt="product" className='w-full h-full' />
                            </div>
                            <h1>{product.title.length > 20 ?
                                `${product.title.substring(0, 30)}...` : product.title
                            }</h1>

                            <p className='font-bold'>{"₹ "}{product.price}</p>
                            <button onClick={() => removeItem(product.id)}><DeleteIcon /></button>
                        </div>

                    )) : <p className="text-slate-500 p-4">Cart is empty</p>}
                    <div className="p-4 flex flex-col gap-3">
                        <hr className="h-2" />
                        <p className="font-bold">{"Total amount: ₹"}{cost}</p>
                        <button disabled className="hover:cursor-pointer border-2 rounded-sm bg-slate-50 p-2">checkout <ShoppingCartCheckoutIcon /></button>
                    </div>

                </motion.aside>
            )}
        </>
    );
};

export default Cart;

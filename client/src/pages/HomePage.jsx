import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import toast from 'react-hot-toast';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Cart from '../components/Cart';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const HomePage = () => {
    const navigate = useNavigate();
    const token = localStorage?.getItem("token");
    let user = null;
    if (token) {
        user = jwtDecode(localStorage?.getItem('token'))
    }
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('https://fakestoreapi.com/products');
                if (response.status !== 200) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                setProducts(response.data);
            } catch (error) {
                console.error('Axios error:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const toggleItem = (productId) => {
        const existingItem = cartItems.find(item => item.id === productId);

        if (existingItem) {
            // If the item is already in the cart, remove it
            setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
            toast.success("Item removed from cart");
        } else {
            // If the item is not in the cart, add it
            const productToAdd = products.find(product => product.id === productId);
            setCartItems(prevItems => [...prevItems, productToAdd]);
            toast.success("Item added to cart");
        }
    }

    if (loading) {
        return <CircularProgress />
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    }

    return (
        <div className="">
            <div className="flex gap-2 flex-col px-16 py-4">
                <div className='flex justify-end items-end gap-2'>
                    {token ? (
                        <>
                            {isHovered && (
                                <p className='opacity-80 z-20 shadow-md rounded-md px-1 flex flex-col absolute top-4 right-44'>
                                    <p>{user.name}</p>
                                    <p>{user.email}</p>
                                </p>
                            )}
                            <AccountCircleIcon
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className="text-xl cursor-pointer hover:cursor-pointer hover:opacity-60 mb-1"
                            />
                            <button onClick={handleLogout} className='hover:opacity-60 flex justify-center rounded bg-indigo-500 p-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400'>
                                {"Logout"}
                                <LogoutIcon />
                            </button>
                        </>
                    ) : (
                        <div className='flex gap-2'>
                            <Link to="/login" className='hover:opacity-60 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                {"Login "}

                            </Link>
                            <Link to="/signup" className='hover:opacity-60 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                {"Signup "}

                            </Link>
                        </div>

                    )}

                </div>
                <div className='flex flex-row justify-between'>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 py-4">All Products</h2>
                    <div className='relative'>
                        <p className='absolute left-4 top-3 opacity-50'>{cartItems.length}</p>
                        <button className='hover:opacity-50 hover:cursor-pointer py-5' onClick={() => setIsCollapsed(!isCollapsed)}><ShoppingCartIcon /></button>
                    </div>
                    <Cart
                        cartItems={cartItems}
                        setCartItems={setCartItems}
                        setIsCollapsed={setIsCollapsed}
                        isCollapsed={isCollapsed}
                    />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-4 xl:">
                    {products.length ? products.map((product, id) => (
                        <div className='hover:z-40 hover:shadow-md hover:rounded-md duration-300 hover:cursor-pointer p-2'>
                            <div className='w-full h-48 p-5'>
                                <img src={product.image} alt="product" className='w-full h-full' />
                            </div>
                            <h1>{product.title.length > 20 ?
                                `${product.title.substring(0, 30)}...` : product.title
                            }</h1>

                            <p className='font-bold'>{"₹ "}{product.price}</p>
                            <p className='text-sm text-slate-500'>{"Category: "}{product.category}</p>
                            <p className='text-slate-500'>
                                {product.description.length > 50 ?
                                    `${product.description.substring(0, 50)}...` : product.description
                                }
                            </p>
                            <div className='flex flex-row justify-between'>
                                <div className='flex gap-2 flex-row'>
                                    <p className='bg-red-400 text-white px-2 rounded-sm h-6'>{product.rating.rate}{"★"}</p>
                                    <p className='text-slate-500'>{"("}{product.rating.count}{")"}</p>
                                </div>
                                <button onClick={() => toggleItem(product.id)} className='hover:opacity-60 flex justify-center rounded bg-indigo-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400'>
                                    {cartItems.find(item => item.id === product.id) ? "Remove from cart" : "Add to cart"}
                                    <AddShoppingCartIcon />
                                </button>
                            </div>

                        </div>

                    )) : <p>No data</p>}
                </div>
            </div>
        </div >
    )
}

export default HomePage
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { useProducts, useAuth } from '../hooks/useReduxSelectors';
import { assets } from '../assets/assets';
import RelatedProduts from '../components/RelatedProduts';
import { toast } from 'react-toastify';

const Product = () => {
  const { productID } = useParams();
  const dispatch = useDispatch();
  const { products } = useProducts();
  const { token } = useAuth();
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const currency = 'LKR';

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productID) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  const handleAddToCart = async () => {
    if (!size) {
      toast.error('Select Product Size');
      return;
    }

    if (!token) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await dispatch(addToCart({ 
        itemId: productData._id, 
        size, 
        quantity: 1 
      })).unwrap();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productID, products]);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* Product info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button onClick={() => setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
              ))}
            </div>
          </div>
          <button onClick={handleAddToCart} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5'/>
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      
      {/* Review section*/}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>Elevate your everyday style with our Classic Cotton Crewneck T-Shirt — a wardrobe essential designed for comfort and versatility. Crafted from soft, breathable 100% cotton, this tee features a relaxed fit, reinforced stitching, and a timeless crew neckline. Whether you're layering it up or wearing it solo, it's perfect for any casual look.</p>
          <p>Stay cozy without compromising on style. Our Essential Fleece Pullover Hoodie is made with a soft cotton-blend fleece that keeps you warm and comfortable all day. Designed with a relaxed fit, spacious front pocket, and adjustable drawstring hood — it's your go-to layer for chilly days, casual outings, or lounging at home.</p>
        </div>
      </div>

      {/* display related products */}
      <RelatedProduts category={productData.category} subCategory={productData.subCategory}/>
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product;

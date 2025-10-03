import React from 'react';
import { Product, Language } from '../types';
import { TEXTS } from '../constants';

interface ProductCardProps {
  product: Product;
  language: Language;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, language }) => {
    const T = TEXTS[language];
    
    const getPriceLabel = () => {
        if(product.sellOrRent === 'rent') return ` / ${T.perHour}`;
        if(product.sellOrRent === 'sell') return ` (${T.fixedPrice})`;
        if(product.unit === 'kg') return ` / ${T.perKg}`;
        if(product.unit === 'litre') return ` / ${T.perLitre}`;
        return '';
    }

    return (
        <div className="bg-white dark:bg-gray-700/50 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
            <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover"/>
                <div className="absolute top-2 right-2 bg-green-100 dark:bg-green-900/80 text-green-800 dark:text-green-200 text-xs font-bold px-2 py-1 rounded-full capitalize">{T[product.category] || product.category}</div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex-grow">{product.name}</h3>
                
                {product.quantity && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{T.quantity}: {product.quantity} {product.unit}</p>}
                {product.expiryDate && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{T.expiryDate}: {product.expiryDate}</p>}
                
                <div className="mt-2 text-2xl font-extrabold text-green-600 dark:text-green-400">
                    ₹{product.price}<span className="text-base font-medium text-gray-500 dark:text-gray-400">{getPriceLabel()}</span>
                </div>

                <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    View Details
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
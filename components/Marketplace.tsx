import React, { useState, useMemo } from 'react';
import { Language, MarketplaceCategory, Product } from '../types';
import { TEXTS, MOCK_PRODUCTS } from '../constants';
import ProductCard from './ProductCard';
import SellForm from './SellForm';
import Notification from './Notification';
import { useNotifications } from '../hooks/useNotifications';
import { SearchIcon } from './icons';

interface MarketplaceProps {
  language: Language;
}

const Marketplace: React.FC<MarketplaceProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<MarketplaceCategory | 'all'>('all');
  const { notifications, addNotification } = useNotifications();

  const T = TEXTS[language];

  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts(prev => [newProduct, ...prev]);
    setActiveTab('buy');
    addNotification(T.productUploaded, 'success');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const categories = Object.values(MarketplaceCategory);

  return (
    <div className="container mx-auto">
      <Notification notifications={notifications} />
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{T.marketplace}</h2>
          <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
            <button onClick={() => setActiveTab('buy')} className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${activeTab === 'buy' ? 'bg-green-600 text-white shadow' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{T.buy}</button>
            <button onClick={() => setActiveTab('sell')} className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${activeTab === 'sell' ? 'bg-green-600 text-white shadow' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{T.sell}</button>
          </div>
        </div>

        {activeTab === 'buy' && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                 <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                 <input
                    type="text"
                    placeholder={T.searchProducts}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as MarketplaceCategory | 'all')}
                className="px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{T[cat] || cat}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} language={language} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sell' && (
          <SellForm onAddProduct={handleAddProduct} language={language} />
        )}
      </div>
    </div>
  );
};

export default Marketplace;
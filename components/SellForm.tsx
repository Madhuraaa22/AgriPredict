import React, { useState } from 'react';
import { Language, MarketplaceCategory, Product } from '../types';
import { TEXTS } from '../constants';

interface SellFormProps {
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  language: Language;
}

const SellForm: React.FC<SellFormProps> = ({ onAddProduct, language }) => {
  const [category, setCategory] = useState<MarketplaceCategory | ''>('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [sellOrRent, setSellOrRent] = useState<'sell' | 'rent'>('sell');
  const T = TEXTS[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    
    let unit = '';
    if (category === MarketplaceCategory.Crops || category === MarketplaceCategory.Fertilizers) unit = 'kg';
    if (category === MarketplaceCategory.Chemicals) unit = 'litre';
    if (category === MarketplaceCategory.Machineries) unit = sellOrRent === 'rent' ? 'hour' : 'fixed';

    const newProduct: Omit<Product, 'id'> = {
      category,
      name,
      price: parseFloat(price),
      image: image ? URL.createObjectURL(image) : 'https://picsum.photos/300/200',
      unit,
      ...( (category !== MarketplaceCategory.Machineries || (category === MarketplaceCategory.Machineries && sellOrRent ==='sell')) && { quantity: parseFloat(quantity) }),
      ...(category === MarketplaceCategory.Chemicals && { expiryDate }),
      ...(category === MarketplaceCategory.Machineries && { sellOrRent }),
    };
    onAddProduct(newProduct);
  };

  const categories = Object.values(MarketplaceCategory);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{T.sellYourProduct}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{T.category}</label>
          <select value={category} onChange={e => setCategory(e.target.value as MarketplaceCategory)} required className="w-full mt-1 p-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
            <option value="">{T.selectCategory}</option>
            {categories.map(cat => <option key={cat} value={cat}>{T[cat] || cat}</option>)}
          </select>
        </div>

        {category && (
          <>
            <InputField label={T.productName} value={name} onChange={e => setName(e.target.value)} required />

            {category === MarketplaceCategory.Machineries ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{T.sellOrRent}</label>
                <select value={sellOrRent} onChange={e => setSellOrRent(e.target.value as 'sell' | 'rent')} className="w-full mt-1 p-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition">
                  <option value="sell">{T.sell}</option>
                  <option value="rent">{T.rent}</option>
                </select>
                <InputField label={sellOrRent === 'rent' ? T.price + ` (${T.perHour})` : T.price + ` (${T.fixedPrice})`} type="number" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>
            ) : (
                <>
                <InputField label={`${T.quantity} (${category === MarketplaceCategory.Chemicals ? 'litres' : 'kg'})`} type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                <InputField label={`${T.price} (${category === MarketplaceCategory.Chemicals ? T.perLitre : T.perKg})`} type="number" value={price} onChange={e => setPrice(e.target.value)} required />
                </>
            )}

            {category === MarketplaceCategory.Chemicals && (
              <InputField label={T.expiryDate} type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} required />
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{T.image}</label>
              <input type="file" onChange={e => setImage(e.target.files ? e.target.files[0] : null)} className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 transition" />
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">{T.postAd}</button>
          </>
        )}
      </form>
    </div>
  );
};

const InputField: React.FC<{label: string, type?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean}> = ({label, type = 'text', value, onChange, required}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input type={type} value={value} onChange={onChange} required={required} className="w-full mt-1 p-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
    </div>
);

export default SellForm;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CheckCircle2 } from 'lucide-react';

export const ApplicationForm = ({ onComplete }: { onComplete: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    products: [] as string[],
  });

  const productOptions = [
    { id: 'ml', name: 'Mobile Legends Diamonds' },
    { id: 'ff', name: 'Free Fire Vouchers' },
    { id: 'gopay', name: 'GoPay Top-up' },
  ];

  const handleCheckboxChange = (id: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(id)
        ? prev.products.filter(p => p !== id)
        : [...prev.products, id]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Provide a default company name to ensure downstream components don't break
    onComplete({
      ...formData,
      companyName: 'Valued Partner',
      gtv: 'Standard'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Product Selection</h1>
        <p className="text-slate-500">Select the digital goods you wish to offer in your store</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <label className="text-sm font-bold text-slate-700">Requested Products</label>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {productOptions.map(product => (
                <label key={product.id} className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    checked={formData.products.includes(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                  />
                  <span className="ml-4 text-base text-slate-600 group-hover:text-slate-900 font-medium transition-colors">
                    {product.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-4 text-lg shadow-md"
            disabled={formData.products.length === 0}
          >
            Continue to Credentials
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};
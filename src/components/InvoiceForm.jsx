import { Calendar, Plus, Save, User, X } from 'lucide-react';
import React, { useState } from 'react'

const InvoiceForm = ({ invoice, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: invoice?.date || new Date().toISOString().split('T')[0],
    customerName: invoice?.customerName || '',
    products: invoice?.products || [{ name: '', quantity: 1, price: 0 }]
  });
  const [errors, setErrors] = useState({});

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: '', quantity: 1, price: 0 }]
    });
  };

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      const updated = formData.products.filter((_, i) => i !== index);
      setFormData({ ...formData, products: updated });
    }
  };

  const updateProduct = (index, field, value) => {
    const updated = formData.products.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    );
    setFormData({ ...formData, products: updated });
  };

  const calculateSubtotal = (product) => {
    return (product.quantity * product.price) || 0;
  };

  const calculateTotal = () => {
    return formData.products.reduce((total, product) => 
      total + calculateSubtotal(product), 0
    );
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    formData.products.forEach((product, index) => {
      if (!product.name) {
        newErrors[`product_${index}_name`] = 'Product name is required';
      }
      if (!product.quantity || product.quantity <= 0) {
        newErrors[`product_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (!product.price || product.price <= 0) {
        newErrors[`product_${index}_price`] = 'Price must be greater than 0';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const invoiceData = {
        ...formData,
        total: calculateTotal()
      };
      onSave(invoiceData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {invoice ? 'Edit Invoice' : 'Create New Invoice'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      errors.customerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter customer name"
                  />
                </div>
                {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Products</h3>
                <button
                  type="button"
                  onClick={addProduct}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.products.map((product, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => updateProduct(index, 'name', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                            errors[`product_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter product name"
                        />
                        {errors[`product_${index}_name`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`product_${index}_name`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 0)}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                            errors[`product_${index}_quantity`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`product_${index}_quantity`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`product_${index}_quantity`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={product.price}
                          onChange={(e) => updateProduct(index, 'price', parseFloat(e.target.value) || 0)}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                            errors[`product_${index}_price`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`product_${index}_price`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`product_${index}_price`]}</p>
                        )}
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtotal
                          </label>
                          <p className="text-lg font-semibold text-gray-900">
                            ${calculateSubtotal(product).toFixed(2)}
                          </p>
                        </div>
                        
                        {formData.products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="text-red-500 hover:text-red-700 p-2 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-indigo-600">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Save className="h-5 w-5" />
                  Save Invoice
                </button>
                
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm
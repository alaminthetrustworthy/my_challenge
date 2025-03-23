// import AirtimeForm from "@/components/AirtimeForm";

// export default function Home() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <AirtimeForm />
//     </div>
//   );
// }
// pages/index.js

import { useState } from 'react';
import { useForm } from 'react-hook-form';

const networks = ['MTN VTU', 'Airtel', 'Glo', '9mobile'];

export default function Home() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch("/api/airtime", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      if (response.ok) {
        setMessage('Transaction successful!');
      } else {
        setMessage(result.error || 'Something went wrong');
      }
    } catch (error) {
      setMessage('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Airtime Purchase</h1>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            {...register('phone', { 
              required: 'Phone number is required',
              pattern: {
                value: /^\d{11}$/,
                message: 'Enter a valid 11-digit phone number'
              }
            })}
            className="w-full p-2 border rounded"
            placeholder="08012345678"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Network (firstLevel) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Network</label>
          <select
            {...register('firstLevel', { required: 'Please select a network' })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Network</option>
            {networks.map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </select>
          {errors.firstLevel && (
            <p className="text-red-500 text-sm mt-1">{errors.firstLevel.message}</p>
          )}
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            {...register('amount', { 
              required: 'Amount is required',
              min: { value: 50, message: 'Minimum amount is 50' }
            })}
            className="w-full p-2 border rounded"
            placeholder="100"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Processing...' : 'Purchase Airtime'}
        </button>

        {/* {message && (
          <p className={mt-4 text-center ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}}>
            {message}
          </p>
        )} */}
      </form>
    </div>
  );
}
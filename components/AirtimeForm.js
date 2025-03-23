import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function AirtimeForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/airtime", {
        phone: data.phone,
        firstLevel: data.network, 
        amount: data.amount,
      });

      console.log("Response from backend:", response.data);
      setMessage(`Success: ${response.data.message}`);
    } catch (error) {
      console.error("Error purchasing airtime:", error.response?.data || error);
      setMessage(error.response?.data?.message || "Error: Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Buy Airtime</h2>
      {message && <p className="text-center mb-3 text-red-500">{message}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-1">Phone Number</label>
          <input
            type="tel"
            {...register("phone", { required: true, pattern: /^[0-9]{10,11}$/ })}
            className="w-full p-2 border rounded"
          />
          {errors.phone && <p className="text-red-500 text-sm">Enter a valid phone number</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Network</label>
          <select {...register("network", { required: true })} className="w-full p-2 border rounded">
            <option value="">Select Network</option>
            <option value="MTN VTU">MTN</option>
            <option value="AIRTEL VTU">Airtel</option>
            <option value="GLO VTU">Glo</option>
            <option value="9MOBILE VTU">9mobile</option>
          </select>
          {errors.network && <p className="text-red-500 text-sm">Please select a network</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            {...register("amount", { required: true, min: 50 })}
            className="w-full p-2 border rounded"
          />
          {errors.amount && <p className="text-red-500 text-sm">Enter a valid amount</p>}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading}>
          {loading ? "Processing..." : "Buy Airtime"}
        </button>
      </form>
    </div>
  );
}

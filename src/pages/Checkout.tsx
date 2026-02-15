import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { CheckCircle, MapPin, CreditCard, FileText } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../../utils/cn';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export const Checkout = () => {
  const { cartTotal, items, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [address, setAddress] = useState({
      fullName: user?.name || '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      phoneNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
        const orderData = {
            shippingAddress: address,
            paymentMethod: 'RAZORPAY',
            itemsPrice: cartTotal,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: cartTotal
        };

        const order = await ApiService.createOrder(orderData);
        
        const razorpayOrder = await ApiService.createPaymentOrder(order._id);

        const options = {
            key: razorpayOrder.key, 
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "Impulse",
            description: "Order Payment",
            order_id: razorpayOrder.id,
            handler: async function (response: any) {
                try {
                    await ApiService.verifyPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: order._id
                    });
                    
                    setIsSuccess(true);
                    clearCart();
                    setTimeout(() => navigate('/orders'), 3000);
                } catch (err) {
                    showToast("Payment verification failed", "error");
                    setIsProcessing(false);
                }
            },
            prefill: {
                name: address.fullName,
                email: user?.email,
                contact: address.phoneNumber
            },
            theme: {
                color: "#7c3aed"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        rzp.on('payment.failed', function (response: any){
            showToast(response.error.description, "error");
            setIsProcessing(false);
        });

    } catch (error: any) {
        console.error(error);
        showToast(error.response?.data?.message || "Order creation failed", "error");
        setIsProcessing(false);
    }
  };

  if (isSuccess) {
      return (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-in">
              <div className="mb-6 rounded-full bg-green-100 p-6 text-green-600 animate-bounce">
                  <CheckCircle className="h-16 w-16" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Confirmed!</h1>
              <p className="mt-2 max-w-md text-gray-500">Thank you for your purchase. Your order has been received.</p>
              <p className="mt-8 text-sm text-gray-400">Redirecting to orders...</p>
          </div>
      )
  }

  const steps = [
      { id: 1, name: 'Address', icon: MapPin },
      { id: 2, name: 'Summary', icon: FileText },
      { id: 3, name: 'Payment', icon: CreditCard }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Steps Indicator */}
      <div className="mb-12">
          <div className="flex items-center justify-center">
              {steps.map((step, index) => {
                  const isCompleted = step.id < currentStep;
                  const isCurrent = step.id === currentStep;
                  return (
                    <div key={step.id} className="flex items-center">
                         <div className={cn(
                             "flex flex-col items-center gap-2 relative z-10",
                             (isCompleted || isCurrent) ? "text-primary-600" : "text-gray-400"
                         )}>
                             <div className={cn(
                                 "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all",
                                 (isCompleted || isCurrent) ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20" : "border-gray-200 bg-white dark:bg-gray-800"
                             )}>
                                 <step.icon className="h-5 w-5" />
                             </div>
                             <span className="text-xs font-bold uppercase">{step.name}</span>
                         </div>
                         {index < steps.length - 1 && (
                             <div className={cn(
                                 "h-0.5 w-16 md:w-32 mx-2",
                                 isCompleted ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
                             )} />
                         )}
                    </div>
                  )
              })}
          </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
        <div className={cn("transition-opacity duration-300", currentStep !== 1 && "opacity-50 pointer-events-none lg:opacity-100 lg:pointer-events-auto")}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Shipping Information</h2>
          <form id="checkout-form" onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input type="text" name="fullName" required value={address.fullName} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
            </div>
            {/* Other form fields standard styles... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <input type="text" name="phoneNumber" required value={address.phoneNumber} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Street Address</label>
              <input type="text" name="street" required value={address.street} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                    <input type="text" name="city" required value={address.city} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                    <input type="text" name="state" required value={address.state} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Postal Code</label>
                    <input type="text" name="postalCode" required value={address.postalCode} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                     <input type="text" name="country" disabled value="India" className="mt-1 block w-full rounded-xl border border-gray-300 bg-gray-100 dark:bg-gray-900 px-4 py-3 shadow-sm sm:text-sm text-gray-500" />
                </div>
            </div>
          </form>
          {currentStep === 1 && (
             <Button type="button" className="mt-6 w-full py-4" onClick={() => setCurrentStep(2)}>Continue to Summary</Button>
          )}
        </div>

        <div className={cn("mt-10 lg:mt-0 transition-opacity duration-300", currentStep < 2 && "opacity-50 pointer-events-none lg:opacity-100")}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-card shadow-lg overflow-hidden">
                 <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
                    <ul className="divide-y divide-gray-100 dark:divide-gray-800 px-4 sm:px-6">
                        {items.map(item => (
                            <li key={item.product._id} className="flex py-6">
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white">
                                    <img src={item.product.image || item.product.images?.[0]} alt={item.product.name} className="h-full w-full object-cover object-center" />
                                </div>
                                <div className="ml-4 flex flex-1 flex-col justify-center">
                                    <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                        <h3 className="line-clamp-1">{item.product.name}</h3>
                                        <p>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                 </div>
                 <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-6 sm:px-6 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white mb-6">
                        <p>Total</p>
                        <p>₹{cartTotal.toLocaleString('en-IN')}</p>
                    </div>
                    {currentStep >= 2 && (
                         <Button type="submit" form="checkout-form" className="w-full py-4 text-lg shadow-xl shadow-primary-600/20" size="lg" isLoading={isProcessing}>
                            Pay securely with Razorpay
                        </Button>
                    )}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};
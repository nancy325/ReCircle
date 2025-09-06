"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { paymentAPI } from '@/lib/api';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  amount: number;
  currency?: string;
  productId?: string;
  onSuccess?: (paymentId: string, orderId: string) => void;
  onFailure?: (error: any) => void;
  disabled?: boolean;
  buttonText?: string;
}

export function RazorpayCheckout({
  amount,
  currency = 'INR',
  productId,
  onSuccess,
  onFailure,
  disabled = false,
  buttonText = 'Pay Now'
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (disabled) return;

    setLoading(true);
    try {
      // Create order from backend
      const orderResponse = await paymentAPI.createOrder({
        amount,
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          productId: productId || 'general_payment'
        }
      });

      if (!orderResponse.success) {
        throw new Error('Failed to create payment order');
      }

      const { order, key } = orderResponse;

      // Razorpay checkout options
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: 'ReCircle',
        description: 'Product Purchase',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verificationResponse = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResponse.success) {
              toast.success('Payment successful!');
              onSuccess?.(response.razorpay_payment_id, response.razorpay_order_id);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
            onFailure?.(error);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      // Check if Razorpay is loaded
      if (typeof window.Razorpay === 'undefined') {
        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        script.onerror = () => {
          toast.error('Failed to load payment gateway');
          setLoading(false);
        };
        document.body.appendChild(script);
      } else {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
      onFailure?.(error);
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading}
      className="w-full"
    >
      {loading ? 'Processing...' : buttonText}
    </Button>
  );
}

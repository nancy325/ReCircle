# Razorpay Payment Gateway Setup

## Environment Variables Required

Add the following environment variables to your `.env` file in the backend directory:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

## Getting Razorpay Keys

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings > API Keys
3. Generate your API Key ID and Key Secret
4. Add them to your `.env` file

## API Endpoints

The following payment endpoints are now available:

### Create Order
- **URL:** `POST /api/payment/create-order`
- **Body:**
```json
{
  "amount": 1000,
  "currency": "INR",
  "receipt": "receipt_123",
  "notes": {
    "productId": "123"
  }
}
```

### Verify Payment
- **URL:** `POST /api/payment/verify-payment`
- **Body:**
```json
{
  "razorpay_order_id": "order_xyz",
  "razorpay_payment_id": "pay_abc",
  "razorpay_signature": "signature_123"
}
```

### Get Payment Details
- **URL:** `GET /api/payment/payment/:paymentId`

## Frontend Integration

Use the `RazorpayCheckout` component in your React components:

```tsx
import { RazorpayCheckout } from '@/components/payments/razorpay-checkout';

function ProductPage() {
  return (
    <RazorpayCheckout
      amount={1000} // Amount in rupees
      productId="123"
      onSuccess={(paymentId, orderId) => {
        console.log('Payment successful:', paymentId, orderId);
      }}
      onFailure={(error) => {
        console.error('Payment failed:', error);
      }}
    />
  );
}
```

## Testing

Use Razorpay's test credentials for development:
- **Test Key ID:** `rzp_test_1234567890`
- **Test Key Secret:** `test_secret_1234567890`

## Production Deployment

1. Replace test keys with production keys
2. Update the API base URL in frontend
3. Ensure HTTPS is enabled for production
4. Test with small amounts first

## Security Notes

- Never expose your Razorpay Key Secret in frontend code
- Always verify payments on the backend using the signature
- Store payment details securely in your database
- Use HTTPS in production

// Iyzico payment integration
// Install: npm install iyzipay
// Docs: https://dev.iyzipay.com

export interface IyzicoPaymentRequest {
  price: string;
  paidPrice: string;
  currency: string;
  installment: string;
  basketId: string;
  paymentChannel: string;
  paymentGroup: string;
  callbackUrl: string;
  buyer: IyzicoBuyer;
  shippingAddress: IyzicoAddress;
  billingAddress: IyzicoAddress;
  basketItems: IyzicoBasketItem[];
  paymentCard: IyzicoPaymentCard;
}

export interface IyzicoBuyer {
  id: string;
  name: string;
  surname: string;
  gsmNumber: string;
  email: string;
  identityNumber: string;
  lastLoginDate?: string;
  registrationDate?: string;
  registrationAddress: string;
  ip: string;
  city: string;
  country: string;
  zipCode?: string;
}

export interface IyzicoAddress {
  contactName: string;
  city: string;
  country: string;
  address: string;
  zipCode?: string;
}

export interface IyzicoBasketItem {
  id: string;
  name: string;
  category1: string;
  category2?: string;
  itemType: string;
  price: string;
}

export interface IyzicoPaymentCard {
  cardHolderName: string;
  cardNumber: string;
  expireYear: string;
  expireMonth: string;
  cvc: string;
  registerCard?: string;
}

export interface IyzicoPaymentResponse {
  status: string;
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
  locale?: string;
  systemTime?: number;
  conversationId?: string;
  price?: number;
  paidPrice?: number;
  installment?: number;
  paymentId?: string;
  fraudStatus?: number;
  merchantCommissionRate?: number;
  merchantCommissionRateAmount?: number;
  iyziCommissionRateAmount?: number;
  iyziCommissionFee?: number;
  cardType?: string;
  cardAssociation?: string;
  cardFamily?: string;
  binNumber?: string;
  lastFourDigits?: string;
  basketId?: string;
  currency?: string;
  itemTransactions?: unknown[];
  authCode?: string;
  phase?: string;
  mdStatus?: number;
  hostReference?: string;
}

export async function processPayment(
  paymentData: IyzicoPaymentRequest
): Promise<IyzicoPaymentResponse> {
  // In production, this would be a server-side API call to Iyzico
  // NEVER expose API keys on the client side

  const response = await fetch('/api/payment/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error('Payment request failed');
  }

  return response.json();
}

export function buildPaymentRequest(params: {
  orderId: string;
  total: number;
  customerIp: string;
  buyer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
  items: Array<{ id: string; name: string; price: number }>;
  card: {
    cardHolderName: string;
    cardNumber: string;
    expireYear: string;
    expireMonth: string;
    cvc: string;
  };
}): IyzicoPaymentRequest {
  return {
    price: params.total.toFixed(2),
    paidPrice: params.total.toFixed(2),
    currency: 'TRY',
    installment: '1',
    basketId: params.orderId,
    paymentChannel: 'WEB',
    paymentGroup: 'PRODUCT',
    callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`,
    buyer: {
      id: params.buyer.email,
      name: params.buyer.firstName,
      surname: params.buyer.lastName,
      gsmNumber: params.buyer.phone,
      email: params.buyer.email,
      identityNumber: '11111111111', // TR ID - collect in production
      registrationAddress: params.buyer.address,
      ip: params.customerIp,
      city: params.buyer.city,
      country: 'Turkey',
    },
    shippingAddress: {
      contactName: `${params.shippingAddress.firstName} ${params.shippingAddress.lastName}`,
      city: params.shippingAddress.city,
      country: params.shippingAddress.country || 'Turkey',
      address: params.shippingAddress.address,
      zipCode: params.shippingAddress.zipCode,
    },
    billingAddress: {
      contactName: `${params.billingAddress.firstName} ${params.billingAddress.lastName}`,
      city: params.billingAddress.city,
      country: params.billingAddress.country || 'Turkey',
      address: params.billingAddress.address,
      zipCode: params.billingAddress.zipCode,
    },
    basketItems: params.items.map(item => ({
      id: item.id,
      name: item.name,
      category1: 'Clothing',
      itemType: 'PHYSICAL',
      price: item.price.toFixed(2),
    })),
    paymentCard: {
      cardHolderName: params.card.cardHolderName,
      cardNumber: params.card.cardNumber.replace(/\s/g, ''),
      expireYear: params.card.expireYear,
      expireMonth: params.card.expireMonth,
      cvc: params.card.cvc,
      registerCard: '0',
    },
  };
}

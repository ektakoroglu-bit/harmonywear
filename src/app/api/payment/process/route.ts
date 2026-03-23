import { NextRequest, NextResponse } from 'next/server';

// Iyzico server-side payment processing
// In production, set these in environment variables:
// IYZICO_API_KEY=your_api_key
// IYZICO_SECRET_KEY=your_secret_key
// IYZICO_BASE_URL=https://sandbox.iyzipay.com (sandbox) or https://api.iyzipay.com (production)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, total, buyer, shippingAddress, billingAddress, items, card } = body;

    // Validate required fields
    if (!orderId || !total || !buyer || !card) {
      return NextResponse.json(
        { status: 'failure', errorMessage: 'Missing required payment data' },
        { status: 400 }
      );
    }

    const apiKey = process.env.IYZICO_API_KEY;
    const secretKey = process.env.IYZICO_SECRET_KEY;
    const baseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox.iyzipay.com';

    if (!apiKey || !secretKey) {
      // Demo mode: simulate successful payment for development
      console.log('[DEMO] Payment processed for order:', orderId, 'Amount:', total);
      return NextResponse.json({
        status: 'success',
        paymentId: `DEMO-${orderId}`,
        basketId: orderId,
        price: total,
        paidPrice: total,
        currency: 'TRY',
        installment: 1,
        fraudStatus: 1,
        cardType: 'CREDIT_CARD',
        cardAssociation: 'VISA',
        lastFourDigits: card.cardNumber?.slice(-4) || '****',
      });
    }

    // Real Iyzico integration
    // Using dynamic require to avoid build errors when iyzipay is not installed
    let Iyzipay;
    try {
      const iyzipayModule = await import('iyzipay');
      Iyzipay = iyzipayModule.default;
    } catch {
      return NextResponse.json(
        { status: 'failure', errorMessage: 'Payment provider not configured' },
        { status: 500 }
      );
    }

    const iyzipay = new Iyzipay({
      apiKey,
      secretKey,
      uri: baseUrl,
    });

    const paymentRequest = {
      locale: 'tr',
      conversationId: orderId,
      price: total.toFixed(2),
      paidPrice: total.toFixed(2),
      currency: 'TRY',
      installment: '1',
      basketId: orderId,
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      paymentCard: {
        cardHolderName: card.cardHolderName,
        cardNumber: card.cardNumber,
        expireMonth: card.expireMonth,
        expireYear: card.expireYear,
        cvc: card.cvc,
        registerCard: '0',
      },
      buyer: {
        id: buyer.email,
        name: buyer.firstName,
        surname: buyer.lastName,
        gsmNumber: buyer.phone,
        email: buyer.email,
        identityNumber: '74300864791',
        lastLoginDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
        registrationDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
        registrationAddress: buyer.address,
        ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
        city: buyer.city,
        country: 'Turkey',
        zipCode: shippingAddress.zipCode || '34100',
      },
      shippingAddress: {
        contactName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        city: shippingAddress.city,
        country: shippingAddress.country || 'Turkey',
        address: shippingAddress.address,
        zipCode: shippingAddress.zipCode || '34100',
      },
      billingAddress: {
        contactName: `${billingAddress.firstName} ${billingAddress.lastName}`,
        city: billingAddress.city,
        country: billingAddress.country || 'Turkey',
        address: billingAddress.address,
        zipCode: billingAddress.zipCode || '34100',
      },
      basketItems: items.map((item: { id: string; name: string; price: number }) => ({
        id: item.id,
        name: item.name,
        category1: 'Clothing',
        itemType: 'PHYSICAL',
        price: item.price.toFixed(2),
      })),
    };

    return new Promise<NextResponse>((resolve) => {
      iyzipay.payment.create(paymentRequest, (err: Error | null, result: Record<string, unknown>) => {
        if (err) {
          console.error('Iyzico error:', err);
          resolve(NextResponse.json(
            { status: 'failure', errorMessage: 'Payment processing failed' },
            { status: 500 }
          ));
          return;
        }
        resolve(NextResponse.json(result));
      });
    });

  } catch (error) {
    console.error('Payment route error:', error);
    return NextResponse.json(
      { status: 'failure', errorMessage: 'Internal server error' },
      { status: 500 }
    );
  }
}

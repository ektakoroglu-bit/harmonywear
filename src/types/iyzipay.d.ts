declare module 'iyzipay' {
  interface IyzipayOptions {
    apiKey: string;
    secretKey: string;
    uri: string;
  }

  type IyzipayCallback = (err: Error | null, result: Record<string, unknown>) => void;

  class Iyzipay {
    constructor(options: IyzipayOptions);
    payment: {
      create: (request: Record<string, unknown>, callback: IyzipayCallback) => void;
    };
  }

  export = Iyzipay;
}

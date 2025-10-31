import 'yup';

declare module 'yup' {
  interface StringSchema {
    walletAddress(options?: { message?: string; allowLowercase?: boolean }): StringSchema;
  }
}
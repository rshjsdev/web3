import * as yup from 'yup';
import { isAddress } from 'viem';

yup.addMethod<yup.StringSchema>(yup.string, 'walletAddress', function (options?: {
  message?: string;
}) {
  const message = options?.message ?? 'Please, enter correct wallet address!';

  return this.test('walletAddress', message, function (value) {
    const { path, createError } = this;
    if (value == null || value === '') return true;

    if (!isAddress(value)) return createError({ path, message });
    return true;
  });
});
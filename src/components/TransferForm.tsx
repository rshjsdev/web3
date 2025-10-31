import { parseEther } from 'viem';
import { useSendTransaction, usePublicClient } from 'wagmi';
import { Section } from "./ui/Section";
import { Button } from "./ui/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '@/validation/walletAddress';
import { useTxStore } from '@/store/txStore';
import { toast } from "react-toastify";
import { useEffect, useRef } from 'react';
import { useGetUserBalance } from '@/hooks/useGetUserBalance';

interface TransferFormValues {
    address: string
    amount: number
}

const validationSchema: yup.ObjectSchema<TransferFormValues> = yup.object({
    address: yup
        .string()
        .required('Enter recipient address')
        .walletAddress(),
    amount: yup
        .number()
        .required('Amount is required')
        .positive('Amount must be positive')
        .typeError('Amount must be a number')
}) as yup.ObjectSchema<TransferFormValues>;

export const TransferForm = () => {
    const publicClient = usePublicClient();
    const { sendTransactionAsync } = useSendTransaction();
    const { fetchTransactions, addTransaction } = useTxStore();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { refetchTokenBalance } = useGetUserBalance()

    const {
        register,
        handleSubmit,
        formState,
        reset
    } = useForm<TransferFormValues>({
        mode: 'onSubmit',
        resolver: yupResolver(validationSchema),
    });

    const handleSend = async (data: TransferFormValues) => {
        const { address, amount } = data;

        try {
            const hash = await sendTransactionAsync({
                to: address as `0x${string}`,
                value: parseEther(amount.toString()),
            });

            addTransaction({
                hash,
                to: address,
                value: parseEther(amount.toString()).toString(),
                status: 'pending',
            });

            toast.success('Transaction sent!')
            reset();
            await publicClient.waitForTransactionReceipt({ hash });

            //setting timer to wait for Etherscan API to be ready
            refetchTokenBalance()
            timerRef.current = setTimeout(() => {
                fetchTransactions(address);
                timerRef.current = null;
            }, 30_000);


        } catch (err) {
            toast.error(`Something went wrong! ${err}`)
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, []);

    return (
        <Section>
            <h2 className="text-2xl font-bold mb-4">Send assets:</h2>
            <form onSubmit={handleSubmit(handleSend)} className="flex max-sm:flex-col md:items-center gap-4">
                <div className="relative pb-6 w-full grow">
                    <input
                        {...register('address')}
                        placeholder="Recipient address"
                        className="w-full outline-none border border-slate-200 px-4 py-2 rounded-xl focus:border-sky-300 duration-300"
                    />
                    {formState.errors.address && (
                        <span className="absolute bottom-0 left-0 text-red-500 text-xs mt-2 block">
                            {formState.errors.address.message}
                        </span>
                    )}
                </div>

                <div className="flex items-start max-sm:justify-between gap-4">
                    <div className="relative pb-6 w-full">
                        <input
                            {...register('amount')}
                            placeholder="Amount"
                            className="max-w-48 outline-none border border-slate-200 px-4 py-2 rounded-xl focus:border-sky-300 duration-300"
                        />
                        {formState.errors.amount && (
                            <span className="absolute bottom-0 left-0 text-red-500 text-xs mt-2 block">
                                {formState.errors.amount.message}
                            </span>
                        )}
                    </div>

                    <Button type="submit">
                        Send token
                    </Button>
                </div>
            </form>
        </Section>
    );
};
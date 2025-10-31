import { useEffect } from "react"
import { useAccount } from "wagmi"
import { Section } from "@/components/ui/Section"
import { Success } from "@/components/icons/Success"
import { Fail } from "@/components/icons/Fail"
import { useTxStore } from "@/store/txStore"
import { Pending } from "@/components/icons/Pending"
import BigNumber from "bignumber.js"
import { shortenAddress } from "@/utils/shortenAddress"
import { CopyButton } from "./ui/CopyButton"

const TOKEN_DECIMALS = 18

const statusIcons: Record<string, React.ReactNode> = {
    pending: <Pending />,
    success: <Success />,
    fail: <Fail />,
}

export const TxTable = () => {
    const { address } = useAccount()
    const { transactions, loading, fetchTransactions } = useTxStore()

    useEffect(() => {
        if (address) fetchTransactions(address)
    }, [address, fetchTransactions])

    return (
        <Section>
            <h2 className="text-2xl font-bold mb-4">Transfer history:</h2>

            {loading && <p>Loading transactions...</p>}

            {!loading && transactions.length === 0 && (
                <p className="text-gray-500">No transactions found</p>
            )}

            <table className="min-w-full shadow ">
                <thead className="bg-gray-100 rounded-tr-3xl rounded-lr-3xl">
                    <tr className="grid grid-cols-6 md:grid-cols-8">
                        <th className="px-4 py-2 text-left col-span-2">Hash</th>
                        <th className="px-4 py-2 text-left col-span-2 md:col-span-4">Recipient</th>
                        <th className="px-4 py-2 text-left truncate col-span-1">Amount</th>
                        <th className="px-4 py-2 text-left truncate col-span-1">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => {
                        return (<tr key={tx.hash} className="grid grid-cols-6 md:grid-cols-8">
                            <td className="px-4 py-2 col-span-2 flex gap-2">
                                <a
                                    className="block text-sm"
                                    href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >{shortenAddress(tx.hash)}</a>
                                <CopyButton text={tx.hash} />

                            </td>

                            <td className="px-4 py-2 col-span-2 md:col-span-4 flex gap-2">
                                <p className="md:hidden text-sm">{shortenAddress(tx.to)}</p>
                                <p className="hidden md:block text-sm">{tx.to}</p>
                                <CopyButton text={tx.to} />
                            </td>



                            <td className="px-4 py-2 col-span-1">
                                <p className="truncate"> {new BigNumber(tx.value).dividedBy(new BigNumber(10).pow(TOKEN_DECIMALS)).toString()}</p>
                            </td>

                            <td className="px-4 py-2 col-span-1">
                                {statusIcons[tx.status]}
                            </td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </Section>
    )
}
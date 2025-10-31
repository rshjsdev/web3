import { useAccount, useDisconnect } from "wagmi"
import { useGetUserBalance } from "@/hooks/useGetUserBalance"
import { Section } from "@/components/ui/Section"
import { Button } from "@/components/ui/Button"
import { CoinStack } from "@/components/icons/CoinStack"

export const UserData = () => {
    const { disconnect } = useDisconnect()
    const { address } = useAccount()
    const { tokenBalance, tokenSymbol, usdBalance, isLoading } = useGetUserBalance()

    return (
        <Section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="block truncate text-2xl font-bold">{address}</h2>
                <Button onClick={() => disconnect()}>Disconnect</Button>
            </div>

            <div className="flex items-center gap-12">
                <CoinStack size={48} />
                <div>
                    <p>ETH: {tokenBalance} {tokenSymbol}</p>
                    <p>{isLoading ? 'Loading...' : `USD: $${usdBalance?.toFixed(2)}`}</p>
                </div>
            </div>
        </Section>
    )
}
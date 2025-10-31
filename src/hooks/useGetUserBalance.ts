import { useState, useEffect } from "react"
import { useAccount, useBalance } from "wagmi"
import BigNumber from "bignumber.js"
import { coingeckoApi } from "@/utils/api"

export const useGetUserBalance = () => {
  const { address } = useAccount()
  const { data: tokenBalance, isLoading: isTokenLoading, refetch: refetchTokenBalance } = useBalance({
    address,
  })

  const [usdBalance, setUsdBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrice = async () => {
      if (!tokenBalance || !tokenBalance.value) return
      setIsLoading(true)
      try {

        const { data } = await coingeckoApi.get('/simple/price', {
          params: {
            ids: 'ethereum',
            vs_currencies: 'usd',
          },
        })

        const tokenPrice = data?.ethereum?.usd as number

        const tokenValue = new BigNumber(tokenBalance.value)
        const usd = tokenValue
          .dividedBy(new BigNumber(10).pow(tokenBalance.decimals))
          .times(tokenPrice)
          .toNumber()

        setUsdBalance(usd)
      } catch (err) {
        console.error(err)
        setError("Getting token price failed")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrice()
  }, [tokenBalance])

  return {
    tokenBalance: tokenBalance?.formatted,
    tokenSymbol: tokenBalance?.symbol,
    usdBalance,
    isLoading: isTokenLoading || isLoading,
    error,
    refetchTokenBalance
  }
}
import { create } from 'zustand'
import { type Transaction, type TransactionResponse } from '@/types/transaction'
import { etherscanApi } from '@/utils/api'
import { toast } from 'react-toastify'

interface TransactionsState {
  transactions: Transaction[]
  loading: boolean
  fetchTransactions: (address?: string) => Promise<void>
  clearTransactions: () => void
  addTransaction: (tx: Transaction) => void
}

export const useTxStore = create<TransactionsState>((set) => ({
  transactions: [],
  loading: false,

  fetchTransactions: async (address) => {
    if (!address) return
    set({ loading: true })

    try {
      const { data } = await etherscanApi.get('', {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          sort: 'desc',
          chainid: 11155111,
        },
      })

      if (data.status === '1') {
        const mappedTransactions = data.result.map((tx: TransactionResponse) => ({
          hash: tx.hash,
          to: tx.to,
          value: tx.value,
          status: tx.txreceipt_status === '1' ? 'success' : 'fail'
        }))

        set({ transactions: mappedTransactions })
      } else {
        console.warn('No data:', data.message)
        set({ transactions: [] })
      }
    } catch (err) {
      toast.error('Error fetching transactions')
      console.error(err)
    } finally {
      set({ loading: false })
    }
  },

  clearTransactions: () => set({ transactions: [] }),

  addTransaction: (tx) => {
    set((state) => ({
      transactions: [{ ...tx, status: 'pending' }, ...state.transactions],
    }))
  },
}))

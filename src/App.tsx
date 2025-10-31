import { useConnect, useAccount } from 'wagmi'
import { UserData } from './components/UserData'
import { TransferForm } from './components/TransferForm'
import { TxTable } from '@/components/TxTable'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const App = () => {
  const { connect, connectors } = useConnect()
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <Section>
        <h2 className='text-2xl font-bold mb-4 text-center'>Connect your Wallet</h2>
        <div className='flex items-center justify-center gap-4'>
          {connectors.map((connector) => (
            <Button key={connector.id} onClick={() => connect({ connector })}>
              Connect {connector.name}
            </Button>
          ))}
        </div>
      </Section>
    )
  }

  return (
    <>
      <UserData />
      <TransferForm />
      <TxTable />
      <ToastContainer />
    </>
  )
}
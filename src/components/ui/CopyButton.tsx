import { useState } from 'react'
import { Copy } from '@/components/icons/Copy'

interface CopyButtonProps {
  text: string
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button className='cursor-pointer' onClick={handleCopy}>
      <Copy size={copied ? 24 : 20 } />
    </button>
  )
}

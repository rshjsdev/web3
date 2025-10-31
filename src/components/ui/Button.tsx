import { type ReactNode, type ButtonHTMLAttributes } from "react"
import clsx from "clsx"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
}

export const Button = ({ children, className, ...props }: Props) => {
  return (
    <button {...props} className={clsx('bg-sky-100 hover:bg-sky-200 border border-sky-200 px-4 py-2 rounded-xl cursor-pointer duration-300 text-nowrap', className)}>{children}</button>
  )
}
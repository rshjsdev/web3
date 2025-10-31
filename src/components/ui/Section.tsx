import { type ReactNode } from "react"

interface Props {
  children: ReactNode
}

export const Section = ({ children }: Props) => {
  return (
    <section className="py-4 md:py-8">
      <div className="container mx-auto p-4 shadow-md rounded-2xl">
        {children}
      </div>
    </section>
  )
}
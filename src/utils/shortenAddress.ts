export const shortenAddress = (addr: string, fromStart = 6, fromEnd = -4) => {
  return addr?.length > 8 ? addr.slice(0, fromStart) + '...' + addr.slice(fromEnd) : addr
}

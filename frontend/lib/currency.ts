export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}

export const formatPriceWithDecimals = (price: number): string => {
  return `₹${price.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * @param value
 * @param decimals
 * @returns
 */
export function formatCurrency(value: number, decimals = 2): string {
    if (value === 0) return "$0.00"
  
    const absValue = Math.abs(value)
  
    // Format with suffixes for large numbers
    if (absValue >= 1000000000) {
      return `$${(value / 1000000000).toFixed(decimals)}B`
    } else if (absValue >= 1000000) {
      return `$${(value / 1000000).toFixed(decimals)}M`
    } else if (absValue >= 1000) {
      return `$${(value / 1000).toFixed(decimals)}k`
    }
  
    // Regular formatting for smaller numbers
    return `$${value.toFixed(decimals)}`
  }
  
  /**
   * @param value
   * @param decimals
   * @returns
   */
  export function formatNumber(value: number, decimals = 2): string {
    if (value === 0) return "0"
  
    const absValue = Math.abs(value)
  
    // Format with suffixes for large numbers
    if (absValue >= 1000000000) {
      return `${(value / 1000000000).toFixed(decimals)}B`
    } else if (absValue >= 1000000) {
      return `${(value / 1000000).toFixed(decimals)}M`
    } else if (absValue >= 1000) {
      return `${(value / 1000).toFixed(decimals)}k`
    }
  
    return value.toFixed(decimals)
  }
  
  
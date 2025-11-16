import { useMemo } from 'react'
import { calculate, type Config, type CalculationResult } from '../calc/finance'

/**
 * Custom hook that memoizes the expensive calculation function
 * Only recalculates when config changes
 */
export function useCalculation(config: Config): CalculationResult {
  return useMemo(() => {
    return calculate(config)
  }, [config])
}


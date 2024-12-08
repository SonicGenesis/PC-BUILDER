export interface ComponentFormData {
  id: string
  name: string
  price: number
  company: string
  image: string
  // CPU specific
  cores?: number
  threads?: number
  baseSpeed?: number
  boostSpeed?: number
  socket?: string
  tdp?: number
  // GPU specific
  memory?: number
  memoryType?: string
  coreClock?: number
  boostClock?: number
  length?: number
  // Motherboard specific
  formFactor?: string
  chipset?: string
  memoryMax?: number
  memorySlots?: number
  // RAM specific
  capacity?: number
  speed?: number
  type?: string
  modules?: number
  latency?: string
  voltage?: number
  [key: string]: any
} 
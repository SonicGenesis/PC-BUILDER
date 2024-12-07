'use client'

import { DialogProvider } from './GlobalDialog'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <DialogProvider>
            {children}
        </DialogProvider>
    )
} 
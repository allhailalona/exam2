import { createContext, useContext, useState } from 'react'

const OptionsContext = createContext<{
  fetchedCategories: string[]
  fetchedTenants: string[]
  fetchOptions: Promise<void>
} | null>(null)

export function OptionsProvider({ children }: { children: React.ReactNode }) {
  // Don't forget type annotation
  const [fetchedCategories, setFetchedCategories] = useState<string[]>([])
  const [fetchedTenants, setFetchedTenants] = useState<string[]>([])

  const fetchOptions = async (): Promise<void> => {
    const res = await fetch('http://localhost:3000/issues/fetch-options', {method: 'GET'})
    if (!res.ok) {
      // Handle other error codes accordingly, there are none in this case though...
      const errorData = await res.json()
      throw new Error (`Error 500 in front endpoint fetchOptions in OptionsContext.tsx: the cause is ${errorData}`)
    }

    const data = await res.json()
    console.log(data)
    setFetchedCategories(data.categories)
    setFetchedTenants(data.tenants)
  }

  return (
    <OptionsContext.Provider value={{fetchedCategories, fetchedTenants, fetchOptions}}>
      {children}
    </OptionsContext.Provider>
  )
}

// Create custom shortcut for using context 
export function useOptCtx() {
  return useContext(OptionsContext)
}
import { createContext, useContext, useState } from 'react'
import { IssuessTableRow } from '../../types'

const OptionsContext = createContext<{
  fetchedCategories: string[]
  fetchedTenants: string[]
  fetchedTable: IssuessTableRow[]
  fetchOptions: Promise<void>
  fetchTable: Promise<void>
} | null>(null)

export function OptionsProvider({ children }: { children: React.ReactNode }) {
  // Don't forget type annotation
  const [fetchedCategories, setFetchedCategories] = useState<string[]>([])
  const [fetchedTenants, setFetchedTenants] = useState<string[]>([])
  const [fetchedTable, setFetchedTable] = useState<IssuessTableRow[]>([])

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

  // Don't forget types!
  const fetchTable = async (): Promise<void> => {
    const res = await fetch('http://localhost:3000/issues/fetch-table', {method: 'GET'}) 
    if (!res.ok) {
      const errorData = res.json()
      throw new Error (`Error 500 in front endpoint fetchTable in OptionsContext.tsx: the cause is ${errorData}`)
    }
    const data = await res.json()
    setFetchedTable(data)
  }

  return (
    <OptionsContext.Provider value={{fetchedCategories, fetchedTenants, fetchedTable, fetchOptions, fetchTable}}>
      {children}
    </OptionsContext.Provider>
  )
}

// Create custom shortcut for using context 
export function useOptCtx() {
  return useContext(OptionsContext)
}
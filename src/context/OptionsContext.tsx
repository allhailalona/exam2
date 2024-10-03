import { createContext, useContext, useState } from 'react'

const OptionsContext = createContext(null)

export function OptionsProvider({ children }: { children: React.ReactNode }) {
  // Don't forget type annotation
  const [fetchedCategories, setFetchedCategories] = useState([])
  const [fetchedTenants, setFetchcedTenants] = useState([])

  const fetchOptions = async () => {
    console.log('im gay')
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
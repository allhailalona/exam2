import { useEffect } from 'react'
import { useOptCtx } from './context/OptionsContext'
import { Routes, Route } from 'react-router-dom'
import Navbar from './comps/Navbar'
import IssuesTable from './comps/IssuesTable'
import CreateIssueForm from './comps/CreateIssueForm'

export default function App() {
  const { fetchOptions } = useOptCtx()

  useEffect(() => {
    // Gonna use this one since I need an async func
    const spareFunc = async () => {
      console.log('App started, calling fetchOptions')
      fetchOptions()
    }

    spareFunc()
  }, [])

  return (
    <Routes>
      <Route path='/' element={
        <>
          <Navbar />
          <IssuesTable />
        </>
      }/>
      <Route path='/issues/create-issue' element={<CreateIssueForm />}/>
    </Routes>
  )
}
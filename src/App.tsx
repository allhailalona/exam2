import { Routes, Route } from 'react-router-dom'
import Navbar from './comps/Navbar'
import IssuesTable from './comps/IssuesTable'
import CreateIssueForm from './comps/CreateIssueForm'

export default function App() {
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
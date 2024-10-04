import { Link } from 'react-router-dom'
import { Button } from 'antd'

export default function Navbar() {
  return (
    <div className='p-2 px-4'>
      <Link to='/issues/create-issue'>
        <Button>Create Issue</Button>
      </Link>
    </div>
  )
}
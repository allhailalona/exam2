import { Link } from 'react-router-dom'
import { Button } from 'antd'

export default function Navbar() {
  return (
    <div>
      <Link to='/issues/create-issue'>
        <Button>Create Issue</Button>
      </Link>
    </div>
  )
}
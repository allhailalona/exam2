import { Link } from 'react-router-dom';
import { Button, Select, Form, notification, Input, Popconfirm } from 'antd';
import { useOptCtx } from '../context/OptionsContext';

export default function Navbar() {
  const { fetchedCategories, setFetchedModTable } = useOptCtx();
  console.log('hello from Navbar fc is', fetchedCategories);

  // Helper function to trigger notification
  const openNotificationWithIcon = (type: 'success' | 'error', message: string, description: string) => {
    notification[type]({
      message: message,
      description: description,
      placement: 'top',
      duration: 3, // Automatically close after 3 seconds
    });
  };
  
  const filterIssues = async (values: {categories: string}) => {
    const { categories } = values
    console.log('hello from filterIssues', categories)
    if (categories.length > 0) {
      // To add body in GET requests, we make use of queryParams
      const queryParams = new URLSearchParams({
        // Join selected categories with commas since the URL can't parse arrays syntax
        categories: categories.join(',')
      });
      // Parse syntax to URLs syntax with toString()
      const url = `http://localhost:3000/issues/filter-issues?${queryParams.toString()}`;
      console.log('URL:', url);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }, 
      })

      if (!res.ok) {
        const errorData = await res.json();
        openNotificationWithIcon('error', 'Submission Failed', `Error: ${errorData.message}`);
        throw new Error (`Error 500 in front endpoint filterIssues in Navbar.tsx: the cause is ${errorData}`)
      }

      const data = await res.json()
      console.log('front after fetch data is', data)
      setFetchedModTable(data)
    } else {
      setFetchedModTable([]) // Retrieve complete table if there are no filters
    }
  }

  const searchIssues = async (values: {query: string}) => {
    const { query } = values
    console.log('query is', query)

    if (query && query.trim() !== '') {
      const queryParams = new URLSearchParams({
        query: query
      })
      const url = `http://localhost:3000/issues/search-issues?${queryParams.toString()}`;
      const res = await fetch(url, {
        method: 'GET', 
        headers: {
          'Content-type': 'application/json'
        }
      })

      if (!res.ok) {
        const errorData = await res.json();
        openNotificationWithIcon('error', 'Submission Failed', `Error: ${errorData.message}`);
        throw new Error (`Error 500 in front endpoint searchIssues in Navbar.tsx: the cause is ${errorData}`)
      }

      const data = await res.json()
      setFetchedModTable(data)
    } else {
      setFetchedModTable([]) // Retrieve complete table if there are no query param
    }
  }

  const deleteAllIssues = async () => {
    const res = await fetch('http://localhost:3000/issues/delete-issues', {
      method: 'POST', 
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ action: 'deleteAll'})
    })
  }

  return (
    <div className='fixed top-0 left-0 right-0 z-50 bg-white p-2 px-4 h-[55px] flex items-center justify-between'>
      <div className="flex items-center">
        <Link to='/issues/create-issue'>
          <Button type="primary">Create Issue</Button>
        </Link>
        <Popconfirm
          title="This action will delete all CURRENTLY DISPLAYED tasks, Do you want to proceed?"
          placement='bottom'
          onConfirm={deleteAllIssues}
          onCancel={() => console.log('Deletion canceled')}
          okText="Yes"
          cancelText="No"
          overlayStyle={{ width: '300px' }} // Set your desired width here
        >
          <Button className='ml-4'>Delete all Issues</Button>
        </Popconfirm>
      </div>
      
      <div className="ml-4 flex-grow flex justify-between items-center gap-4">
        <Form onFinish={filterIssues} className='flex items-center'>
          <Form.Item name='categories' className='m-0 flex-grow'>
            <Select
              mode="multiple"
              placeholder='Filter categories' 
              options={fetchedCategories.map((category: string) => ({key: category, value: category}))} 
              style={{minWidth: '200px'}} 
            />
          </Form.Item>
          <Form.Item className='m-0 ml-2'>
            <Button type='primary' htmlType='submit'>Filter</Button>
          </Form.Item>
        </Form>

        <Form onFinish={searchIssues} className='flex items-center'>
          <Form.Item name='query' className='m-0 flex-grow'>
            <Input placeholder='Issue description' style={{minWidth: '200px'}} />
          </Form.Item>
          <Form.Item className='m-0 ml-2'>
            <Button type='primary' htmlType='submit'>Search</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

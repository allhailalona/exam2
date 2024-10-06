import { Link } from 'react-router-dom';
import { Button, Select, Form, notification } from 'antd';
import { useOptCtx } from '../context/OptionsContext';

export default function Navbar() {
  const { fetchedCategories, setFetchedFilteredTable } = useOptCtx();
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
  

  const filterIssues = async (values: {selected: string}) => {
    const { selected } = values
    console.log('hello from filterIssues', selected)
    if (selected.length > 0) {
      // To add body in GET requests, we make use of queryParams
      const queryParams = new URLSearchParams({
        // Join selected categories with commas since the URL can't parse arrays syntax
        categories: selected.join(','),
      });
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
      setFetchedFilteredTable(data)
    } else {
      setFetchedFilteredTable([]) // Retrieve complete table if there are no filters
    }
  }

  return (
    <div className='p-2 px-4 h-[35px] flex flex-row'>
      <Link to='/issues/create-issue'>
        <Button type="primary">Create Issue</Button>
      </Link>
      <Form
        onFinish={filterIssues}
        className='flex flex-row'
      >
        <Form.Item
          name='selected'
          className='min-w-[200px] max-w-[350px] ml-4'
        >
          <Select 
            mode="multiple"
            placeholder='Filter categories'
            options={fetchedCategories.map((category: string[]) => ({ key: category, value: category }))} // Ensure options are formatted correctly
          />
        </Form.Item>
        <Form.Item className='ml-2'>
          <Button type='primary' htmlType='submit'>
            Filter
          </Button>
        </Form.Item>
      </Form>
      
    </div>
  );
}

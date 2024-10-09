import { Form, Select, Input, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useOptCtx } from '../context/OptionsContext';

export default function CreateIssueForm() {
  const { fetchedCategories, fetchedTenants } = useOptCtx();
  const navigate = useNavigate();

  // Helper function to trigger notification
  const openNotificationWithIcon = (type: 'success' | 'error', message: string, description: string) => {
    notification[type]({
      message: message,
      description: description,
      placement: 'top',
      duration: 3, // Automatically close after 3 seconds
    });
  };

  const createIssue = async (values: { issueDesc: string; category: string; tenant: string }) => {
    const { issueDesc, category, tenant } = values;
    console.log('hello from createIssue values are', issueDesc, category, tenant)

    if (issueDesc && category && tenant) {
      const res = await fetch('http://localhost:3000/issues/create-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ issueDesc, category, tenant }),
      });

      if (res.ok) {
        openNotificationWithIcon('success', 'Issue Created', 'Your issue has been successfully created.');
        navigate('/');
        window.location.reload(true);
      } else {
        const errorData = await res.json();
        openNotificationWithIcon('error', 'Submission Failed', `Error: ${errorData.message}`);
        throw new Error (`Error 500 in front endpoint createIssue in CreateIssueForm.tsx: the cause is ${errorData}`)
      }
    } else {
      openNotificationWithIcon('error', 'Submission Error', 'Please fill out all the fields before submitting.');
    }
  };

  return (
    <Form
      onFinish={createIssue}
      className='h-screen w-screen flex flex-row gap-4 p-2 justify-center items-center bg-zinc-500'
    >
      <Form.Item
        name='issueDesc'
        className='w-[200px]'
      >
        <Input placeholder='Issue description' size='large' />
      </Form.Item>

      <Form.Item
        name='category'
        className='w-[200px]'
      >
        <Select placeholder='Select category' size='large'>
          {fetchedCategories.map((category: string) => (
            <Select.Option key={category} value={category}>
              {category}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name='tenant'
        className='w-[200px]'
      >
        <Select placeholder='Select tenant' size='large'>
          {fetchedTenants.map((tenant: string) => (
            <Select.Option key={tenant} value={tenant}>
              {tenant}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type='primary' size='large' onClick={() => navigate('/')}>
          Cancel
        </Button>
      </Form.Item>
      
      <Form.Item>
        <Button type='primary' htmlType='submit' size='large'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

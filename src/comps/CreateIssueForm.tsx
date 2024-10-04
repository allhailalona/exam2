import { useState } from 'react';
import { Form, Select, Input, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom'
import { useOptCtx } from '../context/OptionsContext';

export default function CreateIssueForm() {
  const [issueDesc, setIssueDesc] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTenant, setSelectedTenant] = useState<string>('');

  const { fetchedCategories, fetchedTenants } = useOptCtx();
  const navigate = useNavigate()

  // Helper function to trigger notification
  const openNotificationWithIcon = (type: 'success' | 'error', message: string, description: string) => {
    notification[type]({
      message: message,
      description: description,
      placement: 'top',
      duration: 3, // Automatically close after 3 seconds
    });
  };

  const createIssue = async () => {
    // Reset error before submission
    if (issueDesc.length > 0 && selectedCategory.length > 0 && selectedTenant.length > 0) {
      console.log('calling express createIssue');
      const res = await fetch('http://localhost:3000/issues/create-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ issueDesc, category: selectedCategory, tenant: selectedTenant }),
      });

      // Check if the response is in the 2xx range (success)
      if (res.ok) {
        // Clear form fields after successful submission
        setIssueDesc('');
        setSelectedCategory('');
        setSelectedTenant('');

        openNotificationWithIcon('success', 'Issue Created', 'Your issue has been successfully created.');
        navigate('/')
      } else {
        const errorData = await res.json();
        openNotificationWithIcon('error', 'Submission Failed', `Error: ${errorData.message}`);
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
      <Form.Item className='w-[200px]'>
        <Input
          placeholder='issue desc'
          onChange={(e) => setIssueDesc(e.target.value)}
          value={issueDesc}
          size='large'
        />
      </Form.Item>
      <Form.Item className='w-[200px]'>
        <Select
          placeholder='select category'
          size='large'
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
        >
          {fetchedCategories.map((category: string) => (
            <Select.Option key={category} value={category}>
              {category}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item className='w-[200px]'>
        <Select
          placeholder='select tenant'
          size='large'
          value={selectedTenant}
          onChange={(value) => setSelectedTenant(value)}
        >
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

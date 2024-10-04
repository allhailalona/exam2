import { useState } from 'react'
import { Form, Select, Input, Button } from "antd";
import { useOptCtx } from '../context/OptionsContext'

export default function CreateIssueForm() {
  const [issueDesc, setIssueDesc] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTenant, setSelectedTenant] = useState<string>('')

  const { fetchedCategories, fetchedTenants } = useOptCtx()
  console.log('hello from CreateIssueForm ', fetchedCategories, fetchedTenants)

  const createIssue = async () => {
    console.log('nothing for now')
  }

  return (
    <Form
      onFinish={createIssue}
      className='h-screen w-screen flex flex-row gap-4 p-2 justify-center items-center bg-zinc-500'
    >
      <Form.Item className='w-[200px]'>
        <Input placeholder='issue desc' onChange={(e) => setIssueDesc(e.target.value)} size='large'/>
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
        <Button type="primary" htmlType="submit" size='large'>
          Submit
        </Button>
    </Form.Item>
    </Form>
  )
}
import { useState } from 'react'
import { Select } from "antd";

export default function CreateIssueForm() {
  const [selectedCategory, setSelectedCategory] = useState<string>()

  return (
    <div>
      <Select 
        mode='multiple'
      />
    </div>
  )
}
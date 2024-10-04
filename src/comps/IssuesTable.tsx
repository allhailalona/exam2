  import { useOptCtx } from '../context/OptionsContext'
  import { Table, Button } from 'antd'
  import { cloneDeep } from 'lodash'
  import { IssuesTableRow } from '../../types'

  export default function IssuesTable() {
    const { fetchedTable } = useOptCtx()
    console.log('hello IssuesTable', fetchedTable)

    // Since it takes time to the data to load, we can't use Object.keys directly, and have to render something else until it loads....
    if (!fetchedTable || fetchedTable.length === 0) {
      return <div className='p-4'>No data available</div>
    }

    const clonedTable = cloneDeep(fetchedTable)
    
    const dataSource = clonedTable.map((row: IssuesTableRow) => ({
      ...row,
      key: row.id
    }))
    console.log('dataSource is', dataSource)


    const headers = Object.keys(clonedTable[0])
    console.log('headers are', headers)

    const columns = [
      {
        title: 'Action',
        key: 'action',
        width: 20,
        render: (text: string, record: IssuesTableRow) => (
          <Button onClick={() => console.log('I want to delete', record.id)} type="link" danger>
            X
          </Button>
        ),
      },
      ...headers.map((header: string) => ({
        title: header.charAt(0).toUpperCase() + header.slice(1), 
        dataIndex: header, 
        key: header
      }))
    ]

    console.log('columns are', columns)

    return (
      <Table className='p-4' dataSource={dataSource} columns={columns}/>
    )
  }
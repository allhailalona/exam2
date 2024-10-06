  import { useOptCtx } from '../context/OptionsContext'
  import { Table, Button } from 'antd'
  import { cloneDeep } from 'lodash'
  import { IssuesTableRow } from '../../types'

  export default function IssuesTable() {
    const { fetchedTable, fetchedModTable } = useOptCtx()
    console.log('fetchedTable is', fetchedTable, 'fetchedFiltelred is', fetchedModTable)

    // Since it takes time to the data to load, we can't use Object.keys directly, and have to render something else until it loads....
    if (!fetchedTable || fetchedTable.length === 0) {
      return <div className='p-4'>No data available</div>
    }

    const dataToDisplay = fetchedModTable.length > 0 ? fetchedModTable : fetchedTable;
    const clonedTable = cloneDeep(dataToDisplay)
    
    const dataSource = clonedTable.map((row: IssuesTableRow) => ({
      ...row,
      key: row.id
    }))

    const headers = Object.keys(clonedTable[0])

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

    return (
      <Table className='p-4 mt-[40px]' dataSource={dataSource} columns={columns}/>
    )
  }
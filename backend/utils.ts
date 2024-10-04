import mysql from 'mysql2/promise'
import { CategoryRow, TenantRow, Options, IssuesTableRow } from '../types'

// Config mysql connection, u could of course include those in dotenv
const connection = await mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'rootpassword',
  port: 3306,
  database: 'mydb'
})

export async function fetchOptions(): Promise<Options> {
  try {
    const [categoryRows] = await connection.execute<CategoryRow[]>('SELECT category_name FROM categories')
    const categories = categoryRows.map((row: CategoryRow) => row.category_name)

    const [tenantRows] = await connection.execute<TenantRow[]>('SELECT first_name, last_name FROM tenants')
    const tenants = tenantRows.map((row: TenantRow) => `${row.first_name} ${row.last_name}`)

    return {categories, tenants}
  } catch (err) {
    console.error('err in utils.ts fetchOptions func')
    throw err
  }
}

export async function fetchTable(): Promise<IssuesTableRow[]> {
  try { 
    const [rows] = await connection.execute('SELECT * FROM issues')
    return rows
  } catch (err) {
    console.error('err in utils.ts fetchTable func')
    throw err
  }
}

export async function createIssue(issueDesc: string, category: string, tenant: string) {
  try {
    const query = 'INSERT INTO issues (description, category, tenant) VALUES (?, ?, ?)'
    await connection.execute(query, [issueDesc, category, tenant])
    console.log('issue created')
  } catch (err) {
    console.error('err in createIssue utils.ts')
    throw err
  }
}
import mysql from 'mysql2/promise'
import { CategoryRow, TenantRow, Options } from '../types'

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
    // Don't forget types!
    const [categoryRows] = await connection.execute<CategoryRow[]>('SELECT category_name FROM categories')
    const categories = categoryRows.map((row: CategoryRow) => row.category_name)

    const [tenantRows] = await connection.execute<TenantRow[]>('SELECT first_name, last_name FROM tenants')
    const tenants = tenantRows.map((row: TenantRow) => `${row.first_name} ${row.last_name}`)

    const toReturn = {categories, tenants}
    console.log('utils.ts fetchOptions about to return ', toReturn)
    return toReturn
  } catch (err) {
    console.error('err in utils.ts fetchOptions func')
    throw err
  }
}
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

export async function filterIssues(filterCategories: string[]) {
  try {
    console.log('hello from filterIssues', filterCategories)
    const filteredIssues: IssuesTableRow[] = []
    for (const category of filterCategories) {
      console.log('current cat is', category)
      const [rows] = await connection.execute('SELECT * FROM issues WHERE category = ?', [category]);
      console.log('fetched data is', rows)
      filteredIssues.push(...(rows as IssuesTableRow[]));
    }
    return filteredIssues
  } catch (err) {
    console.error('err in filterIssuesin utils.ts')
    throw err
  }
}

export async function searchIssues(query: string) {
  try {
    const [rows] = await connection.execute(`
      SELECT * 
      FROM issues 
      WHERE CONCAT_WS(' ', id, description, category, tenant) LIKE ?
    `, [`%${query}%`]);
    return rows
  } catch (err) {
    console.error('err in utils.ts searchIssues')
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

export async function deleteIssues(toDelete?: number) {
  try {
    if (toDelete) {  
      const [res] = await connection.execute(
        'DELETE FROM issues WHERE id = ?', 
        [toDelete]
      );
      
      // Check if the row was deleted
      if (res.affectedRows === 0) {
        throw new Error('Couldn\'t find specified row');
      }
      console.log(`Deleted row with id ${toDelete}`);
    } else {
      // Delete all rows
      const [res] = await connection.execute('DELETE FROM issues');
      console.log(`Deleted ${res.affectedRows} rows`);
    }
  } catch (error) {
    console.error('Error deleting issues:', error);
    throw error;
  }
}
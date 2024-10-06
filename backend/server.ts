import express, {Request, Response} from 'express'
import cors from 'cors'
import { fetchOptions, fetchTable, createIssue, filterIssues, searchIssues, deleteIssues } from './utils'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/issues/fetch-options', async (req: Request, res: Response) => {
  try {
    const options = await fetchOptions()
    res.status(200).json(options)
  } catch (err) {
    const message = err.message || 'unknown error'
    res.status(500).json(message)
  }
})

app.get('/issues/fetch-table', async (req: Request, res: Response) => {
  try {
    const table = await fetchTable()
    res.status(200).json(table)
  } catch (err) {
    const message = err.message || 'unknown message'
    res.status(500).json(message)
  }
})

app.get('/issues/filter-issues', async (req: Request, res: Response) => {
  try {
    // Recieve data from query params as string
    const categories = req.query.categories as string

    // Convert it to an array
    const categoryArray = categories ? categories.split(',') : [];
    console.log('hello from server ', categoryArray)

    const filteredIssues = await filterIssues(categoryArray)
    res.status(200).json(filteredIssues)
  } catch (err) {
    const message = err.message || 'unknown error'
    res.status(500).json(message)
  }
})

app.get('/issues/search-issues', async (req: Request, res: Response) => {
  try {
    const query = req.query.query
    const foundIssues = await searchIssues(query)
    res.status(200).json(foundIssues)
  } catch (err) {
    const message = err.message || 'unknown error'
    res.status(500).json(message)
  }
})

app.post('/issues/create-issue', async (req: Request, res: Response) => {
  try {
    const { issueDesc, category, tenant} = req.body
    await createIssue(issueDesc, category, tenant)
    res.status(200).json('success')
  } catch (err) {
    const message = err.message || 'unknown error'
    res.status(500).json(message)
  }
})

app.post('/issues/delete-issues', async (req: Request, res: Response) => {
  try {
    console.log('req.body is', req.body)
    // Pass relevant args
    if (req.body.action === 'deleteAll') {
      await deleteIssues()
    } else if (req.body.action === 'deleteSpecific' && req.body.toDelete) {
      await deleteIssues(req.body.toDelete)
    }

    
  } catch (err) {
    const message = err.message || 'unknown message' 
    res.status(500).json(message)
  }
})

app.listen(3000, () => {
  console.log('listening on http://localhost:3000/')
})
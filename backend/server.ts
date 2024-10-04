import express, {Request, Response} from 'express'
import cors from 'cors'
import { fetchOptions, createIssue } from './utils'

const app = express()

app.use(cors())
app.use(express.json())

// Don't forget types!!!
app.get('/issues/fetch-options', async (req: Request, res: Response) => {
  try {
    const options = await fetchOptions()
    res.status(200).json(options)
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

app.listen(3000, () => {
  console.log('listening on http://localhost:3000/')
})
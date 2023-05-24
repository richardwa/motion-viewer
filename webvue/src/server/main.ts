import express from 'express'
import path from 'path'

const base = '/srv'
const args = process.argv.slice(2)
const app = express()

const port = args[0]
app.use(express.static(path.join(__dirname, '../client')))

app.get(`${base}/`, (req, res) => {
  res.send('Hello, World!')
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

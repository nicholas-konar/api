import app from '@app'
import { AppDataSource } from '@db/data-source'

const port = process.env.PORT || 3000

AppDataSource.initialize().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
})

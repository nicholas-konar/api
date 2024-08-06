import app from '@app'

let server: any

export const runServer = async () => {
  return new Promise(resolve => {
    server = app.listen(0, () => {
      resolve(server)
    })
  })
}

export const stopServer = async () => {
  return new Promise<void>((resolve, reject) => {
    server.close((err: any) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
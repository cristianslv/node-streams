import axios from "axios"
import { Transform, Writable } from 'stream'

const url = 'http://localhost:3000'

async function consume() {
  const response = await axios({
    url,
    method: 'get',
    responseType: 'stream'
  })

  return response.data
}

const stream = await consume()

stream
  .pipe(
    new Transform({
      transform(chunk, encoding, callback) {
        const data = JSON.parse(chunk)
        const myNumber = /\d+/.exec(data.name)[0]
        
        data.name = data.name.concat(myNumber % 2 === 0 ? ' é par' : ' é impar')  
        
        callback(null, JSON.stringify(data))
      }
    })
  )
  .pipe(
    new Writable({
      write(chunk, encoding, callback) {
        console.log("Já chegou o disco voadoooor", chunk.toString())

        callback()
      }
    })
  )
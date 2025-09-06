/* eslint-disable no-console */

import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'
// Xuwr lys socket real-time với socket.io
import socketIo from 'socket.io'
import http from 'http'

const START_SERVER = () => {
  const app = express()

  //Fix vụ Cache from dík của ExpressJS
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  //Cấu hình cookieParser
  app.use(cookieParser())

  app.use(cors(corsOptions))

  app.use(express.json())

  app.use('/v1', APIs_V1)

  //  Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  // Tạo một cái server mới bọc thằng app của express để làm real-time với socket.io
  const server = http.createServer(app)

  // app.listen(env.APP_PORT, env.APP_HOST, () => {

  //   console.log(`3. Hello ${env.AUTHOR}, I am running at ${ env.APP_HOST }:${ env.APP_PORT }/`)
  // })
  if (env.BUILD_MODE === 'production') {
    server.listen(process.env.PORT, () => {
    console.log(`3.Production:  Hello ${env.AUTHOR}, Back-end server is running at Port: ${process.env.PORT}`)
    })
  } else {
    server.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3.Local DEV:  Hello ${env.AUTHOR}, Back-end server is running successfully at Port: ${env.APP_HOST} and Port: ${env.APP_PORT}`)
    })
  }

  exitHook(() => {
    console.log('4. Server is shutting down...')
    CLOSE_DB()
    console.log('5. Disconnect to MongoDB Atlast')
  })
}

// Chỉ khi kết nối database thành công mới chạy Start serser
// Sử dụng IIFE(function ẩn danh gọi hàm ngay lập tất)
(async () => {
  try {
    console.log('1. Connect to MongoDB Atlast')
    await CONNECT_DB()
    console.log('2. Connect to MongoDB Atlast')
    // Khởi động server backend khi kết nối csdl thành 
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// CONNECT_DB()
//   .then(() => console.log('Connect to MongoDB Atlast'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })

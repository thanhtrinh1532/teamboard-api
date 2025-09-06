/* eslint-disable no-console */
/* eslint-disable no-unused-vars */


// mongodb+srv://thanhtrinhdev:OMVN5r0n4lS1c4Ur@cluster0.hg5w2au.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0


import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

let teamboardDatabaseInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
    minTLSVersion: 'TLS1_2'
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()
  console.log(env.MONGODB_URI)
  teamboardDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

export const GET_DB = () => {
  if (!teamboardDatabaseInstance) throw new Error('Phai ket noi csdl dau tien')
  return teamboardDatabaseInstance
}

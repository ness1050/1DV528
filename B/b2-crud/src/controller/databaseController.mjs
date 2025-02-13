import { database } from "../model/Database.mjs"

export const databaseController = {}

databaseController.connectDatabase = async () => {
  try {
    await database.connectDatabase()
  } catch (err) {
    console.log('Error connecting to MongoDB', err)
  }
}
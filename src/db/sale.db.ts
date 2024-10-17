import {
  enablePromise,
  openDatabase,
  SQLiteDatabase
} from "react-native-sqlite-storage"

// Enable promise for SQLite
enablePromise(true)

export const connectToDatabase = async () => {
  return openDatabase(
    { name: "sale.db", location: "default" },
    () => {},
    (error) => {
      console.error(error)
      throw Error("Could not connect to database")
    }
  )
}

export const createTables = async (db: SQLiteDatabase) => {
  const salesInfoQuery = `
    CREATE TABLE IF NOT EXISTS SalesInfo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT, 
        buyType TEXT, 
        amount TEXT, 
        fee TEXT, 
        crypto TEXT, 
        cryptoDescription TEXT, 
        quantity TEXT, 
        country TEXT, 
        countryDescription TEXT, 
        cpfCNPJ TEXT, 
        name TEXT, 
        address TEXT,
        userId INTEGER
    )
  `
  const usersQuery = `
   CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT,
      lastName TEXT,
      email TEXT,
      password TEXT
   )
  `
  try {
    await db.executeSql(salesInfoQuery)
    await db.executeSql(usersQuery)
  } catch (error) {
    console.error(error)
    throw Error(`Failed to create tables`)
  }
}


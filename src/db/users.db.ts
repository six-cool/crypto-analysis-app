import {
  SQLiteDatabase
} from "react-native-sqlite-storage"

export interface User {
  id?: Number;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}
export const addUser = async (db: SQLiteDatabase | null, user: User) => {
  const getQuery = `
    SELECT COUNT(*) as count FROM Users
    WHERE email = ?
  `
  try{
    db?.transaction(tx => {
      tx.executeSql(getQuery, [user.email], (tx, results) => {
        const count = results.rows.item(0).count;
        if(count > 0) throw Error("Email already exists");
        else {
          const insertQuery = `
            INSERT INTO Users (firstName, lastName, email, password)
            VALUES (?, ?, ?, ?)
          `
          const values = [
            user.firstName,
            user.lastName,
            user.email,
            user.password
          ]
          try {
            return db?.executeSql(insertQuery, values)
          } catch (error) {
            console.error(error)
            throw Error("Failed to add user")
          }
        }
      });
    });
  } catch (error) {
    console.error(error)
    throw Error("Failed to add user")
  }
  
}

export const getUsers = async (db: SQLiteDatabase | null): Promise<User[]> => {
  try {
    const users: User[] = []
    const results = await db?.executeSql("SELECT * FROM Users")
    results?.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        users.push(result.rows.item(index))
      }
    })
    return users
  } catch (error) {
    console.error(error)
    throw Error("Failed to get Users from database")
  }
}

export const getUser = async (db: SQLiteDatabase | null, user: User): Promise<User[]> => {
  try {
    const users: User[] = []
    const results = await db?.executeSql(`Select * from Users
    WHERE email = ?`, [user.email])
    results?.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        users.push(result.rows.item(index))
      }
    })
    return users
  } catch (error) {
    console.error(error)
    throw Error("Failed to get Users from database")
  }
}

export const updateUser = async (
  db: SQLiteDatabase | null,
  updatedUser: User
) => {
  const updateQuery = `
    UPDATE Users
    SET firstName = ?, lastName = ?, email = ?, password = ?
    WHERE id = ?
  `
  const values = [
    updatedUser.firstName,
    updatedUser.lastName,
    updatedUser.email,
    updatedUser.password,
    updatedUser.id
  ]
  try {
    return db?.executeSql(updateQuery, values)
  } catch (error) {
    console.error(error)
    throw Error("Failed to update user")
  }
}

export const deleteUser = async (db: SQLiteDatabase | null, user: User) => {
  const deleteQuery = `
    DELETE FROM Users
    WHERE id = ?
  `
  const values = [user.id]
  try {
    return db?.executeSql(deleteQuery, values)
  } catch (error) {
    console.error(error)
    throw Error("Failed to remove user")
  }
}
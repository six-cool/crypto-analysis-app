import {
  enablePromise,
  openDatabase,
  SQLiteDatabase
} from "react-native-sqlite-storage"

export interface SalesInfo {
  id?: Number;
  date?: string;
  buyType?: string;
  amount?: string;
  fee?: string;
  crypto?: string;
  cryptoDescription?: string;
  quantity?: string;
  country?: string;
  countryDescription?: string;
  cpfCNPJ?: string;
  name?: string;
  address?: string;
  userId?: Number;
}
export const addSalesInfo = async (db: SQLiteDatabase | null, salesinfo: SalesInfo) => {
  const insertQuery = `
   INSERT INTO SalesInfo (date, buyType, amount, fee, crypto, cryptoDescription, quantity, country, countryDescription, cpfCNPJ, name, address, userId)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
 `
  const values = [
    salesinfo.date || '',
    salesinfo.buyType || '',
    salesinfo.amount || '',
    salesinfo.fee || '',
    salesinfo.crypto || '',
    salesinfo.cryptoDescription || '',
    salesinfo.quantity || '',
    salesinfo.country || '',
    salesinfo.countryDescription || '',
    salesinfo.cpfCNPJ || '',
    salesinfo.name || '',
    salesinfo.address || '',
    salesinfo.userId
  ]
  try {
    return db?.executeSql(insertQuery, values)
  } catch (error) {
    console.error(error)
    throw Error("Failed to add salesinfo")
  }
}

export const getSalesInfos = async (db: SQLiteDatabase | null, userId: Number): Promise<SalesInfo[]> => {
  try {
    let salesinfos: SalesInfo[] = []
    const results = await db?.executeSql("SELECT * FROM SalesInfo WHERE userId = ?", [userId])
    results?.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        salesinfos.push(result.rows.item(index))
      }
    })
    return salesinfos
  } catch (error) {
    console.error(error)
    throw Error("Failed to get SalesInfos from database")
  }
}

export const getDataBetweenDates = async (db: SQLiteDatabase | null, startDate: string, endDate: string): Promise<SalesInfo[]> => {
  let salesinfos: SalesInfo[] = []
  db?.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM SalesInfo WHERE date BETWEEN date(?) AND date(?)',
      [startDate, endDate],
      (tx, results) => {
        const len = results.rows.length;
        console.log('Length of result:', len);
        for (let i = 0; i < len; i++) {
          const row = results.rows.item(i);
          salesinfos.push(row);
        }
      }
    );
  });
  return salesinfos;
}

export const updateSalesInfo = async (
  db: SQLiteDatabase | null,
  updatedSalesInfo: SalesInfo
) => {
  const updateQuery = `
    UPDATE SalesInfo
    SET date = ?, buyType = ?, amount = ?, fee = ?, crypto = ?, cryptoDescription = ?, quantity = ?, country = ?, countryDescription = ?, cpfCNPJ = ?, name = ?, address = ?
    WHERE id = ?
  `
  
  const values = [
    updatedSalesInfo.date || '',
    updatedSalesInfo.buyType || '',
    updatedSalesInfo.amount || '',
    updatedSalesInfo.fee || '',
    updatedSalesInfo.crypto || '',
    updatedSalesInfo.cryptoDescription || '',
    updatedSalesInfo.quantity || '',
    updatedSalesInfo.country || '',
    updatedSalesInfo.countryDescription || '',
    updatedSalesInfo.cpfCNPJ || '',
    updatedSalesInfo.name || '',
    updatedSalesInfo.address || '',
    updatedSalesInfo.id
  ]
  try {
    return db?.executeSql(updateQuery, values)
  } catch (error) {
    console.error(error)
    throw Error("Failed to update salesinfo")
  }
}

export const deleteSalesInfo = async (db: SQLiteDatabase | null, id: Number) => {
  const deleteQuery = `
    DELETE FROM SalesInfo
    WHERE id = ?
  `
  const values = [id]
  try {
    return db?.executeSql(deleteQuery, values)
  } catch (error) {
    console.error(error)
    throw Error("Failed to remove salesinfo")
  }
}
import React, {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  useEffect,
} from 'react';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { connectToDatabase, createTables } from '../db/sale.db';

type DBContextType = {
  db: SQLiteDatabase | null;
  setDB: Dispatch<SetStateAction<SQLiteDatabase | null>>;
  dbChanged: boolean;
  setDBChanged: Dispatch<SetStateAction<boolean>>;
};

const DBContext = createContext<DBContextType | undefined>(undefined);

function useDB(): DBContextType {
  const context = useContext(DBContext);
  if (!context) {
    throw new Error('useDB must be used within an DBProvider');
  }
  return context;
}

const DBProvider = (props: { children: ReactNode }): ReactElement => {
  const [db, setDB] = useState<SQLiteDatabase | null>(null);
  const [dbChanged, setDBChanged] = useState(false);
  const loadDB = async () => {
    const _db = await connectToDatabase();
    setDB(_db);
    await createTables(_db);
  };
  useEffect(() => {
    loadDB();
  }, []);
  return (
    <DBContext.Provider
      {...props}
      value={{ db, setDB, dbChanged, setDBChanged }}
    />
  );
};

export { DBProvider, useDB };

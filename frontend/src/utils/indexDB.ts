import { deleteDB, openDB, unwrap } from "idb";

const dbName = "listens_database";
const version = 1;

const dbPromise = openDB(dbName, version, {
  upgrade(db, oldVersion, newVersion, transaction) {
    db.createObjectStore("listens");
  },
});

export const getData = async (key: string) => {
  return (await dbPromise).get("listens", key);
};

export const setData = async (key: string, val: any) => {
  return (await dbPromise).put("listens", val, key);
};

export const deleteData = async (key: string) => {
  return (await dbPromise).delete("keyval", key);
};

// Delete the entire database
const deleteDatabase = async () => {
  await deleteDB(dbName);
};

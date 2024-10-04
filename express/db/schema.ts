import db from "../src/db";

// db.exec(`DROP TABLE IF EXISTS transactions;`);
// db.exec(`CREATE TABLE IF NOT EXISTS transactions (
//   hash TEXT PRIMARY KEY,
//   blockNumber TEXT NOT NULL,
//   timeStamp TEXT NOT NULL,
//   feeInUSDT REAL NOT NULL,
//   feeInETH REAL NOT NULL,
//   eth_to_usdt_rate REAL NOT NULL
// );`);

console.log(db.prepare(`SELECT * FROM transactions limit 10`).all())
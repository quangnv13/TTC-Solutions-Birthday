const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./database/database.json");
const db = low(adapter);

db.defaults({
  vouchers: [
    {
      code: "voucher-50",
      quantity: 42,
    },
    {
      code: "voucher-100",
      quantity: 134,
    },
    {
      code: "voucher-300",
      quantity: 20,
    },
    {
      code: "voucher-500",
      quantity: 3,
    },
    {
      code: "voucher-2000",
      quantity: 1,
    },
  ],
  wins: [],
}).write();

module.exports = db;
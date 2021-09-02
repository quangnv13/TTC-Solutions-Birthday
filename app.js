const express = require("express");
const app = express();
const db = require("./database/db");

app.use(express.static(`${__dirname}/node_modules`));
app.use(express.static(`${__dirname}/frontend`));

const winsData = db.get("wins");
const vouchersData = db.get("vouchers");
let voucher50Qty = vouchersData.find({ code: "voucher-50" }).value().quantity;
let voucher100Qty = vouchersData.find({ code: "voucher-100" }).value().quantity;
let voucher300Qty = vouchersData.find({ code: "voucher-300" }).value().quantity;
let voucher500Qty = vouchersData.find({ code: "voucher-500" }).value().quantity;
let voucher2000Qty = vouchersData
  .find({ code: "voucher-2000" })
  .value().quantity;

app.get("/get-gift", (req, res) => {
  const employeeCode = req.query.employeeCode.toUpperCase();
  try {
    if (employeeCode) {
      const checkEmployee = winsData.some({ employeeCode }).value();
      if (checkEmployee) {
        return res.status(400).json({
          message:
            "Mã nhân viên này đã tham gia chương trình! Vui lòng kiểm tra lại",
        });
      }
      const giftCodeRandom = getGiftCode();
      winsData
        .push({
          employeeCode,
          giftCodeRandom,
        })
        .write();
      return res.json({
        giftCode: giftCodeRandom,
      });
    }
    return res.status(400).json({
      message: "Mã nhân viên không hợp lệ! Vui lòng kiểm tra lại",
    });
  } catch (err) {
    return res.status(500).send({
      message: JSON.stringify(err),
    });
  }
});

app.get("/get-total", (req, res) => {
  try {
    const voucher50 = winsData
      .filter({ giftCodeRandom: "voucher-50" })
      .value().length;
    const voucher100 = winsData
      .filter({ giftCodeRandom: "voucher-100" })
      .value().length;
    const voucher300 = winsData
      .filter({ giftCodeRandom: "voucher-300" })
      .value().length;
    const voucher500 = winsData
      .filter({ giftCodeRandom: "voucher-500" })
      .value().length;
    const voucher2000 = winsData
      .filter({ giftCodeRandom: "voucher-2000" })
      .value().length;
    return res.json({
      voucher50,
      voucher100,
      voucher300,
      voucher500,
      voucher2000,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

app
  .listen(3000)
  .on("listening", () => console.log("Server is started on port 3000"));

function generateRandomNumbers(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getGiftCode() {
  const total = countTotal();
  if (total === 0) {
    return null;
  }
  let giftCode;
  const random = generateRandomNumbers(1, total);
  if (random <= voucher50Qty) {
    voucher50Qty--;
    giftCode = "voucher-50";
  } else if (random <= voucher50Qty + voucher100Qty) {
    voucher100Qty--;
    giftCode = "voucher-100";
  } else if (random <= voucher50Qty + voucher100Qty + voucher300Qty) {
    voucher300Qty--;
    giftCode = "voucher-300";
  } else if (
    random <=
    voucher50Qty + voucher100Qty + voucher300Qty + voucher500Qty
  ) {
    voucher500Qty--;
    giftCode = "voucher-500";
  } else {
    voucher2000Qty--;
    giftCode = "voucher-2000";
  }
  const voucher = vouchersData.find({ code: giftCode });
  const voucherQty = voucher.value().quantity;
  voucher.assign({ quantity: voucherQty - 1 }).write();
  console.log("Total gifts: ", total - 1);
  return giftCode;
}

function countTotal() {
  return (
    voucher50Qty +
    voucher100Qty +
    voucher300Qty +
    voucher500Qty +
    voucher2000Qty
  );
}

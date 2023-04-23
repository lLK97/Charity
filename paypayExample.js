const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const vnPay = require("vn-payment");

router.get("/", (req, res) => {
  const order = new Order(1000000, "Mua hàng", "http://localhost:3000/result");
  res.render("thanhtoan", { order: order });
});

router.post("/result", async (req, res) => {
  const { vnp_ResponseCode, vnp_TxnRef } = req.body;
  const vnpayConfig = {
    paymentGateway: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    merchant: "your_merchant_id",
    secureSecret: "your_secure_secret",
  };
  const vnpay = new vnPay(vnpayConfig);

  const data = {
    vnp_TxnRef: vnp_TxnRef,
    vnp_ResponseCode: vnp_ResponseCode,
  };
  const result = await vnpay.verifyReturnUrl(data);
  if (result) {
    // Xử lý kết quả thanh toán thành công
    res.send("Thanh toán thành công");
  } else {
    // Xử lý kết quả thanh toán thất bại
    res.send("Thanh toán thất bại");
  }
});

router.post("/", async (req, res) => {
  const order = JSON.parse(req.body.order);
  const vnpayConfig = {
    paymentGateway: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    merchant: "your_merchant_id",
    secureSecret: "your_secure_secret",
  };
  const vnpay = new vnPay(vnpayConfig);

  const data = {
    vnp_Amount: order.amount * 100,
    vnp_Command: "pay",
    vnp_CreateDate: new Date().toISOString().slice(0, 19).replace("T", ""),
    vnp_CurrCode: "VND",
    vnp_IpAddr: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    vnp_Locale: "vn",
    vnp_OrderInfo: order.description,
    vnp_ReturnUrl: order.returnUrl,
    vnp_TmnCode: vnpayConfig.merchant,
    vnp_TxnRef: Math.floor(Math.random() * 1000000000).toString(),
  };
  const paymentUrl = await vnpay.createPaymentUrl(data);
  res.redirect(paymentUrl);
});

module.exports = router;

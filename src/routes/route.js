const express = require('express')
// const { getAccessToken, makePayment, checkPaymentStatus, initiateTransaction, getTransactionDetails, getTransactionStatus} = require('../api/mvola')
// const payment = require('../api/mvola-api')
const router = express.Router();

// router.get("/get_access_token", async function (req, res){
//     res.setHeader("Content-type", "text/plain")
//     const token = await getAccessToken()
//     res.send(`Token ${token}`)
// })

// router.get("/payment", async function (req, res){
//     res.setHeader("Content-type", "text/plain")
//     const token = await getAccessToken()
//     const customerMSISDN = "0386549409";
//     const amount = "1000";
//     const description = "Paiement de test";
//     console.log("INITIALISATION")
//     const transaction = await initiateTransaction(token,customerMSISDN, amount, description);
//     if (transaction) {
//         console.log(transaction)
//         const transactionID = transaction.serverCorrelationId;
//         console.log("DETAILS")
//         await getTransactionDetails(token, transaction.serverCorrelationId);
//         console.log("STATUS")
//         await getTransactionStatus(token,transaction.serverCorrelationId);
//     }
// //    await payment()
//    res.send("VItA")
// })

module.exports = router;
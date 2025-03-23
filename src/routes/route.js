const express = require('express')
const verifyToken = require('../middlewares/authMiddleware');
// const { getAccessToken, makePayment, checkPaymentStatus, initiateTransaction, getTransactionDetails, getTransactionStatus} = require('../api/mvola')
// const payment = require('../api/mvola-api')
const router = express.Router();

router.get('/health-check', (req, res) => res.send('OK'));

router.get("/", function (req, res){
    res.setHeader("Content-type", "text/plain")
    res.send("Start server successfuly")
})

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

// Protected route
router.get('/verify', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed' });
});

module.exports = router;
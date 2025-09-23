import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

/**
 * Improved AML check logic
 * Returns:
 * - riskScore (0-100)
 * - riskRating (1-10)
 * - reason
 */
function amlCheck(data: any) {
    const transactions = data.transactions || [];
    const receivedTxs = transactions.filter((tx: any) => tx.transactionType === "received");
    const sentTxs = transactions.filter((tx: any) => tx.transactionType === "send");

    // Sum of amounts
    const totalReceived = receivedTxs.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);
    const totalSent = sentTxs.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);

    // Weighted risk score calculation
    // Received transactions are considered higher risk
    const receivedCountRisk = receivedTxs.length * 6;         // weight per tx
    const receivedAmountRisk = totalReceived / 10;           // weight based on total
    const sentCountRisk = sentTxs.length * 2;               // lower weight for sent
    const sentAmountRisk = totalSent / 50;                  // lower weight for sent amount

    let riskScore = receivedCountRisk + receivedAmountRisk + sentCountRisk + sentAmountRisk;
    riskScore = Math.min(100, Math.floor(riskScore));       // normalize to 0-100

    // Map 0-100 risk score to 1-10 scale
    const riskRating = Math.max(1, Math.ceil(riskScore / 10));

    // Reasoning
    let reason = "Low risk";
    if (riskScore >= 75) {
        reason = "High total received amount and/or frequent incoming transactions";
    } else if (riskScore >= 50) {
        reason = "Moderate total received amount and/or frequent incoming transactions";
    } else if (riskScore >= 25) {
        reason = "Some received transactions, monitor activity";
    }

    const compliant = riskScore < 50;

    return {
        recipientId: data.recipientId,
        riskScore,
        riskRating,
        compliant,
        receivedTxCount: receivedTxs.length,
        totalReceived,
        reason,
    };
}

app.post("/aml-check", (req, res) => {
    const amlData = req.body;
    const result = amlCheck(amlData);
    console.log(`AML Check for ${result.recipientId}: Risk Score = ${result.riskScore}, Risk Rating = ${result.riskRating}, Compliant = ${result.compliant ? "Yes" : "No"}, Reason = ${result.reason}`);
    res.json(result);
});

const PORT = process.env.AML_PORT || 5050;
app.listen(PORT, () => {
    console.log(`AML service running on port ${PORT}`);
});

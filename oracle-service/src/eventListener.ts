import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const RPC_URL = process.env.RPC_URL!;

/**
 * Fetch the last N unique transactions for a given address.
 */
async function getReceiverTxs(
    client: CosmWasmClient,
    address: string,
    limit: number = 10
) {
    const queries = [
        `transfer.recipient='${address}'`,
        `coin_received.receiver='${address}'`,
        `transfer.sender='${address}'`,
        `coin_spent.spender='${address}'`,
        `message.sender='${address}'`,
    ];

    const allTxs: any[] = [];
    for (const q of queries) {
        try {
            const res = await client.searchTx(q);
            if (Array.isArray(res) && res.length > 0) {
                allTxs.push(...res);
            }
        } catch {
            // ignore unsupported queries
        }
    }

    const txMap = new Map<string, any>();
    for (const tx of allTxs) {
        if (tx && tx.hash) txMap.set(tx.hash, tx);
    }

    const txs = Array.from(txMap.values())
        .sort((a: any, b: any) => Number(b.height ?? 0) - Number(a.height ?? 0))
        .slice(0, limit);

    return txs.map((tx: any) => ({
        hash: tx.hash,
        height: tx.height,
        events: Array.isArray(tx.events)
            ? tx.events
                .filter((e: any) => e.type === "wasm-send")
                .map((e: any) => ({
                    type: e.type,
                    attributes: Array.isArray(e.attributes) ? e.attributes : [],
                }))
            : [],
    }));
}

/**
 * Extract numeric value from amount string
 */
function parseAmount(raw: string | null | undefined): number | null {
    if (!raw) return null;
    const match = raw.match(/\d+/);
    return match ? Number(match[0]) : null;
}

/**
 * Format transactions into the required structure.
 */
function formatReceiverTxs(rawTxs: any[], recipient: string) {
    const transactions: Array<Record<string, any>> = [];

    for (const tx of rawTxs) {
        for (const event of tx.events || []) {
            const attrs: Record<string, string> = {};
            for (const a of event.attributes) {
                if (a && typeof a.key === "string") {
                    attrs[a.key] = a.value;
                }
            }

            const from = attrs["from"];
            const to = attrs["to"];
            const amountRaw = attrs["amount"] ?? null;
            const amount = parseAmount(amountRaw);

            if (to === recipient) {
                transactions.push({
                    hash: tx.hash,
                    receivedFrom: from ?? null,
                    amount,
                    transactionType: "received",
                });
            } else if (from === recipient) {
                transactions.push({
                    hash: tx.hash,
                    sentTo: to ?? null,
                    amount,
                    transactionType: "sent",
                });
            }
        }
    }

    return {
        recipientId: recipient,
        transactions,
    };
}

/**
 * Listen for wasm-send events in real-time and log relevant transactions.
 */
export async function listenForSendEventsRealtime() {
    const client = await CosmWasmClient.connect(RPC_URL);
    let lastHeight = await client.getHeight();
    console.log("Starting event listener at block:", lastHeight);

    setInterval(async () => {
        const currentHeight = await client.getHeight();

        if (currentHeight > lastHeight) {
            for (let h = lastHeight + 1; h <= currentHeight; h++) {
                const query = `tx.height=${h}`;
                const txs = await client.searchTx(query);

                for (const tx of txs) {
                    for (const event of tx.events || []) {
                        if (event.type === "wasm-send") {
                            const attrs: Record<string, string> = {};
                            for (const a of event.attributes || []) {
                                attrs[a.key] = a.value;
                            }

                            if (
                                attrs["_contract_address"] === CONTRACT_ADDRESS &&
                                attrs["action"] === "send"
                            ) {
                                console.log("Send event detected:", {
                                    from: attrs["from"],
                                    to: attrs["to"],
                                    amount: parseAmount(attrs["amount"]),
                                });

                                const rawTxs = await getReceiverTxs(client, attrs["to"], 20);
                                const formatted = formatReceiverTxs(rawTxs, attrs["to"]);

                                const fileName = `receiver_txs_${attrs["to"]}_${Date.now()}.json`;
                                fs.writeFileSync(fileName, JSON.stringify(formatted, null, 2));
                                console.log(`Written receiver transactions to ${fileName}`);
                            }
                        }
                    }
                }
            }
            lastHeight = currentHeight;
        }
    }, 5000);
}

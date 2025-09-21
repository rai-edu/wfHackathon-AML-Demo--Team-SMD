import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import dotenv from "dotenv";

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
    // Query for transfer.recipient and coin_received.receiver
    const transferTxs = await client.searchTx(`transfer.recipient='${address}'`);
    const coinReceivedTxs = await client.searchTx(`coin_received.receiver='${address}'`);

    // Merge and deduplicate transactions by hash
    const txMap: Record<string, any> = {};
    for (const tx of [...transferTxs, ...coinReceivedTxs]) {
        txMap[tx.hash] = tx;
    }

    // Sort by block height (descending) and take the latest `limit` transactions
    const txs = Object.values(txMap)
        .sort((a: any, b: any) => b.height - a.height)
        .slice(0, limit);

    return txs.map(tx => ({
        hash: tx.hash,
        height: tx.height,
        // events is an array of event objects just need "type" : "wasm-send" for each
        events: tx.events.filter((event: any) => event.type === "wasm-send").map((event: any) => ({
            type: event.type,
            attributes: event.attributes,
        })),
    }));
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
            // Iterate through new blocks
            for (let h = lastHeight + 1; h <= currentHeight; h++) {
                const query = `tx.height=${h}`;
                const txs = await client.searchTx(query);

                for (const tx of txs) {
                    for (const event of tx.events) {
                        if (event.type === "wasm-send") {
                            const attrs: Record<string, string> = {};
                            for (const a of event.attributes) {
                                attrs[a.key] = a.value;
                            }

                            // Filter events for our contract and "send" action
                            if (attrs["_contract_address"] === CONTRACT_ADDRESS && attrs["action"] === "send") {
                                console.log("Send event detected:", {
                                    from: attrs["from"],
                                    to: attrs["to"],
                                    amount: attrs["amount"],
                                });

                                // Fetch last 20 transactions for the receiver
                                const receiverTxs = await getReceiverTxs(client, attrs["to"], 20);
                                console.log(
                                    `Last 20 transactions for receiver (${attrs["to"]}):`,
                                    JSON.stringify(receiverTxs, null, 2)
                                );
                            }
                        }
                    }
                }
            }

            lastHeight = currentHeight;
        }
    }, 5000); // Poll every 5 seconds
}

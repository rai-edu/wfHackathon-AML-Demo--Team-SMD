import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import dotenv from "dotenv";

dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const RPC_URL = process.env.RPC_URL!;

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
                    for (const event of tx.events) {
                        if (event.type === "wasm-send") {
                            const attrs: Record<string, string> = {};
                            for (const a of event.attributes) {
                                attrs[a.key] = a.value;
                            }
                            if (attrs["_contract_address"] === CONTRACT_ADDRESS && attrs["action"] === "send") {
                                console.log("Send event detected:", {
                                    from: attrs["from"],
                                    to: attrs["to"],
                                    amount: attrs["amount"]
                                });
                            }
                        }
                    }
                }
            }
            lastHeight = currentHeight;
        }
    }, 5000); // Poll every 5 seconds
}

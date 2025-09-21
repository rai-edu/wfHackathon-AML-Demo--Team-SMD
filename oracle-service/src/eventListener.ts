import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import dotenv from "dotenv";

dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const RPC_URL = process.env.RPC_URL!;

export async function listenForSendEvents() {
    const client = await CosmWasmClient.connect(RPC_URL);
    let lastHeight = await client.getHeight();
    console.log("Starting event listener at block:", lastHeight);

    setInterval(async () => {
        const currentHeight = await client.getHeight();
        console.log(`Polling block height: ${currentHeight}`);
        if (currentHeight > lastHeight) {
            let foundEvent = false;
            // Query all transactions at each block height and filter for contract events in code
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
                            if (attrs["_contract_address"] === CONTRACT_ADDRESS) {
                                console.log("WASM-SEND event:", attrs);
                                foundEvent = true;
                            }
                            if (attrs["_contract_address"] === CONTRACT_ADDRESS && attrs["action"] === "send") {
                                console.log("Send event detected:", {
                                    from: attrs["from"],
                                    to: attrs["to"],
                                    amount: attrs["amount"]
                                });
                                foundEvent = true;
                            }
                        }
                    }
                }
            }
            if (!foundEvent) {
                console.log(`No contract events found from block ${lastHeight + 1} to ${currentHeight}`);
            }
            lastHeight = currentHeight;
        }
    }, 5000); // Poll every 5 seconds
}

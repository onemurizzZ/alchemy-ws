import { Alchemy, Network, AlchemySubscription } from "alchemy-sdk";
import * as dotenv from "dotenv";
dotenv.config();


const settings = {
  apiKey: process.env.ALCHEMY_WS_API_KEY, 
  network: Network.MATIC_MUMBAI,
};

const alchemy = new Alchemy(settings);

const pendingTx = [];

// pendingのトランザクションを監視
alchemy.ws.on(
    {
      method: AlchemySubscription.PENDING_TRANSACTIONS,
      toAddress: [
        process.env.REACT_APP_CREATEDAO,
        process.env.REACT_APP_OUTPUT_CONTRACT_ADDRESS,
        process.env.REACT_APP_PROPOSAL_CONTRACT_ADDRESS,
        process.env.REACT_APP_TASK_CONTRACT_ADDRESS,
        process.env.REACT_APP_UNYTE1155_CONTRACT_ADDRESS,
        process.env.REACT_APP_VOTE_CONTRACT_ADDRESS,
      ],
      hashesOnly: true,
    },
    (tx) => {
        pendingTx.push(tx);
        console.log(`リスト: ${pendingTx}`);
    }
);
  
// minedになったトランザクションを監視
alchemy.ws.on(
    {
        method: AlchemySubscription.MINED_TRANSACTIONS,
        addresses: [
            {
                to: process.env.REACT_APP_CREATEDAO,
            },
            {
                to: process.env.REACT_APP_OUTPUT_CONTRACT_ADDRESS,
            },
            {
                to: process.env.REACT_APP_PROPOSAL_CONTRACT_ADDRESS,
            },
            {
                to: process.env.REACT_APP_TASK_CONTRACT_ADDRESS,
            },
            {
                to: process.env.REACT_APP_UNYTE1155_CONTRACT_ADDRESS,
            },
            {
                to: process.env.REACT_APP_VOTE_CONTRACT_ADDRESS,
            }
        ],
        includeRemoved: false,
        hashesOnly: true,
    },
    (tx) => {
        const index = pendingTx.indexOf(tx['transaction']['hash']);
        if (index > -1) {
            pendingTx.splice(index, 1);
        }

        if (pendingTx.length === 0) {
            console.log("空っぽだぜ");
        }
        console.log(`リスト: ${pendingTx}`);
    }
);


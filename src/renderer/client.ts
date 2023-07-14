import {
  createTestClient,
  publicActions,
  walletActions,
  webSocket,
} from 'viem';
import { foundry } from 'viem/chains';

const transport = webSocket('ws://127.0.0.1:8545');

export const anvilClient = createTestClient({
  chain: foundry,
  mode: 'anvil',
  transport,
})
  .extend(publicActions)
  .extend(walletActions);

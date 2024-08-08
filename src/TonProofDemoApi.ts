import {
  Account,
  ConnectAdditionalRequest,
  SendTransactionRequest,
  TonProofItemReplySuccess
} from "@tonconnect/ui-react";
import './patch-local-storage-for-github-pages';
import { CreateJettonRequest } from "./server-js/src/dto/create-jetton-request-dto";

class TonProofDemoApiService {
  private localStorageKey = 'demo-api-access-token';

  private host = 'http://localhost:3001';

  public accessToken: string | null = null;

  public readonly refreshIntervalMs = 9 * 60 * 1000;

  constructor() {
    this.accessToken = localStorage.getItem(this.localStorageKey);

    if (!this.accessToken) {
      this.generatePayload();
    }
  }

  async generatePayload(): Promise<ConnectAdditionalRequest | null> {
    try {
      const response = await (
        await fetch(`${this.host}/api/generate_payload`, {
          method: 'POST',
        })
      ).json();
      return {tonProof: response.body.payload as string};
    } catch {
      return null;
    }
  }

  async checkProof(proof: TonProofItemReplySuccess['proof'], account: Account): Promise<void> {
    try {
      console.log('checkProof:', proof);
      const reqBody = {
        address: account.address,
        network: account.chain,
        public_key: account.publicKey,
        proof: {
          ...proof,
          state_init: account.walletStateInit,
        },
      };

      const response = await (
        await fetch(`${this.host}/api/check_proof`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reqBody),
        })
      ).json();

      if (response?.body.token) {
        localStorage.setItem(this.localStorageKey, response.body.token);
        this.accessToken = response.body.token;
      }
    } catch (e) {
      console.log('checkProof error:', e);
    }
  }

  async getAccountInfo(account: Account) {
    const response = await (
      await fetch(`${this.host}/api/get_account_info?userId=${JSON.stringify(account)}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
    ).json();

    return response as {};
  }

  async createJetton(jetton: object): Promise<SendTransactionRequest> {
    return await (
      await fetch(`${this.host}/api/create_jetton`, {
        body: JSON.stringify(jetton),
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
    ).json();
  }

  reset() {
    this.accessToken = null;
    localStorage.removeItem(this.localStorageKey);
    this.generatePayload();
  }
}

export const TonProofDemoApi = new TonProofDemoApiService();

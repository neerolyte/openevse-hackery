import { tokens } from "typed-inject";

const axios = require('axios').default;

export class OpenevseRawClient {
  constructor(private openevseUrl: string) {}
  public static inject = tokens('openevseUrl');

  async #rapiRequest(command: string): Promise<string> {
    return (await axios.get(`${this.openevseUrl}r?json=1&rapi=${command}`)).data.ret;
  }

  async getChargingEnabled(): Promise<boolean> {
    let response = await this.#rapiRequest('$GS');
    let match = response.match(/^\$OK ([0-9a-f]{2}) /);
    if (!match) {
      throw new Error(`Unexpected response: ${response}`)
    }
    return match[1] !== 'fe';
  }

  async getTargetAmps(): Promise<number> {
    let response = await this.#rapiRequest('$GE');
    let match = response.match(/^\$OK ([0-9]+) /);
    if (!match) {
      throw new Error(`Unexpected response: ${response}`)
    }
    return parseInt(match[1]);
  }

  async setTargetAmps(amps: number): Promise<void> {
    let response = await this.#rapiRequest(`$SC ${amps}`);
    let match = response.match(/^\$OK ([0-9]+)\^/);
    if (!match || parseInt(match[1]) != amps) {
      throw new Error(`Unexpected response: ${response}`);
    }
  }

  async getMeasuredAmps(): Promise<number> {
    let response = await this.#rapiRequest(`$GG`);
    let match = response.match(/^\$OK ([0-9]+) /);
    if (!match) {
      throw new Error(`Unexpected response: ${response}`);
    }

    return parseInt(match[1]) / 1000;
  }

  async setToSleep(): Promise<void> {
    let response = await this.#rapiRequest('$FS');
    let match = response.match(/^\$OK\b/);
    if (!match) {
      throw new Error(`Unexpected response: ${response}`);
    }
  }

  async setToEnabled(): Promise<void> {
    let response = await this.#rapiRequest('$FE');
    let match = response.match(/^\$OK\b/);
    if (!match) {
      throw new Error(`Unexpected response: ${response}`);
    }
  }
}

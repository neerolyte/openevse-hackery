const axios = require('axios').default;

export class OpenevseClient {
  #url: string;
  #ampsMax: number;
  #ampsMin: number;

  constructor(options: {
    url: string,
    ampsMin: number,
    ampsMax: number,
  }) {
    this.#url = options.url;
    this.#ampsMin = options.ampsMin;
    this.#ampsMax = options.ampsMax;
  }

  async #rapiRequest(command: string): Promise<string> {
    let url = `${this.#url}r?json=1&rapi=${command}`;
    return (await axios.get(url)).data.ret;
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

  constrainAmps(amps: number): number {
    return Math.round(Math.max(Math.min(amps, this.#ampsMax), this.#ampsMin));
  }
}

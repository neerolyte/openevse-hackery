const axios = require('axios').default;

export class SelectliveClient {
  #url: string;
  #device: string;

  constructor(options: {
    url: string,
    device: string,
  }) {
    this.#url = options.url;
    this.#device = options.device;
  }

  #getDeviceUrl(): string {
    return `${this.#url}cgi-bin/solarmonweb/devices/${this.#device}/`;
  }

  async #getPoint() {
    let url = `${this.#getDeviceUrl()}point`;
    return (await axios.get(url)).data;
  }

  async getBatterySoc(): Promise<number> {
    let point = await this.#getPoint();
    return (point).items.battery_soc;
  }

  async getBatteryW(): Promise<number> {
    return (await this.#getPoint()).items.battery_w;
  }
}

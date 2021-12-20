const axios = require('axios').default;

export class SelectliveClient {
  constructor(
    private selectliveUrl: string,
    private selectliveDevice: string
  ) {}
  public static inject = ['selectliveUrl', 'selectliveDevice'] as const;

  #getDeviceUrl(): string {
    return `${this.selectliveUrl}cgi-bin/solarmonweb/devices/${this.selectliveDevice}/`;
  }

  async #getPoint() {
    let url = `${this.#getDeviceUrl()}point`;
    return (await axios.get(url)).data;
  }

  async getBatterySoc(): Promise<number> {
    let point = await this.#getPoint();
    return (point).items.battery_soc;
  }

  private async getBatteryW(): Promise<number> {
    return (await this.#getPoint()).items.battery_w;
  }

  async getSpareAmps(): Promise<number> {
    return - (await this.getBatteryW()) / 240;
  }
}

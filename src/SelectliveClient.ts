import { SelectlivePoint } from "./SelectlivePoint";

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

  public async getPoint(): Promise<SelectlivePoint> {
    let url = `${this.#getDeviceUrl()}point`;
    return new SelectlivePoint((await axios.get(url)).data);
  }
}

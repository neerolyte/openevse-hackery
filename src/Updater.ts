import { OpenevseClient } from "./OpenevseClient";
import { SelectliveClient } from "./SelectliveClient";

export class Updater {
  #selectliveClient: SelectliveClient;
  #openevseClient: OpenevseClient;

  constructor(
    selectliveClient: SelectliveClient,
    openevseClient: OpenevseClient
  ) {
    this.#selectliveClient = selectliveClient;
    this.#openevseClient = openevseClient;
  }

  public async update(): Promise<{
    spareAmps: number,
    measuredAmps: number,
    oldTargetAmps: number,
    newTargetAmps: number,
  }> {
    let houseBatterySoc = await this.#selectliveClient.getBatterySoc();
    let houseBatteryW = await this.#selectliveClient.getBatteryW();
    let spareAmps = 0 - ( houseBatteryW / 240 );

    if (houseBatterySoc > 99.0) {
      spareAmps += 5;
    }

    let oldTargetAmps = await this.#openevseClient.getTargetAmps();
    let measuredAmps = await this.#openevseClient.getMeasuredAmps();
    let newTargetAmps = this.#openevseClient.constrainAmps(spareAmps + measuredAmps);

    // If the measured amps are much lower than minimum, constrain to the minimum target to avoid harsh start ups
    if (measuredAmps < this.#openevseClient.ampsMin / 2) {
      newTargetAmps = this.#openevseClient.ampsMin;
    }

    this.#openevseClient.setTargetAmps(newTargetAmps);

    return {
      spareAmps: spareAmps,
      measuredAmps: measuredAmps,
      oldTargetAmps: oldTargetAmps,
      newTargetAmps: newTargetAmps,
    };
  }
}

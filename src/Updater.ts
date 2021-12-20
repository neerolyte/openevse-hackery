import { OpenevseClient } from "./OpenevseClient";
import { SelectliveClient } from "./SelectliveClient";

export class Updater {

  constructor(
    private selectliveClient: SelectliveClient,
    private openevseClient: OpenevseClient
  ) {}
  public static inject = ['selectliveClient', 'openevseClient'] as const;

  public async update(): Promise<{
    spareAmps: number,
    measuredAmps: number,
    oldTargetAmps: number,
    newTargetAmps: number,
  }> {
    let houseBatterySoc = await this.selectliveClient.getBatterySoc();
    let houseBatteryW = await this.selectliveClient.getBatteryW();
    let spareAmps = 0 - ( houseBatteryW / 240 );

    if (houseBatterySoc > 99.0) {
      spareAmps += 5;
    }

    let currentTargetAmps = await this.openevseClient.getTargetAmps();
    let measuredAmps = await this.openevseClient.getMeasuredAmps();
    let newTargetAmps = this.openevseClient.constrainAmps(spareAmps + measuredAmps);

    // If the measured amps are low, constrain to the minimum target to avoid harsh start ups
    if (measuredAmps < currentTargetAmps - 5) {
      newTargetAmps = measuredAmps + 5;
    }

    this.openevseClient.setTargetAmps(newTargetAmps);

    return {
      spareAmps: spareAmps,
      measuredAmps: measuredAmps,
      oldTargetAmps: currentTargetAmps,
      newTargetAmps: newTargetAmps,
    };
  }
}

import { OpenevseClient } from "./OpenevseClient";
import { SelectliveClient } from "./SelectliveClient";

export class Updater {

  constructor(
    private selectliveClient: SelectliveClient,
    private openevseClient: OpenevseClient
  ) {}
  public static inject = ['selectliveClient', 'openevseClient'] as const;

  private changeStateRounds = 0;

  public async update(): Promise<{
    spareAmps: number,
    measuredAmps: number,
    oldTargetAmps: number,
    newTargetAmps: number,
  }> {
    let point = await this.selectliveClient.getPoint();
    let spareAmps = point.getSpareAmps();

    let currentTargetAmps = await this.openevseClient.getTargetAmps();
    let measuredAmps = await this.openevseClient.getMeasuredAmps();
    let newTargetAmps = spareAmps + measuredAmps;

    let isEnabled = await this.openevseClient.getChargingEnabled();
    let shouldChangeState = false;

    if (isEnabled) {
      shouldChangeState = spareAmps < 0;
    } else {
      shouldChangeState = spareAmps > 6;
    }

    if (shouldChangeState) {
      this.changeStateRounds++;
      console.log(`Increasing state change counter to: ${this.changeStateRounds}`);
    } else {
      this.changeStateRounds = 0;
    }

    if (this.changeStateRounds > 30) {
      this.changeStateRounds = 0;
      console.log(`Changing state ${isEnabled} => ${!isEnabled}`);
      await this.openevseClient.setChargingEnabled(!isEnabled);
    }

    // If the measured amps are low, constrain to the minimum target to avoid harsh start ups
    if (measuredAmps < currentTargetAmps - 5) {
      newTargetAmps = measuredAmps + 5;
    }

    newTargetAmps = await this.openevseClient.setTargetAmps(newTargetAmps);

    return {
      spareAmps: spareAmps,
      measuredAmps: measuredAmps,
      oldTargetAmps: currentTargetAmps,
      newTargetAmps: newTargetAmps,
    };
  }
}

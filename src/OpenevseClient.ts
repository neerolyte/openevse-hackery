import { OpenevseRawClient } from "./OpenevseRawClient";
import { tokens } from "typed-inject";

export class OpenevseClient {
  constructor(
    private openevseRawClient: OpenevseRawClient,
    private openevseAmpsMin: number,
    private openevseAmpsMax: number,
  ) {}
  public static inject = tokens('openevseRawClient', 'openevseAmpsMin', 'openevseAmpsMax');

  async getChargingEnabled(): Promise<boolean> {
    return this.openevseRawClient.getChargingEnabled();
  }

  async getTargetAmps(): Promise<number> {
    return this.openevseRawClient.getTargetAmps();
  }

  async setTargetAmps(amps: number): Promise<void> {
    return this.openevseRawClient.setTargetAmps(this.constrainAmps(amps));
  }

  async getMeasuredAmps(): Promise<number> {
    return this.openevseRawClient.getMeasuredAmps();
  }

  constrainAmps(amps: number): number {
    return Math.round(Math.max(Math.min(amps, this.openevseAmpsMax), this.openevseAmpsMin));
  }
}

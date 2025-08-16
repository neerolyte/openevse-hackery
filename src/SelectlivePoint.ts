import { SelectlivePointData } from "./SelectlivePointData";

export class SelectlivePoint {
  constructor(
    private data: SelectlivePointData,
  ) {}
  public getBatterySoc(): number {
    return this.data.items.battery_soc;
  }

  public getBatteryW(): number {
    return this.data.items.battery_w;
  }

  public getSpareAmps(): number {
    let spare = 0 - (this.getBatteryW() / 240);
    let batterySoc = this.getBatterySoc();
    let spareFromBatterySoc = 0 - (95 - batterySoc) / 2;
    console.log(`batterySoc: ${batterySoc} spare: ${spare} spareFromBatterySoc: ${spareFromBatterySoc}`);
    spare += spareFromBatterySoc;
    if (this.isCurtailed()) {
      spare += 10;
    }
    return spare;
  }

  public getShuntW(): number {
    return this.data.items.shunt_w;
  }

  public isCurtailed(): boolean {
    if (this.getShuntW() === undefined || this.getBatteryW() === undefined) {
      return false;
    }
    if (this.getBatterySoc() <= 90) {
      return false;
    }
    // DC solar is generating basically nothing
    if (this.getShuntW() >= 50) {
      return false;
    }
    // battery is supplying basically nothing
    if (this.getBatteryW() >= 100) {
      return false;
    }
    return true;
  }
}

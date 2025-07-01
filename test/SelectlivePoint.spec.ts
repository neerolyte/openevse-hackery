import { expect } from 'chai';
import { SelectlivePointData } from '../src/SelectlivePointData';
import { SelectlivePoint } from '../src/SelectlivePoint';

describe('SelectlivePoint', () => {
  ([
    [{ items: { battery_soc: 97.123 } }, 97.123],
    [{ items: { battery_soc: 3 } }, 3],
    [{ items: { battery_soc: 50 } }, 50],
    [{ items: {} }, undefined],
  ] as [SelectlivePointData, number][]).forEach(async ([data, expected]) => {
    it(`knows spare amps: ${JSON.stringify(data)} => ${expected}`, async () => {
      const point = new SelectlivePoint(data);
      expect(point.getBatterySoc()).to.equal(expected)
    });
  });

  ([
    [{ items: { battery_w: 240 } }, 240],
    [{ items: { battery_w: 0 } }, 0],
    [{ items: { battery_w: -240 } }, -240],
    [{ items: { battery_w: -360 } }, -360],
    [{ items: {} }, undefined],
  ] as [SelectlivePointData, number][]).forEach(async ([data, expected]) => {
    it(`knows spare amps: ${JSON.stringify(data)} => ${expected}`, async () => {
      const point = new SelectlivePoint(data);
      expect(point.getBatteryW()).to.equal(expected)
    });
  });

  ([
    // Curtailed: soc > 90, shunt_w < 50, battery_w < 100, shunt_w and battery_w defined
    [{ items: { battery_soc: 95, shunt_w: 10, battery_w: 50 } }, true],
    // Not curtailed: soc <= 90
    [{ items: { battery_soc: 90, shunt_w: 10, battery_w: 50 } }, false],
    // Not curtailed: shunt_w >= 50
    [{ items: { battery_soc: 95, shunt_w: 50, battery_w: 50 } }, false],
    // Not curtailed: battery_w >= 100
    [{ items: { battery_soc: 95, shunt_w: 10, battery_w: 100 } }, false],
    // Not curtailed: shunt_w undefined
    [{ items: { battery_soc: 95, battery_w: 50 } }, false],
    // Not curtailed: battery_w undefined
    [{ items: { battery_soc: 95, shunt_w: 10 } }, false],
    // Not curtailed: all undefined
    [{ items: {} }, false],
  ] as [SelectlivePointData, boolean][]).forEach(([data, expected]) => {
    it(`isCurtailed: ${JSON.stringify(data)} => ${expected}`, () => {
      const point = new SelectlivePoint(data);
      expect(point.isCurtailed()).to.equal(expected);
    });
  });
});

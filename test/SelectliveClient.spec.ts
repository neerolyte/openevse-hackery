import { fail } from 'assert';
import { expect } from 'chai';
import { SelectliveClient } from '../src/SelectliveClient';
var axiosMock = require('./axiosMock').mock;

describe('SelectliveClient', () => {
  const url = 'http://example.com/';
  const device = 'x-device';
  const pointUrl = 'http://example.com/cgi-bin/solarmonweb/devices/x-device/point';
  const client = new SelectliveClient(url, device);

  function mockPointItems(items: object) {
    axiosMock.onGet(pointUrl).replyOnce(200, { items: items });
  }

  it(`getSOC()`, async () => {
    mockPointItems({ 'battery_soc': 97.123 });
    expect(await client.getBatterySoc()).to.equal(97.123);
    mockPointItems({ 'battery_soc': 3 });
    expect(await client.getBatterySoc()).to.equal(3);
    mockPointItems({ 'battery_soc': 50 });
    expect(await client.getBatterySoc()).to.equal(50);
  });

  ([
    [-240, 1],
    [0, 0],
    [240, -1],
    [360, -1.5],
  ] as [watts: number, amps: number][]).forEach(async (data) => {
    let [watts, amps] = data;
    it(`knows spare amps: ${watts} => ${amps}`, async () => {
      mockPointItems({ 'battery_w': watts });
      expect(await client.getSpareAmps()).to.equal(amps)
    });
  });
});

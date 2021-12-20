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
  })

  it(`getBatteryW()`, async () => {
    mockPointItems({ 'battery_w': 322.998046875 });
    expect(await client.getBatteryW()).to.equal(322.998046875);
    mockPointItems({ 'battery_w': -1024.1234 });
    expect(await client.getBatteryW()).to.equal(-1024.1234);
    mockPointItems({ 'battery_w': 0 });
    expect(await client.getBatteryW()).to.equal(0);
  })
});

import { fail } from 'assert';
import { expect } from 'chai';
import { SelectliveClient } from '../src/SelectliveClient';
var axiosMock = require('./axiosMock').mock;

describe('SelectliveClient', () => {
  const url = 'http://example.com/';
  const device = 'x-device';
  const pointUrl = 'http://example.com/cgi-bin/solarmonweb/devices/x-device/point';
  const client = new SelectliveClient(url, device);

  function mockPoint(data: object) {
    axiosMock.onGet(pointUrl).replyOnce(200, data);
  }

  it('should fetch and return a SelectlivePoint with correct data', async () => {
    const data = {
      "device":{
        "name":"Selectronic SP-PRO"
      },
      "item_count":19,
      "items":{
        "battery_in_wh_today":13.19677734375,
        "battery_in_wh_total":14014.33154296875,
        "battery_out_wh_today":13.8427734375,
        "battery_out_wh_total":13985.90771484375,
        "battery_soc":82.75,
        "battery_w":519.10400390625,
        "grid_in_wh_today":5.97802734375,
        "grid_in_wh_total":215.294384765625,
        "grid_out_wh_today":0.0,
        "grid_out_wh_total":0.0,
        "grid_w":0.0,
        "load_w":442.5697326660156,
        "load_wh_today":24.680712890625,
        "load_wh_total":34973.68037109375,
        "shunt_w":3.84521484375,
        "solar_wh_today":20.04140625,
        "solar_wh_total":38860.83193359375,
        "solarinverter_w":0.0,
        "timestamp":1751366838
      },
      "comment":"energies are actually in kWh, not Wh",
      "now":1751366838
    };
    mockPoint(data);

    const point = await client.getPoint();

    // Check that the returned object has the correct values
    expect(point.getBatterySoc()).to.equal(82.75);
    expect(point.getBatteryW()).to.equal(519.10400390625);
    expect(point.getShuntW()).to.equal(3.84521484375);
  });

});

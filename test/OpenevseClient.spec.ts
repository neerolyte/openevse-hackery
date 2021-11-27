import { expect } from 'chai';

import { use as chaiUse } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

chaiUse(chaiAsPromised);


import { OpenevseClient } from '../src/OpenevseClient';
var axiosMock = require('./axiosMock').mock;

describe('OpenevseClient', () => {
  const url = 'http://example.com/';
  const rapiUrl = 'http://example.com/r?json=1&rapi=';
  const client = new OpenevseClient({
    url: url,
    ampsMin: 6,
    ampsMax: 32,
  });

  afterEach(() => {
    axiosMock.reset();
  })
  beforeEach(() => {
    axiosMock.reset();
  })

  function mockRapiResponse(command: string, response: object) {
    axiosMock.onGet(`${rapiUrl}${command}`).replyOnce(200, response);
  }

  [
    { rapiResponse: '$OK 00 91 03 0500^2E', expected: true},
    { rapiResponse: '$OK 00 110 03 0500^16', expected: true},
    { rapiResponse: '$OK 03 142 03 0540^16', expected: true},
    { rapiResponse: '$OK fe 128 03 0500^1E', expected: false},
    { rapiResponse: '$OK fe 110 03 0500^15', expected: false},
  ].forEach(async (data: { rapiResponse: string, expected: boolean}) => {
    it(`getChargingEnabled(): ${data.rapiResponse} => ${data.expected}`, async () => {
      mockRapiResponse('$GS', { ret: data.rapiResponse });
      expect(await client.getChargingEnabled()).to.equal(data.expected);
    })
  });

  [
    { rapiResponse: '$OK 6 8020^1C', expected: 6},
    { rapiResponse: '$OK 24 8020^2C', expected: 24},
    { rapiResponse: '$OK 16 8020^2D', expected: 16 },
  ].forEach(async (data: { rapiResponse: string, expected: number}) => {
    it(`getTargetAmps(): ${data.rapiResponse} => ${data.expected}`, async () => {
      mockRapiResponse('$GE', { ret: data.rapiResponse });
      expect(await client.getTargetAmps()).to.equal(data.expected);
    })
  });

  it(`setTargetAmps()`, async () => {
    mockRapiResponse('$SC 6', { ret: '$OK 6^36' });
    await client.setTargetAmps(6);
    expect(axiosMock.history.get.length).to.equal(1);
    expect(axiosMock.history.get[0].url).to.equal('http://example.com/r?json=1&rapi=$SC 6');
  })

  it(`setTargetAmps() throws on invalid response`, async () => {
    mockRapiResponse('$SC 7', { ret: '$NK 24^07' });
    await expect(client.setTargetAmps(7)).to.be.rejectedWith('Unexpected response: $NK 24^07');
    expect(axiosMock.history.get.length).to.equal(1);
    expect(axiosMock.history.get[0].url).to.equal('http://example.com/r?json=1&rapi=$SC 7');
  })

  it.skip('should throw on bad rapi responses');
});

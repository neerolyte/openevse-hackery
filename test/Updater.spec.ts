import { fail } from 'assert';
import { expect } from 'chai';
import * as sinon from 'ts-sinon'
import { OpenevseClient } from '../src/OpenevseClient';
import { SelectliveClient } from '../src/SelectliveClient';
import { Updater } from '../src/Updater';

describe('Updater', () => {
  it('trusts OpenEVSE to constrain amps', async () => {
    let selectliveClient = sinon.stubConstructor(SelectliveClient, { url: 'x-url', device: 'x-device'});
    let openevseClient = sinon.stubConstructor(OpenevseClient, {
      url: 'x-url',
      ampsMax: 20,
      ampsMin: 6,
    });

    selectliveClient.getBatterySoc.returns(Promise.resolve(100));
    selectliveClient.getBatteryW.returns(Promise.resolve(-240000));
    openevseClient.constrainAmps.returns(123);

    let updater = new Updater(selectliveClient, openevseClient);

    let result = await updater.update();

    expect(result.spareAmps).to.equal(1005);
    expect(result.newTargetAmps).to.equal(123);

    let calls = openevseClient.setTargetAmps.getCalls();
    expect(calls.length).to.equal(1);
    expect(calls[0].args.length).to.equal(1);
    expect(calls[0].args[0]).to.equal(123);
  });
});

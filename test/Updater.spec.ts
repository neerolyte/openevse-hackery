import { expect } from 'chai';
import * as sinon from 'ts-sinon';
import { StubbedInstance } from 'ts-sinon';
import { OpenevseClient } from '../src/OpenevseClient';
import { OpenevseRawClient } from '../src/OpenevseRawClient';
import { SelectliveClient } from '../src/SelectliveClient';
import { Updater } from '../src/Updater';

describe('Updater', () => {
  let selectliveClient: StubbedInstance<SelectliveClient>;
  let openevseClient: StubbedInstance<OpenevseClient>;
  let updater: Updater;
  beforeEach(() => {
    selectliveClient = sinon.stubConstructor(SelectliveClient);
    openevseClient = sinon.stubConstructor(OpenevseClient);
    updater = new Updater(selectliveClient, openevseClient);
  });

  it('trusts OpenEVSE to constrain amps to max', async () => {
    selectliveClient.getBatterySoc.returns(Promise.resolve(100));
    selectliveClient.getBatteryW.returns(Promise.resolve(-240000));
    openevseClient.constrainAmps.returns(123);

    let result = await updater.update();

    expect(result.spareAmps).to.equal(1005);
    expect(result.newTargetAmps).to.equal(123);
    let calls = openevseClient.setTargetAmps.getCalls();
    expect(calls.length).to.equal(1);
    expect(calls[0].args.length).to.equal(1);
    expect(calls[0].args[0]).to.equal(123);
  });

  it('trusts OpenEVSE to constrain amps to min', async () => {
    selectliveClient.getBatterySoc.returns(Promise.resolve(100));
    selectliveClient.getBatteryW.returns(Promise.resolve(0));
    openevseClient.constrainAmps.returns(3);

    let result = await updater.update();

    expect(result.spareAmps).to.equal(5);
    expect(result.newTargetAmps).to.equal(3);
    let calls = openevseClient.setTargetAmps.getCalls();
    expect(calls.length).to.equal(1);
    expect(calls[0].args.length).to.equal(1);
    expect(calls[0].args[0]).to.equal(3);
  });

  it.skip('at low SoC, load and supply should match', () => {

  })
});

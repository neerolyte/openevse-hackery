import { expect } from 'chai';
import * as sinon from 'ts-sinon';
import { StubbedInstance } from 'ts-sinon';
import { OpenevseClient } from '../src/OpenevseClient';
import { SelectliveClient } from '../src/SelectliveClient';
import { Updater } from '../src/Updater';
import { SelectlivePoint } from '../src/SelectlivePoint';

describe('Updater', () => {
  let selectliveClient: StubbedInstance<SelectliveClient>;
  let openevseClient: StubbedInstance<OpenevseClient>;
  let updater: Updater;
  beforeEach(() => {
    selectliveClient = sinon.stubConstructor(SelectliveClient);
    openevseClient = sinon.stubConstructor(OpenevseClient);
    updater = new Updater(selectliveClient, openevseClient);
  });

  it(`updates and returns state`, async () => {
    selectliveClient.getPoint.returns(Promise.resolve(new SelectlivePoint({
      items: { battery_soc: 100, shunt_w: 10, battery_w: 0 },
    })));
    openevseClient.getTargetAmps.returns(Promise.resolve(6));
    openevseClient.getMeasuredAmps.returns(Promise.resolve(6));
    openevseClient.setTargetAmps.returns(Promise.resolve(7));
    let state = await updater.update();
    expect(state.newTargetAmps).to.equal(7);
  });
});

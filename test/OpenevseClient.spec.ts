import { expect } from 'chai';

import { use as chaiUse } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { StubbedInstance } from 'ts-sinon';
import * as sinon from 'ts-sinon';
import { OpenevseClient } from '../src/OpenevseClient';

chaiUse(chaiAsPromised);


import { OpenevseRawClient } from '../src/OpenevseRawClient';

describe('OpenevseClient', () => {

  let openevseRawClient: StubbedInstance<OpenevseRawClient>;
  let client: OpenevseClient;

  beforeEach(() => {
    openevseRawClient= sinon.stubConstructor(OpenevseRawClient, 'x-url');
    client = new OpenevseClient(openevseRawClient, 6, 32);
  });

  ([
    [ 36, 32 ],
    [ 32, 32 ],
    [ 7, 7 ],
    [ 6, 6 ],
    [ 5, 6 ],
  ] as [ amps: number, expected: number][]).forEach(async (data) => {
    let [amps, expected] = data;
    it(`constrains amps(): ${amps} => ${expected}`, async () => {
      await client.setTargetAmps(amps);
      let calls = openevseRawClient.setTargetAmps.getCalls();
      expect(calls[0].args[0]).to.equal(expected);
      expect(calls.length).to.equal(1);
      expect(calls[0].args.length).to.equal(1);
    })
  });
});

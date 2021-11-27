import { OpenevseClient } from './src/OpenevseClient';
import { SelectliveClient } from './src/SelectliveClient';
import { config } from './src/config';

const selectliveClient = new SelectliveClient(config.selectlive);
const openevseClient = new OpenevseClient(config.openevse);

(async () => {
  let houseBatterySoc = await selectliveClient.getBatterySoc();
  let houseBatteryW = await selectliveClient.getBatteryW();
  let spareAmps = 0 - ( houseBatteryW / 240 );

  if (houseBatterySoc > 99.0) {
    console.log("Adding spare amps as house battery is full\n");
    spareAmps += 5;
  }

  let openevseTargetAmps = await openevseClient.getTargetAmps();
  let newTargetAmps = openevseClient.constrainAmps(spareAmps + openevseTargetAmps);

  console.log(`Spare amps: ${spareAmps}`);
  console.log(`Target amps: ${openevseTargetAmps} => ${newTargetAmps}`);
  openevseClient.setTargetAmps(newTargetAmps);
})();

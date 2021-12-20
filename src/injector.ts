import { createInjector } from 'typed-inject';
import { OpenevseRawClient } from './OpenevseRawClient';
import { OpenevseClient } from './OpenevseClient';
import { config } from './config';
import { SelectliveClient } from './SelectliveClient';
import { Updater } from './Updater';

export const injector = createInjector()
.provideValue('openevseUrl', config.openevse.url)
.provideValue('openevseAmpsMin', config.openevse.ampsMin)
.provideValue('openevseAmpsMax', config.openevse.ampsMax)
.provideClass('openevseRawClient', OpenevseRawClient)
.provideClass('openevseClient', OpenevseClient)
.provideValue('selectliveUrl', config.selectlive.url)
.provideValue('selectliveDevice', config.selectlive.device)
.provideClass('selectliveClient', SelectliveClient)
.provideClass('updater', Updater)

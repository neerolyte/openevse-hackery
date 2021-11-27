before publishing:

 * get rid of all intermediate commits

longer term:
 * manage enabled/disabled state
 * shift battery is full soc threshold to config
 * shift additional spare amps when battery is full to config
 * loop within script
 * avoid starting up at max charge amps (monitor what car is actually drawing and start at that +6A)
 * verify checksums
 * reference upstream protocol docs - https://github.com/OpenEVSE/open_evse/blob/34ea209b7b3a44d2b41a93902469413f05be6023/firmware/open_evse/rapi_proc.h

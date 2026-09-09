import { type TheTime } from "../theTime";

export interface SpoolingTime {
	value?: string | number | TheTime;
	week?: number;
	day?: number;
	hour?: number;
	minute?: number;
	second?: number;
	millisecond?: number;
}

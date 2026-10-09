import { NumberInString } from '../types';
import { Format } from './format';
export interface Number extends Format<"number", NumberInString> {
}

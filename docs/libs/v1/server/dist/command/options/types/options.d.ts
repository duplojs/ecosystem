import { Option } from '../base';
import { SimpleOption, BooleanOption, ArrayOption } from '../defaults';
export interface OptionsStore {
    base: Option;
    boolean: BooleanOption;
    simple: SimpleOption;
    array: ArrayOption;
}
export type Options = Extract<OptionsStore[keyof OptionsStore], Option>;

import { CheckerStep } from '../checker';
import { CutStep } from '../cut';
import { ExtractStep } from '../extract';
import { HandlerStep } from '../handler';
import { PresetCheckerStep } from '../presetChecker';
import { ProcessStep } from '../process';
export interface StepsCustom {
}
export type Steps = (StepsCustom[keyof StepsCustom] | CheckerStep | CutStep | ExtractStep | HandlerStep | PresetCheckerStep | ProcessStep);

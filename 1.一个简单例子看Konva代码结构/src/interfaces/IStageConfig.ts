import { IContainerConfig } from './IContainerConfig';
export interface IStageConfig extends IContainerConfig {
    container: HTMLDivElement | string
}
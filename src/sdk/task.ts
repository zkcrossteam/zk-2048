import BN from 'bn.js';

import { Application } from '../data/application';
import { Base } from '../data/base';

export interface Task
  extends Record<'user_address' | 'md5' | 'task_type' | 'status', string>,
    Record<'proof' | 'instances', Uint8Array>,
    Record<'public_inputs' | 'private_inputs', string[]> {
  _id: string;
}

export type ProvingTask = Pick<
  Task,
  'user_address' | 'md5' | 'public_inputs' | 'private_inputs'
>;

export type VerifyData = Record<
  'proof' | 'target_instances' | 'aggregator_instances' | 'aux_instances',
  BN[]
>;

export enum RequestType {
  Create = 'Create',
  Deploy = 'Deploy',
  Load = 'Load',
  Settlement = 'Settlement',
  State = 'State',
  VRF = 'VRF',
}

export enum Status {
  Pending = 'Pending',
  Processing = 'Processing',
  Done = 'Done',
  Fail = 'Fail',
}

export const statusName: Record<Status, string> = {
  [Status.Pending]: 'Pending',
  [Status.Processing]: 'Processing',
  [Status.Done]: 'Success',
  [Status.Fail]: 'Fail',
};

export enum VerifyStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Success = 'Success',
  Fail = 'Fail',
}

export interface RequestOutput
  extends Base,
    Record<'user_address' | 'md5', string>,
    Partial<
      Record<'proof' | 'aux' | 'instances' | 'task_fee', number[]> &
        Record<'public_inputs' | 'private_inputs', string[]> &
        Record<
          | 'submit_time'
          | 'process_started'
          | 'process_finished'
          | 'status_message'
          | 'internal_message'
          | 'verify_address',
          string | null
        >
    > {
  uuid: string;
  type: RequestType;
  status?: keyof typeof statusName;
  _id?: { $oid: string };
  verify_status?: VerifyStatus;
  application?: Application;
}

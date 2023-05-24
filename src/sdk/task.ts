import BN from 'bn.js';

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

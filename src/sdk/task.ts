import BN from "bn.js";

export interface Task {
   user_address: string;
   md5: string;
   task_type: string;
   status: string;
   proof: Uint8Array;
   instances: Uint8Array;
   public_inputs: Array<string>;
   private_inputs: Array<string>;
   _id: any;
}

export interface ProvingTask {
   user_address: string;
   md5: string;
   public_inputs: Array<string>;
   private_inputs: Array<string>;
}

export interface VerifyData {
   proof: Array<BN>;
   target_instances: Array<BN>;
   aggregator_instances: Array<BN>;
   aux_instances: Array<BN>; 
}
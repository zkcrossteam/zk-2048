import { Base } from './base';

export type Application = Base &
  Partial<
    Record<
      | 'uuid'
      | 'address'
      | 'md5'
      | 'filename'
      | 'icon'
      | 'name'
      | 'website'
      | 'description'
      | 'zkcBalance',
      string
    > &
      Record<
        'size' | 'totalTask' | 'totalWallet' | 'rewardsAccumulated',
        number
      >
  > & { chainList: number[] };

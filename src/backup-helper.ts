import { MethodBackup } from './types/method-backup';
export const backupHelper = {
  restore<Target>(target: Target, backup: Array<MethodBackup<Target>>) {
    for (const pair of backup) {
      target[pair[0]] = pair[1];
    }
  },
};

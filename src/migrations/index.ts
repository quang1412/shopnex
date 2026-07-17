import * as migration_20260717_051837_init from './20260717_051837_init';

export const migrations = [
  {
    up: migration_20260717_051837_init.up,
    down: migration_20260717_051837_init.down,
    name: '20260717_051837_init'
  },
];

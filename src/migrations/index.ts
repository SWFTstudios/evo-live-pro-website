import * as migration_20261111_195634_initial from './20261111_195634_initial';

export const migrations = [
  {
    up: migration_20261111_195634_initial.up,
    down: migration_20261111_195634_initial.down,
    name: '20261111_195634_initial'
  },
];

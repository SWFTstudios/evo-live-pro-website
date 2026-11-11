import * as migration_20261111_195634_initial from './20261111_195634_initial';
import * as migration_20261111_221510_experience_and_tracking from './20261111_221510_experience_and_tracking';

export const migrations = [
  {
    up: migration_20261111_195634_initial.up,
    down: migration_20261111_195634_initial.down,
    name: '20261111_195634_initial',
  },
  {
    up: migration_20261111_221510_experience_and_tracking.up,
    down: migration_20261111_221510_experience_and_tracking.down,
    name: '20261111_221510_experience_and_tracking'
  },
];

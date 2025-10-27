import 'reflect-metadata';

import { MealsQueuesConsumer } from '@application/queues/MealsQueuesConsumer';
import { Registry } from '@kernel/di/Registry';
import { lambdaSQSAdapter } from '@main/adapters/lambdaSQSAdapter';

const consumer = Registry.getInstance().resolve(MealsQueuesConsumer);

export const handler = lambdaSQSAdapter(consumer);

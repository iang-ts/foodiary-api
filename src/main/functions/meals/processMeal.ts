import 'reflect-metadata';

import { MealsQueuesConsumer } from '@application/queues/MealsQueuesConsumer';
import { lambdaSQSAdapter } from '@main/adapters/lambdaSQSAdapter';

export const handler = lambdaSQSAdapter(MealsQueuesConsumer);

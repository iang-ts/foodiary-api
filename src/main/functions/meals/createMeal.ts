import 'reflect-metadata';

import { CreateMealCoontroller } from '@application/controllers/meals/CreateMealController';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

export const handler = lambdaHttpAdapter(CreateMealCoontroller);

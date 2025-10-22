import 'reflect-metadata';


import { CreateMealCoontroller } from '@application/controllers/meals/CreateMealController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(CreateMealCoontroller);

export const handler = lambdaHttpAdapter(controller);

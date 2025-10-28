import 'reflect-metadata';

import { GetMeController } from '@application/controllers/accounts/getMeController';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

export const handler = lambdaHttpAdapter(GetMeController);

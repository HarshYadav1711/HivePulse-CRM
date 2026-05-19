import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import type { LoginBody, RegisterBody } from './auth.dto';
import * as authService from './auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as RegisterBody;
  const session = await authService.registerUser(body);
  sendSuccess(res, session, 201, 'Account created successfully.');
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as LoginBody;
  const session = await authService.loginUser(body);
  sendSuccess(res, session, 200, 'Signed in successfully.');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth!.sub;
  const user = await authService.getCurrentUser(userId);
  sendSuccess(res, user);
});

import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import * as authService from './auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const tokens = await authService.registerUser(req.body);
  sendSuccess(res, tokens, 201, 'Account created successfully.');
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const tokens = await authService.loginUser(req.body);
  sendSuccess(res, tokens, 200, 'Signed in successfully.');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.user!._id.toString());
  sendSuccess(res, user);
});

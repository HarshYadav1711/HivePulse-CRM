import type { JwtPayload, UserRole } from '@hivepulse/shared';
import type { IUserDocument } from '../modules/auth/user.model';

declare global {
  namespace Express {
    interface Request {
      /** Authenticated user loaded from the database (no password field). */
      user?: IUserDocument;
      /** Verified JWT claims for the current request. */
      auth?: JwtPayload;
    }
  }
}

export type AuthorizedRequest = Express.Request & {
  user: IUserDocument;
  auth: JwtPayload;
};

export type RoleGuard = UserRole | UserRole[];

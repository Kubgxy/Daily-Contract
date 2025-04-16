import { JwtPayload } from "../../src/middleware/verifyToken";
import { Multer } from "multer";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;

    // ถ้าน้องใช้ upload files ด้วย Multer ก็ keep ไว้
    file?: Multer.File;
    files?: Multer.File[];
  }
}

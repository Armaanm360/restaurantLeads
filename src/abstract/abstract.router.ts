import { Router } from 'express';
import CommonValidator from '../common/validators/commonValidator';
import Uploader from '../common/middleware/uploader/uploader';
import FileFolder from '../utils/miscellaneous/fileFolders';

class AbstractRouter {
  public router = Router();
  protected commonValidator = new CommonValidator();
  protected uploader = new Uploader();
  protected fileFolders = FileFolder;
}

export default AbstractRouter;

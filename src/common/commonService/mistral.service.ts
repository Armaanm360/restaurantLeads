import { Request, Response } from 'express';
import { createWorker } from 'tesseract.js';

import pdf from 'pdf-img-convert';
import multer from 'multer';
import path from 'path';

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

class OCRController {
  /**
   * Process PDF with Tesseract OCR
   */
  public async parsePDF(req: Request) {
    return {
      success: true,
      code: 200,
    };
  }
}

export { OCRController, upload };

const PDFParser = require('pdf2json');
const mammoth = require('mammoth');

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export interface ParseResult {
  text: string;
  fileName: string;
  fileType: 'pdf' | 'docx';
}

/**
 * 1. Server-Side File Validation
 * Validates file buffer, file size limit, and supported extensions/MIME types.
 */
function validateFile(buffer: Buffer, fileName: string, mimeType?: string): 'pdf' | 'docx' {
  // Safeguard: Empty or missing buffer
  if (!buffer || buffer.length === 0) {
    throw new Error('Uploaded file is empty or corrupted.');
  }

  // Safeguard: 5MB Size Limit
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error('File size exceeds the 5MB limit. Please upload a smaller resume file.');
  }

  const lowerName = fileName.toLowerCase();
  const isPDF = lowerName.endsWith('.pdf') || mimeType === 'application/pdf';
  const isDOCX =
    lowerName.endsWith('.docx') ||
    lowerName.endsWith('.doc') ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword';

  if (!isPDF && !isDOCX) {
    throw new Error('Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).');
  }

  return isPDF ? 'pdf' : 'docx';
}

/**
 * 2. PDF Text Extractor using pdf2json
 */
async function parsePDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // The '1' instructs pdf2json to export raw text content only
    const pdfParser = new PDFParser(null, 1);

    pdfParser.on('pdfParser_dataError', (errData: any) => {
      reject(new Error(errData.parserError || 'Failed to parse PDF file.'));
    });

    pdfParser.on('pdfParser_dataReady', () => {
      try {
        const text = pdfParser.getRawTextContent()?.trim() || '';

        // Safeguard: Scanned PDF / Image-Only PDF check
        if (!text || text.length < 20) {
          return reject(
            new Error('Unable to extract text from PDF. The document may be a scanned image or contain non-selectable text.')
          );
        }

        resolve(text);
      } catch (err: any) {
        reject(new Error(`Failed to extract text from PDF: ${err.message}`));
      }
    });

    try {
      pdfParser.parseBuffer(buffer);
    } catch (err: any) {
      reject(new Error(`PDF parsing exception: ${err.message}`));
    }
  });
}

/**
 * 3. Word Document Extractor using mammoth
 */
async function parseDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value ? result.value.trim() : '';

    // Safeguard: Empty document check
    if (!text || text.length < 20) {
      throw new Error(
        'Unable to extract text from Word document. The file may be blank or contain unreadable formatting.'
      );
    }

    return text;
  } catch (error: any) {
    if (error.message.includes('scanned image') || error.message.includes('blank')) {
      throw error;
    }
    throw new Error(`Failed to process DOCX document: ${error.message || 'Corrupted or unreadable file.'}`);
  }
}

/**
 * 4. Main Entry Point
 * Orchestrates validation and routes to the appropriate parser engine.
 */
export async function parseDocument(
  buffer: Buffer,
  fileName: string,
  mimeType?: string
): Promise<ParseResult> {
  // Step 1: Validate constraints
  const fileType = validateFile(buffer, fileName, mimeType);

  // Step 2: Execute type-specific extraction
  let extractedText = '';
  if (fileType === 'pdf') {
    extractedText = await parsePDF(buffer);
  } else {
    extractedText = await parseDOCX(buffer);
  }

  return {
    text: extractedText,
    fileName,
    fileType,
  };
}
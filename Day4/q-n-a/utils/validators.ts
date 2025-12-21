export function validatePDF(file: File) {
  if (file.type !== "application/pdf") {
    throw new Error("Only PDFs allowed");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("PDF too large");
  }
}

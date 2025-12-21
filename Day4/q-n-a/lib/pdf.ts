export async function parsePDF(buffer: Buffer): Promise<string> {
  // Dynamically import Node-friendly pdfjs build
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.js");
  const { getDocument } = pdfjs;

  const loadingTask = getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(" ") + "\n";
  }

  return fullText;
}

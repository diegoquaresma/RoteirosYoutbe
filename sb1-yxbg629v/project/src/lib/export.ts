import { jsPDF } from 'jspdf';
import { marked } from 'marked';
import { toPng } from 'html-to-image';
import { Language } from '../types';

export type ExportFormat = 'pdf' | 'markdown' | 'html' | 'image';

export async function exportScript(
  title: string,
  language: Language,
  content: string[],
  format: ExportFormat
): Promise<void> {
  switch (format) {
    case 'pdf':
      await exportToPDF(title, language, content);
      break;
    case 'markdown':
      exportToMarkdown(title, language, content);
      break;
    case 'html':
      exportToHTML(title, language, content);
      break;
    case 'image':
      await exportToImage(title);
      break;
  }
}

async function exportToPDF(title: string, language: Language, content: string[]): Promise<void> {
  const pdf = new jsPDF();
  
  // Add title
  pdf.setFontSize(20);
  pdf.text(title, 20, 20);
  
  // Add language
  pdf.setFontSize(12);
  pdf.text(`Language: ${language}`, 20, 30);
  
  // Add content
  pdf.setFontSize(12);
  let y = 40;
  
  content.forEach((section, index) => {
    // Add section number
    pdf.text(`Section ${index + 1}`, 20, y);
    y += 10;
    
    // Split text into lines that fit the page width
    const lines = pdf.splitTextToSize(section, 170);
    
    // Add lines to PDF
    lines.forEach(line => {
      // Check if we need a new page
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, 20, y);
      y += 7;
    });
    
    y += 10; // Add space between sections
  });
  
  pdf.save(`${title.replace(/\s+/g, '_')}_${language}.pdf`);
}

function exportToMarkdown(title: string, language: Language, content: string[]): void {
  let markdown = `# ${title}\n\n`;
  markdown += `**Language:** ${language}\n\n`;
  
  content.forEach((section, index) => {
    markdown += `## Section ${index + 1}\n\n${section}\n\n`;
  });
  
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  downloadBlob(blob, `${title.replace(/\s+/g, '_')}_${language}.md`);
}

function exportToHTML(title: string, language: Language, content: string[]): void {
  const markdown = `# ${title}\n\n**Language:** ${language}\n\n` +
    content.map((section, index) => `## Section ${index + 1}\n\n${section}`).join('\n\n');
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1 { color: #1a365d; }
    h2 { color: #2c5282; }
  </style>
</head>
<body>
  ${marked(markdown)}
</body>
</html>`;
  
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  downloadBlob(blob, `${title.replace(/\s+/g, '_')}_${language}.html`);
}

async function exportToImage(title: string): Promise<void> {
  const element = document.querySelector('.main-content');
  if (!element) return;
  
  try {
    const dataUrl = await toPng(element as HTMLElement, {
      quality: 0.95,
      backgroundColor: 'white'
    });
    
    const link = document.createElement('a');
    link.download = `${title.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting to image:', error);
    throw error;
  }
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
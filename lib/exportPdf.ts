import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPdf(slug: string, name: string): Promise<void> {
  const url = `/p/${slug}`;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-9999px';
  iframe.style.left = '-9999px';
  iframe.style.width = '1200px';
  iframe.style.height = '800px';
  iframe.style.opacity = '0';
  document.body.appendChild(iframe);

  await new Promise<void>((resolve) => {
    iframe.onload = () => resolve();
    iframe.src = url;
  });

  await new Promise((r) => setTimeout(r, 1000));

  const doc = iframe.contentDocument;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  const canvas = await html2canvas(doc.body, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    width: 1200,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = pdfHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
  heightLeft -= pdf.internal.pageSize.getHeight();

  while (heightLeft > 0) {
    position -= pdf.internal.pageSize.getHeight();
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();
  }

  pdf.save(`portfolio-${name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  document.body.removeChild(iframe);
}

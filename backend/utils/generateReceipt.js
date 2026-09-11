const PDFDocument = require('pdfkit');

/**
 * Generates a PDF receipt matching the specifications in movieREADME.md
 * @param {Object} bookingDetails - populated booking object with show, movie, theatre, user info
 * @param {Stream} res - Express response stream
 */
const generateReceiptPDF = (bookingDetails, res) => {
  const doc = new PDFDocument({ margin: 40, size: 'A5' });

  doc.pipe(res);

  // Background / Border styling
  doc.rect(15, 15, doc.page.width - 30, doc.page.height - 30)
     .lineWidth(2)
     .strokeColor('#e50914')
     .stroke();

  doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
     .lineWidth(0.5)
     .strokeColor('#cccccc')
     .stroke();

  // Header
  doc.fillColor('#e50914')
     .fontSize(22)
     .font('Helvetica-Bold')
     .text('CINEMA BOOKING', { align: 'center' });

  doc.moveDown(0.2);
  doc.fillColor('#333333')
     .fontSize(12)
     .font('Helvetica')
     .text('========================================', { align: 'center' })
     .font('Helvetica-Bold')
     .fontSize(14)
     .text('MOVIE BOOKING RECEIPT', { align: 'center' })
     .font('Helvetica')
     .fontSize(12)
     .text('========================================', { align: 'center' });

  doc.moveDown(0.8);

  const leftMargin = 50;
  const labelWidth = 100;

  const printRow = (label, value, isBold = false) => {
    const y = doc.y;
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#444444').text(`${label}:`, leftMargin, y);
    doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica')
       .fontSize(11)
       .fillColor(isBold ? '#111111' : '#222222')
       .text(String(value || 'N/A'), leftMargin + labelWidth, y);
    doc.moveDown(0.6);
  };

  const movie = bookingDetails.showId?.movieId || {};
  const theatre = bookingDetails.showId?.theatreId || {};
  const show = bookingDetails.showId || {};

  printRow('Movie', movie.title || 'Movie Name', true);
  printRow('Theatre', theatre.name || 'Theatre Name');
  printRow('Screen', show.screen || 'Screen 1');
  printRow('Date', show.date || 'N/A');
  printRow('Time', show.startTime || 'N/A');
  printRow('Seats', (bookingDetails.seats || []).join(', '), true);
  printRow('Amount', `Rs. ${bookingDetails.totalAmount}`, true);
  printRow('Payment Mode', 'PAY AT COUNTER');
  printRow('Payment Status', bookingDetails.paymentStatus || 'PENDING');

  doc.moveDown(0.5);

  // Booking Code Banner
  doc.rect(40, doc.y, doc.page.width - 80, 45)
     .fillColor('#f7f7f9')
     .fill()
     .strokeColor('#e50914')
     .lineWidth(1)
     .stroke();

  doc.fillColor('#e50914')
     .fontSize(11)
     .font('Helvetica-Bold')
     .text('BOOKING CODE', 40, doc.y - 40, { align: 'center' });

  doc.fillColor('#111111')
     .fontSize(18)
     .font('Helvetica-Bold')
     .text(bookingDetails.bookingCode, { align: 'center' });

  doc.moveDown(1.5);

  // Counter Instructions Notice Box
  doc.fillColor('#666666')
     .fontSize(11)
     .font('Helvetica')
     .text('----------------------------------------', { align: 'center' });

  doc.fillColor('#b91c1c')
     .fontSize(12)
     .font('Helvetica-Bold')
     .text('Show this receipt at the counter', { align: 'center' })
     .text('to pay and get the ticket.', { align: 'center' });

  doc.fillColor('#666666')
     .fontSize(11)
     .font('Helvetica')
     .text('----------------------------------------', { align: 'center' });

  doc.moveDown(0.5);
  doc.fontSize(9)
     .fillColor('#888888')
     .font('Helvetica')
     .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });

  doc.end();
};

module.exports = generateReceiptPDF;

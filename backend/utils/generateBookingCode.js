const crypto = require('crypto');

/**
 * Generates a random unique booking code, e.g., MVB-739251
 */
const generateBookingCode = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit number
  return `MVB-${randomNum}`;
};

module.exports = generateBookingCode;

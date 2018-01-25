module.exports = function (hex) {
  if (hex.length === 7) return hex;

  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  return hex.padEnd(7, '0');
};

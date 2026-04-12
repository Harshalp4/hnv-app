export function formatINR(n: number): string {
  return Math.round(n).toLocaleString('en-IN');
}

export function formatDecimal(n: number): string {
  return parseFloat(String(n)).toFixed(2);
}

export function numberToWordsIndian(n: number): string {
  n = Math.round(n);
  if (!n) return 'Nil';
  const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function toWords(num: number): string {
    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? ' ' + a[num % 10] : '');
    if (num < 1000) return a[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' and ' + toWords(num % 100) : '');
    if (num < 100000) return toWords(Math.floor(num / 1000)) + ' thousand' + (num % 1000 ? ' ' + toWords(num % 1000) : '');
    if (num < 10000000) return toWords(Math.floor(num / 100000)) + ' lakh' + (num % 100000 ? ' ' + toWords(num % 100000) : '');
    return toWords(Math.floor(num / 10000000)) + ' crore' + (num % 10000000 ? ' ' + toWords(num % 10000000) : '');
  }

  return 'Rupees ' + toWords(n) + ' only';
}

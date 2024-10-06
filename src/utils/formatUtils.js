export function formatToBrazilDate(inputString) {
    if (inputString == null) {
        return
    }
try {
    const date = new Date(inputString);
    const options = { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
  
    return date.toLocaleDateString('en-GB', options);
} catch (error) {
    console.error('erro na conversao de Date',error)
}  
  
  }
  
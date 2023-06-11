const axios = require('axios');

const getBooks = async () => {
  try {
    const response = await axios.get('https://yudhae-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
    const books = response.data;
    return books;
  } catch (error) {
    throw error;
  }
};

(async () => {
  try {
    const books = await getBooks();
    console.log('Books:', books);
  } catch (error) {
    console.error('Error:', error);
  }
})();
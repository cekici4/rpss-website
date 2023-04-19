const fetch = require('node-fetch');

fetch('file://CHVPRDRPPS/RPPS/public/function1.ps')
  .then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('HTTP error ' + response.status);
    }
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });

const form = document.createElement('form');
form.method = 'POST';

const hiddenField = document.createElement('input');
hiddenField.type = 'hidden';
hiddenField.name = 'price'
hiddenField.value = Math.floor(Math.random() * 10000000); 

form.appendChild(hiddenField);
  
document.body.appendChild(form);
form.submit();
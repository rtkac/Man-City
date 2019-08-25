export const firebaseLooper = (snapshot) => {
  let data = [];
  
  snapshot.forEach((snapshotItem) => {
    data.push({
      ...snapshotItem.val(),
      id: snapshotItem.key
    });
  });

  return data;
};

export const reverseArray = (actualArray) => {
  let newArray = [];

  actualArray.slice().reverse().forEach((arrayItem) => {
    newArray.push(arrayItem);
  });

  return newArray;
}

export const validate = (element) => {
  let error = [true, ''];

  if(element.validation.email) {
    let valid = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(element.value);
    let errorMessage = `${!valid ? 'Must be a valid email' : ''}`;
    error = !valid ? [valid, errorMessage] : error;
  }

  if(element.validation.required) {
    let valid = element.value.trim() !== '';
    let errorMessage = !valid ? `${element.config.title} is required` : '';
    error = !valid ? [valid, errorMessage] : error;
  }

  return error;
}
function modalToggle(name){
  let element = document.querySelector(name);
  if (element.classList.contains('active')){
    element.classList.remove('active')
  }else {
    element.classList.add('active')
  }
}
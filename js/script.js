import { myApi } from './api.js';
//selectors
const modalBtm = document.querySelector('.slider__info__form_btn');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close__btn');
const modalCancel = document.querySelector('.modal__btn__close');
const container = document.querySelector('.container');
const closeBtns = [modalClose, modalCancel];
const sendFormBtn = document.querySelector('.modal__btn__send');
const nameInput = document.querySelector('.modal__input__name');
const telInput = document.querySelector('.modal__input__tel');
const ModalForm = document.querySelector('.modal__form');
const spinner = document.querySelector('.spinner')
//error selector
const errorModal = document.createElement('div');

let users = [];

window.addEventListener("DOMContentLoaded", () => {
  //for tel input validtion regexp 
  function telephoneCheck(str) {
    const patt = new RegExp(/^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm);
    return patt.test(str);
  }

  //Create primitive table and users 
  const createUser = (name, id, tittle) => {
    let newUser = document.createElement('div');
    newUser.classList.add('tabble');
    let namehtml = document.createElement('h4');
    namehtml.textContent = `Name: ${name}`;
    let idhtml = document.createElement('div');
    idhtml.textContent = `ID: ${id}`
    let tittlehtml = document.createElement('h3');
    tittlehtml.textContent = `Status: ${tittle}`;
    const line = document.createElement('hr');
    newUser.append(namehtml, idhtml, tittlehtml)
    newUser.append(line);
    return newUser;
  }

  //remove modal window function
  const removeModal = () => {
    modal.classList.remove('on');
    modalBtm.removeAttribute('disabled');
    container.classList.remove('shadow');
    document.body.style.overflow = "";
  }
  //open modal window function
  const openModal = () => {
    modal.classList.add('on');
    modalBtm.setAttribute('disabled', true);
    container.classList.add('shadow');
    document.body.style.overflow = "hidden";
  }
  //open modal on click
  modalBtm.addEventListener('click', () => {
    openModal();
  })

  //close modal on click
  closeBtns.forEach(item => {
    item.addEventListener('click', () => {
      removeModal();
    })
  })

  //oninput validation
  telInput.oninput = () => {
    if (telephoneCheck(telInput.value) === true && nameInput.value.length >= 3 && telInput.value.length >= 11) {
      sendFormBtn.removeAttribute('disabled');
      sendFormBtn.style.boxShadow = '0 0 2px 2px green'
    } else {
      sendFormBtn.setAttribute('disabled', true);
      sendFormBtn.style.boxShadow = '0 0 2px 2px red'
    }
  };
  const tableinModal = () => {
      ModalForm.style.display = 'none';
            users.forEach(user => {
              modal.append(createUser(user.name || 'empty name', user.id || 'empty id', user.title || 'empty tittle'));
            })
            openModal();
            spinner.style.display = "none"
            nameInput.value = "";
            telInput.value = "";
            console.log(users);
  };

  //send data from form
  sendFormBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    removeModal();
    spinner.style.display = "block"
    if (nameInput.value != '' && nameInput.value.length > 3 && telInput.value != '' && telInput.value.length >= 10) {
      const data = {
        name: nameInput.value,
        tel: telInput.value
      }
      const json = JSON.stringify(data);

      try {
        let newdata = await myApi('https://jsonplaceholder.typicode.com/todos');

        await newdata.forEach(user => {
          if (user.userId === 5 && user.completed === false) {
            users.push(user);
          }
        })
        await tableinModal();
        
      } catch (e) {
        spinner.style.display = "none"
        ModalForm.style.display = 'none';
        errorModal.textContent = `something is wrong while fetching, refresh and try more`
        openModal();
        modal.append(errorModal);
        throw new Error('error fetch data');
      }
    }
  })
})

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
const numberInput = document.getElementById('numberInput');
const submitButton = document.getElementById('submitButton');

numberInput.min = "1";
numberInput.step = "1";

submitButton.addEventListener('click', generateFacts);

numberInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        generateFacts();
    }
});

numberInput.addEventListener('input', function(event) {
    validateInput(event.target);
});
});

function validateInput(input) {
    const value = input.value.trim();
  
    if (value === '') return;
  
    const number = Number(value);
  
    if (!Number.isInteger(number) || number <= 0) {
      input.value = '';
      document.getElementById('message').textContent = 'Вводите только целое положительное число!';
    }
  }

function getNumber() {
    const inputElement = document.getElementById('numberInput');
    const number = inputElement.value;
    const message = document.getElementById('message');
    
    if (number === '') {
        message.textContent = 'Нужно ввести число!';
        return null;
    }
    
    const numericValue = parseInt(number);
    
    if (isNaN(numericValue)) {
        message.textContent = 'Введите корректное число!';
        return null;
    }
    message.textContent = '';
    return numericValue;
}

async function fetchCatFacts(count) {
    try {
        const response = await fetch(`https://meowfacts.herokuapp.com/?count=${count}`);
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        const data = await response.json();
        return data.data; 
    } catch (error) {
        console.error(error);
        return null;
    }
}

function showFacts(facts) {
    const factsContainer = document.getElementById('facts');
    factsContainer.innerHTML = ''; 

    if (!facts || facts.length === 0) {
        factsContainer.textContent = 'Факты не найдены';
        return;
    }

    facts.forEach((fact, index) => {
        const div = document.createElement('div');
        div.className = 'fact';
        const pNumber = document.createElement('p');
        pNumber.className = 'factNumber';
        pNumber.textContent = `Fact №${index + 1}`;
        const pText = document.createElement('p');
        pText.className = "factText";
        pText.textContent = fact;
        div.appendChild(pNumber);
        div.appendChild(pText);
        factsContainer.appendChild(div);
    });
}

async function generateFacts() {
    const number = getNumber(); 
    if (!number) return; 

    const facts = await fetchCatFacts(number);
    showFacts(facts);

    document.getElementById('numberInput').value = ''; 
}

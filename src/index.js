// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы
    const numberInput = document.getElementById('numberInput');
    const submitButton = document.getElementById('submitButton');
    
    // Устанавливаем минимальное значение (не позволяет вводить отрицательные числа и 0 через UI)
    numberInput.min = "1";
    numberInput.step = "1";
    
    // Обработчик клика по кнопке
    submitButton.addEventListener('click', function() {
        getNumber();
    });
    
    // Обработчик нажатия Enter в поле ввода
    numberInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            getNumber();
        }
    });
    
    // Обработчик ввода - предотвращаем ввод отрицательных чисел и 0
    numberInput.addEventListener('input', function(event) {
        validateInput(event.target);
    });
});

function validateInput(input) {
    const value = parseFloat(input.value);
    
    // Если значение меньше или равно 0, очищаем поле
    if (value <= 0) {
        input.value = '';
    }
}

function getNumber() {
    // Получаем значение из поля ввода
    const inputElement = document.getElementById('numberInput');
    const number = inputElement.value;
    const answer = inputElement.placeholder;
    
    // Проверяем, что поле не пустое
    if (number === '') {
        answer('Пожалуйста, введите число!', 'error');
        return null;
    }
    
    // Преобразуем в число
    const numericValue = parseFloat(number);
    
    // Проверяем, что это валидное число
    if (isNaN(numericValue)) {
        answer('Пожалуйста, введите корректное число!', 'error');
        return null;
    }
    
    // Проверяем, что число положительное и не равно 0
    if (numericValue <= 0) {
        answer('Число должно быть положительным и больше 0!', 'error');
        return null;
    }
    return numericValue;
}

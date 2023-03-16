// Массив для хранения комментариев
let comments = [];

// Получаем кнопку для отправки комментария
const submitButton = document.getElementById('comment-add');

// Функция для сохранения комментариев в localStorage
const saveComments = () => {
    localStorage.setItem('comments', JSON.stringify(comments))
};

// Функция для отображения всех комментариев на странице
const showComments = () => {
    // Получаем поле для вывода комментариев
    let commentField = document.querySelector('.comments');
    let out = '';
    // Проходимся по всем комментариям в массиве comments
    comments.forEach((comment, index) => {
        // Добавляем каждый комментарий в HTML-разметку
        out += `<div class="comments__item comment">
                    <div class="comment__info info">
                        <ul class="info__list">
                            <li class="info__item"><h2 class="info__name">${comment.name}</h2></li>
                            <li class="info__item"><h2 class="info__date">${comment.date}</h2></li>
                        </ul>
                    </div>
                    <div class="comment__main-part main-part">
                        <div class="main-part__text">
                        ${comment.text}
                        </div>

                        <div class="main-part__buttons">
                            <ion-icon name="heart" class = "heart">
                                    <div class='red-bg'></div>
                            </ion-icon>
                            <ion-icon name="trash-bin-outline" class="remove-comment" data-index="${index}"></ion-icon>
                        </div>
                    </div>
                </div>`
    })
    // Выводим все комментарии на странице
    commentField.innerHTML = out

    // Добавляем обработчик событий для всех иконок "heart"
    const icons = document.querySelectorAll('.heart');
    icons.forEach((item) => {
        item.onclick = () => {
            item.classList.toggle('active')
        }
    })

    // Добавляем обработчик событий для всех кнопок удаления комментариев
    const removeButtons = document.querySelectorAll('.remove-comment');
    removeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            // Удаляем комментарий из массива comments
            comments.splice(index, 1);
            // Сохраняем измененный массив комментариев в localStorage
            saveComments();
            // Перерисовываем все комментарии на странице
            showComments();
        });
    });

};

// Функция, вызываемая при отправке формы
const formSubmit = (e) => {
    console.log(e.key); // выводим в консоль нажатую клавишу
    e.preventDefault(); // отменяем стандартное поведение формы
    let commentName = document.getElementById('comment-name'); // получаем поле ввода имени комментатора
    let commentBody = document.getElementById('comment-body'); // получаем поле ввода комментария
    let commentDate = document.getElementById('comment-date'); // получаем поле ввода даты комментария
    let errorField = document.querySelector('.error'); // получаем поле вывода ошибок

    let currentDate = new Date(Date.now()); // получаем текущую дату
    let parsedDate = new Date(commentDate.value) // парсим введенную пользователем дату

    if (parsedDate.toString() === 'Invalid Date') parsedDate = currentDate // если введенная дата некорректна, используем текущую дату

    let currentDateFormat = currentDate.toString().split(' '); // преобразуем текущую дату в массив строк
    let parsedDateFormat = parsedDate.toString().split(' '); // преобразуем введенную дату в массив строк

    // добавляем обработчики ввода для полей имени и комментария
    commentName.addEventListener('input', () => {
        if (commentName.value !== '') errorField.style.display = 'none' // если поле имени не пустое, скрываем поле ошибок
    })

    commentBody.addEventListener('input', () => {
        if (commentBody.value !== '') errorField.style.display = 'none' // если поле комментария не пустое, скрываем поле ошибок
    })

    // если поле имени или комментария пустые, выводим ошибку и прерываем выполнение функции
    if (commentName.value === '' || commentBody.value === '') {
        errorField.style.display = 'flex'
        if (commentName.value === '') errorField.innerHTML = 'Введите имя!'
        else {
            if (commentBody.value === '') errorField.innerHTML = 'Введите комментарий'
        }
        return
    }
    else {
        errorField.style.display = 'none' // если поля заполнены, скрываем поле ошибок
    }

    console.log(currentDate); // выводим текущую дату в консоль
    console.log(parsedDate); // выводим введенную пользователем дату в консоль

    // создаем объект комментария с именем, текстом, датой
    let comment = {
        name: commentName.value,
        text: commentBody.value,
        date: `${parsedDateFormat[2]} ${parsedDateFormat[1]}, ${parsedDateFormat[3]}, ${parsedDateFormat[4]}`,
    }

    // Проверка на сегодняшнюю/завтрашнюю дату

    if (currentDateFormat[1] === parsedDateFormat [1] && currentDateFormat[2] === parsedDateFormat[2] && currentDateFormat[3] === parsedDateFormat[3]) {
        comment.date = `Сегодня, ${currentDateFormat[4]}`
    }

    if (currentDateFormat[1] === parsedDateFormat [1] && +currentDateFormat[2]-1 === +parsedDateFormat[2] && currentDateFormat[3] === parsedDateFormat[3]) {
        comment.date = `Вчера, ${currentDateFormat[4]}`
    }

    //Вставляем комментарий в массив комментариев

    comments.push(comment)

    // Очищаем форму

    commentName.value = '';
    commentBody.value = '';
    commentDate.value = '';

    // Сохраняем комментарии в localStorage
    saveComments()

    // Выводим комментарии в HTML

    showComments()
}

// Функция выгрузки комментариев из localStorage
const loadComments = () => {
    if (localStorage.getItem('comments')) comments = JSON.parse(localStorage.getItem('comments'))
    showComments()
};

// Выгружение комментариев

loadComments()

// Отправка комментария по нажатию на кнопку/enter

submitButton.onclick = formSubmit
document.addEventListener("keypress", function(event) {
    if (event.key === 'Enter') {
        formSubmit();
    }
});
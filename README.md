<h1 align="center">💬 Сomments block</h1>

<p align="center">
    <img height="100px" alt="HTML, CSS, JS" src="https://user-images.githubusercontent.com/99616798/225798818-8fdb9041-e98d-427a-bd68-c56ba7babdc6.png" />
</p>

<p align="center">
   <span>A block with comments and a form for adding a comment.</span>
</p>

<p align="center">
   <a href="https://vc.ru/">Style reference</a>
</p>


## 🔗 Github Pages

Live link: [Comments page](https://safym.github.io/comments/)

## 🖥️ Screenshots

<p align="center">
    <img height="320px" src="https://user-images.githubusercontent.com/99616798/225784938-98369776-37c3-48d0-9338-786804166a0c.png" />
    <img height="320px" src="https://user-images.githubusercontent.com/99616798/225786138-ba2c3cb8-0619-4327-8b42-33b115dcf8c1.png" />
</p>

## 📑 Implementation [EN]:
The form of addition, the wrapper of the list of comments is logically an instance of the *CommentSection* class.

Features of behavior:

* **Validation of** fields and messages about incorrect data entered:
+ Username: non-empty from 5 to 30 characters
+ Date: non-empty and no more than today's date
+ Text: non-empty from 3 to 1500 characters
* **Submit** of the form occurs by clicking the "Comment" button or by pressing Enter if the fields (username, date, text) are valid. The date may not be specified, then the date and time of the comment is the current one.
* Added input data cleaning **(Input sanitization)** to filter input data from unwanted characters and strings to prevent the introduction of malicious codes into the system.
* textarea field with the ability to **autoresize** - stretches in height, depending on the entered value
* **Total number of comments** shows the current number, reflecting the deletion and addition of comments

The comment element from the list of comments is logically an instance of the Comment class.

Features of behavior:

* **Comment date** takes the value:
+ Today hh:mm : if the publication date is today
+ Yesterday hh:mm : if the publication date is yesterday
+ dd.mm.yyyy : if the publication date is earlier than yesterday's date
* **Actions**:
+**Like** affects the likes counter
+ **Deleting** removes an element from the DOM and from the data
        
## 📑 Реализация [RU]:
Форма добавления, обертка списка комментариев логически - экземпляр класса CommentSection.

Особенности поведения:

* **Валидация** полей и сообщения о некоррректных введенных данных:
    + Имя пользователя: непустое от 5 и до 30 символов
    + Дата: непустое и не больше сегодняшней даты
    + Текст: непустое от 3 до 1500 символов
* **Submit** формы происходит по кнопке "Comment" или по нажатию Enter, если поля (имя пользователя, дата, текст) валидны. Дата может быть не указана, тогда дата и время комментария - текущее.
* Добавлена очистка входных данных **(Input sanitization)** для фильтрации входных данных от нежелательных символов и строк для предотвращения внедрения вредоносных кодов в систему.
* Поле textarea с возможностью **autoresize** - растягивается по высоте, в зависимости от введенного значения
* **Общее количество комментариев** показывает актуальное количество, отражая удаление и добавление комментариев

Элемент комментария из списка логически - экзепляр класса Comment. 

Особенности поведения:

* **Дата комментария** принимает значение:
    + Today hh:mm : если дата публикации - сегодня
    + Yesterday hh:mm : если дата публикации - вчера
    + dd.mm.yyyy : если дата публикации - ранее, чем вчера
* **Действия**:
    + **Лайк** влияет на счетчик лайков
    + **Удаление** удаляет элемент из DOM и из данных

// import escapeHtml from '../utils/escape-html.js';

export default class Comments {
  element;
  formElements;
  commentsElement;
  formData = {};

  onSubmit = (event) => {
    event.preventDefault();
    this.save()
  }

  textareaOnKeypress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      const submitEvent = new SubmitEvent("submit", {
        cancelable: true,
        submitter: this.formElements.button
      });

      this.formElements.commentForm.dispatchEvent(submitEvent);
    }
  }

  constructor(commentsData) {
    this.commentsData = commentsData;

    this.render()
  }

  render() {
    this.element = this.getElement();
    this.formElements = this.getSubElements(this.element, 'formelement');
    this.commentsElement = this.getSubElements(this.element, 'commentelement');

    this.initListeners()

    // console.log(this.element)
    // console.log(this.formElements)
    // console.log(this.commentsElement)

    return this.element
  }

  save() {
    this.setFormData()
    this.addNewComment(this.formData)
  }

  setFormData() {
    for (const key in this.formElements) {
      const elem = this.formElements[key]

      if (elem.tagName === 'FORM' || elem.tagName === 'BUTTON') continue

      switch (elem.type) {
        case 'date':
          this.formData[key] = (elem.value) ? new Date(elem.value) : new Date();
          break;
        default:
          this.formData[key] = elem.value
      }
    }
    console.log(this.formData)
  }

  addNewComment(comment) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getCommentTemplate(comment)

    this.commentsElement.comments.prepend(wrapper.firstElementChild)
    this.commentsData.push(comment)

    this.formElements.commentForm.reset()
  }

  initListeners() {
    this.formElements.text.addEventListener('keypress', this.textareaOnKeypress)
    this.formElements.commentForm.addEventListener('submit', this.onSubmit);

    // this.formElements.date.addEventListener('focusin',function(e){
    //   e.target.type = 'date';
    // });

    // this.formElements.date.addEventListener('focusout',function(e){
    //   e.target.type = '';
    // });
  }

  getElement() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();

    return wrapper.firstElementChild;
  }

  getSubElements(element, datasetName) {
    const result = {};
    const elements = element.querySelectorAll(`[data-${datasetName}]`);

    for (const subElement of elements) {
      const name = subElement.dataset[datasetName];
      result[name] = subElement;
    }

    return result;
  }

  getTemplate() {
    return `
    <div class="comments">
      <form class="comments__form form" action="" data-formelement="commentForm">
        <div>
          <input class="form__username" id="username"  placeholder="Введите имя" type="text" data-formelement="username">
          <input class="form__date" id="date" type="date" placeholder="Укажите дату" data-formelement="date">
        </div>

        <textarea class="form__textarea" placeholder="Введите текст комментария" name="" id="text" cols="30" rows="10"data-formelement="text"></textarea>
        <button class="form__buttonSubmit" aria-pressed="false" data-formelement="button">Comment</button>
      </form>
      <h1>Comments</h1>

      <div class="comments__comments-wrapper comments-wrapper" data-commentelement="comments">
        ${this.commentsData.map((comment) => {
          return this.getCommentTemplate(comment)
        }).join('')}
      </div>
      
    </div>
    `
  }

  getCommentTemplate(commentData) {
    return `
        <div class="comments-wrapper__comment comment">
          <img src="" alt="">
          <h1 class="comment__username">${commentData.username}</h1>
          <p class="comment__text">${commentData.text}</p>
          <p class="comment__date">${this.formatDate(commentData.date)}</p>
          <span class="comment__likeCount">${commentData.likeCount}</span>
          <button class="comment__likeButton">🖤</button>

          <div id="ck-button">
            <label>
                <input type="checkbox" value="1"><span>red</span>
            </label>
          </div>

        </div>
        `
  }

  formatDate(date) {
    const startOfYesterday = new Date();
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)
    startOfYesterday.setHours(0, 0, 0, 0);

    const startOfToday = new Date();
    startOfToday.setDate(startOfToday.getDate())
    startOfToday.setHours(0, 0, 0, 0);

    let day = this.formatDateSegment(date.getDate());
    let month = this.formatDateSegment(date.getMonth() + 1);
    let year = date.getFullYear();
    let hour = this.formatDateSegment(date.getHours());
    let min = this.formatDateSegment(date.getMinutes());

    switch (true) {
      case date.getTime() >= startOfToday.getTime():
        return `Сегодня ${hour}:${min}`;

      case date.getTime() >= startOfYesterday.getTime() && date.getTime() < startOfToday.getTime():
        return `Вчера ${hour}:${min}`;

      default:
        return `${day}.${month}.${year} ${hour}:${min}`
    }
  }

  formatDateSegment(dateSegment) {
    return (dateSegment < 10) ? '0' + dateSegment : dateSegment
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove()
    this.element = null;
  }
}

class Comment {
  constructor(commentData) {
    this.data = commentData;
  }
}
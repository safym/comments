// import escapeHtml from './src/utils/escape-html.js';

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

    this.loadComments()
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

      this.formData['likeCount'] = 0;
    }
    console.log(this.formData)
  }

  addNewComment(commentData) {
    const comment = new Comment(commentData);

    this.commentsElement.comments.prepend(comment.element)
    this.commentsData.push(commentData)

    this.formElements.commentForm.reset()
  }

  loadComments() {
    this.commentsData.map((commentData) => {
      const comment = new Comment(commentData);

      this.commentsElement.comments.append(comment.element)
    })
  }

  initListeners() {
    this.formElements.text.addEventListener('keypress', this.textareaOnKeypress)
    this.formElements.commentForm.addEventListener('submit', this.onSubmit);

    this.formElements.button.addEventListener("click", () => console.log('fjfjffj'));

    this.formElements.commentForm.addEventListener("focus", () => this.formElements.commentForm.classList.add('form_focused'), true);
    this.formElements.commentForm.addEventListener("blur", () => this.formElements.commentForm.classList.remove('form_focused'), true)

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
      <h1 class="comments__header">${this.commentsData.length} Comments</h1>
      <form class="comments__form form" action="" data-formelement="commentForm">
        <div>
          <input class="form__username" id="username"  placeholder="Введите имя" type="text" data-formelement="username">
          <input class="form__date" id="date" type="date" placeholder="Укажите дату" data-formelement="date">
        </div>
        <textarea class="form__textarea" placeholder="Введите текст комментария" name="" id="text" cols="30" rows="4"data-formelement="text"></textarea>
        <div class="form__borderline"></div>
        <button class="form__button-submit" disabled aria-pressed="false" data-formelement="button">Comment</button>
      </form>
      <div class="comments__comments-wrapper comments-wrapper" data-commentelement="comments"></div>
    </div>
    `
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

// COMMENT CLASS //

class Comment {

  likeOnClick = (event) => {
    event.preventDefault();
    alert('like')
  }

  constructor(commentData) {
    this.data = commentData;

    this.render()
  }

  render() {
    this.element = this.getElement();
    this.subElements = this.getSubElements(this.element);

    this.initListeners()

    return this.element
  }

  initListeners() {
    this.subElements.likeButton.addEventListener("click", this.likeOnClick);
  }

  getElement() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate(this.data);

    return wrapper.firstElementChild;
  }

  getTemplate(commentData) {
    return `
        <div class="comments-wrapper__comment comment">
          <div class="comment__title-wrapper">
            <a class="comment__user-preview">${this.getUserPreview(commentData.username)}</a>
            <a class="comment__username">${commentData.username}</a>
            <p class="comment__date">${this.formatDate(commentData.date)}</p>
          </div>
          <p class="comment__text">${commentData.text}</p>

          <span class="comment__like-wrapper">
            <button class="comment__like-button" data-element="likeButton">
              <svg class="style_saved__kYktV" title="Like Like SVG File" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#828282" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                </path>
              </svg>
            </button>
            <span class="comment__like-count" data-element="likeCount">${commentData.likeCount}</span>
          </span>

        </div>
        `
  }

  getUserPreview(username) {
    return username[0]
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
        return `Today ${hour}:${min}`;

      case date.getTime() >= startOfYesterday.getTime() && date.getTime() < startOfToday.getTime():
        return `Yesterday ${hour}:${min}`;

      default:
        return `${day}.${month}.${year} ${hour}:${min}`
    }
  }

  formatDateSegment(dateSegment) {
    return (dateSegment < 10) ? '0' + dateSegment : dateSegment
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset['element'];
      result[name] = subElement;
    }

    return result;
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
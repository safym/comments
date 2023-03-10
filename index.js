// import escapeHtml from './src/utils/escape-html.js';

export default class CommentsSection {
  element;
  formElements;
  subElements;

  isValid;

  formData = {
    likeCount: 0
  };

  onSubmit = (event) => {
    event.preventDefault()
    this.save()
  }

  textareaOnKeypress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      const submitEvent = new SubmitEvent("submit", {
        cancelable: true,
        submitter: this.subElements.formButton
      });

      this.subElements.commentForm.dispatchEvent(submitEvent);
    }
  }

  onInput = (event) => {
    const elementName = event.target.dataset.formelement
    const target = event.target

    switch (target.type) {
      case 'date':
        this.formData[elementName] = this.getDate(target.value)
        break;
      default:
        this.formData[elementName] = target.value
    }

    this.setValidation()

    console.log(this.formData)
  }

  autoResize = (event) => {
    const offset = event.target.offsetHeight - event.target.clientHeight;
    event.target.style.height = 'auto'
    event.target.style.height = event.target.scrollHeight + offset + 'px'
  }

  formToggle = (event) => {
    (event.type === 'focus')  
    ? this.subElements.commentForm.classList.add('form_focused')
    : this.subElements.commentForm.classList.remove('form_focused')
  }

  constructor(commentsData) {
    this.commentsData = commentsData

    this.render()
  }

  render() {
    this.element = this.getElement()
    this.formElements = this.getSubElements(this.element, 'formelement')
    this.subElements = this.getSubElements(this.element, 'subelement')

    this.setDefaultValues()
    this.loadComments()
    this.initListeners()

    console.log(this.element)
    console.log(this.formElements)
    console.log(this.subElements)

    return this.element
  }

  getDate(dateValue = '') {
    const today = new Date().toISOString().split('T')[0]

    if (dateValue === today || dateValue === '') {
      return new Date()
    } else {
      return new Date(dateValue)
    }
  }

  setDefaultValues() {
    const today = new Date().toISOString().split('T')[0];

    this.formElements.date.value = today
    this.formElements.date.max = today

    this.formData.date = this.getDate(today)
  }

  formReset() {
    this.formData = {
      likeCount: 0
    };

    this.subElements.commentForm.reset()
    this.formElements.text.style.height = 'auto';
    this.setDefaultValues()

    this.setValidation()
  }


  save() {
    this.isValid = this.checkValidationFrom()

    if (this.isValid) {
      this.addNewComment(this.formData)
      this.formReset()
    }
  }

  setValidation() {
    this.isValid = this.checkValidationFrom()

    this.toggleSubmitButton()
    this.setMessage()
  }

  checkValidationFrom() {
    let formIsValid = true

    for (const key in this.formElements) {
      const elem = this.formElements[key]

      if (!this.formData[key]) {
        formIsValid = false;
        elem.classList.add('form-field_state_invalid')
      } else {
        elem.classList.remove('form-field_state_invalid')
      }
    }

    return formIsValid
  }

  toggleSubmitButton() {
    this.subElements.formButton.disabled = !this.isValid
  }

  setMessage() {
    if (this.isValid) {
      this.subElements.message.innerHTML = ''
    } else {
      this.subElements.message.innerHTML = 'Fill in all the fields'
    }
  }

  addNewComment(commentData) {
    const comment = new Comment(commentData)

    this.subElements.comments.prepend(comment.element)
    this.commentsData.push(commentData)

    this.updateCommentsCount()
  }

  loadComments() {
    this.commentsData.map((commentData) => {
      const comment = new Comment(commentData)

      this.subElements.comments.append(comment.element)
    })
  }

  updateCommentsCount() {
    this.subElements.commentsCount.innerHTML = this.commentsData.length
  }

  initListeners() {
    this.formElements.text.addEventListener('keypress', this.textareaOnKeypress)

    this.formElements.username.addEventListener('input', this.onInput)
    this.formElements.date.addEventListener('input', this.onInput)
    this.formElements.text.addEventListener('input', this.onInput)

    this.formElements.text.addEventListener('input', this.autoResize)

    this.subElements.commentForm.addEventListener('submit', this.onSubmit)

    this.subElements.commentForm.addEventListener("focus", this.formToggle, true);
    this.subElements.commentForm.addEventListener("blur", this.formToggle, true)
  }

  getElement() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();

    return wrapper.firstElementChild;
  }

  getSubElements(element, datasetName) {
    const result = {};
    const elements = element.querySelectorAll(`[data-${datasetName}]`)

    for (const subElement of elements) {
      const name = subElement.dataset[datasetName]
      result[name] = subElement
    }

    return result;
  }

  getTemplate() {
    return `
    <div class="comments">
    <div class="form__borderline"></div>
      <h1 class="comments__header">
        <span data-subelement="commentsCount">${this.commentsData.length}</span>
        Comments
      </h1>
      <form class="comments__form form" action="" data-subelement="commentForm">
        <div class="form__title-wrapper">
          <input class="form__username form-field" value="" maxlength="30" required autofocus placeholder="Enter your name" type="text" data-formelement="username" />
          <input class="form__date form-field" type="date" data-formelement="date" />
        </div>
        <textarea class="form__textarea form-field" required placeholder="Add a comment..." name="text" cols="30" rows="3" data-formelement="text"></textarea>
        <div class="form__footer-wrapper">
          <p class="form__message" data-subelement="message"></p>
          <button class="form__button-submit" type="submit" disabled aria-pressed="false" data-subelement="formButton">Comment</button>
        </div>
        </form>
      <div class="comments__comments-wrapper comments-wrapper" data-subelement="comments"></div>
    </div>
    `
  }

  remove() {
    if (this.element) {
      this.element.remove()
    }
  }

  destroy() {
    this.remove()
    this.element = null
  }
}

/////////////////////////// COMMENT CLASS /////////////////////////////////////////

class Comment {

  likeOnClick = (event) => {
    event.preventDefault();

    (!this.likeIsActive) 
      ? this.data.likeCount += 1
      : this.data.likeCount -= 1

    this.likeIsActive = !this.likeIsActive;
    this.updateLikesCount()
  }

  constructor(commentData) {
    this.data = commentData;
    this.likeIsActive = false
    this.render()
  }

  render() {
    this.element = this.getElement();
    this.subElements = this.getSubElements(this.element)

    this.initListeners()

    return this.element
  }

  initListeners() {
    this.subElements.likeButton.addEventListener("click", this.likeOnClick)
  }

  getElement() {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = this.getTemplate(this.data)

    return wrapper.firstElementChild
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
              <svg class="comment__like-icon comment__like-icon_state_disabled" data-element="likeIcon" title="Like Like SVG File" width="21" height="21" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                </path>
              </svg>
            </button>
            <span class="comment__like-count" data-element="likeCount">${commentData.likeCount}</span>
          </span>
        </div>
        `
  }

  updateLikesCount() {
    if (this.likeIsActive) {
      this.subElements.likeIcon.classList.remove("comment__like-icon_state_disabled")
      this.subElements.likeIcon.classList.add('comment__like-icon_state_active')
    } else {
      this.subElements.likeIcon.classList.remove("comment__like-icon_state_active")
      this.subElements.likeIcon.classList.add('comment__like-icon_state_disabled')
    }

    this.subElements.likeCount.innerHTML = this.data.likeCount;
  }

  getUserPreview(username) {
    return username[0].toUpperCase()
  }

  formatDate(date) {
    const startOfYesterday = new Date();
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)
    startOfYesterday.setHours(0, 0, 0, 0);

    const startOfToday = new Date();
    startOfToday.setDate(startOfToday.getDate())
    startOfToday.setHours(0, 0, 0, 0);

    let day = this.formatDateSegment(date.getDate());
    let month = this.formatDateSegment(date.getMonth() + 1)
    let year = date.getFullYear();
    let hour = this.formatDateSegment(date.getHours())
    let min = this.formatDateSegment(date.getMinutes())

    switch (true) {
      case date.getTime() >= startOfToday.getTime():
        return `Today ${hour}:${min}`

      case date.getTime() >= startOfYesterday.getTime() && date.getTime() < startOfToday.getTime():
        return `Yesterday ${hour}:${min}`

      default:
        return `${day}.${month}.${year} ${hour}:${min}`
    }
  }

  formatDateSegment(dateSegment) {
    return (dateSegment < 10) ? '0' + dateSegment : dateSegment
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]')

    for (const subElement of elements) {
      const name = subElement.dataset['element']
      result[name] = subElement
    }

    return result;
  }

  remove() {
    if (this.element) {
      this.element.remove()
    }
  }

  destroy() {
    this.remove()
    this.element = null
  }
}
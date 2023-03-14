import escapeHtml from './src/utils/escape-html.js';

export default class CommentsSection {
  element;
  formElements;
  subElements;
  infoElements;

  fieldIsValid = {}
  formIsValid;

  formData = {
    likeCount: 0
  };

  onSubmit = (event) => {
    event.preventDefault()
    this.save()
  }

  onKeypressSubmit = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {

      const submitEvent = new SubmitEvent("submit", {
        cancelable: true,
        submitter: this.subElements.formButton
      });

      this.subElements.commentForm.dispatchEvent(submitEvent);
      event.preventDefault();
    }
  }

  onInput = (event) => {
    const elementName = event.target.dataset.formelement
    const target = event.target

    switch (elementName) {
      case 'date':
        this.formData[elementName] = this.getDate(target.value)
        break;
      case 'username':
        this.formData[elementName] = target.value
        break
      case 'text':
        this.formData[elementName] = target.value
        break
    }

    this.setValid()
  }

  autoResize = (event) => {
    const offset = event.target.offsetHeight - event.target.clientHeight;
    event.target.style.height = 'auto'
    event.target.style.height = event.target.scrollHeight + offset + 'px'
  }

  formToggle = (event) => {
    if (event.type === 'focus') {
      this.subElements.commentForm.classList.add('form_focused')
    } else {
      this.subElements.commentForm.classList.remove('form_focused')
    }
  }

  constructor(commentsData) {
    this.commentsData = commentsData

    this.render()
  }

  render() {
    this.element = this.getElement()
    this.formElements = this.getSubElements(this.element, 'formelement')
    this.subElements = this.getSubElements(this.element, 'subelement')
    this.messageElements = this.getSubElements(this.element, 'messageelement')

    this.setDefaultValues()
    this.loadComments()
    this.initListeners()

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

    this.resetMessages()
  }

  formReset() {
    this.formData = {
      likeCount: 0
    };

    this.subElements.commentForm.reset()
    this.formElements.text.style.height = 'auto';
    this.setDefaultValues()

    this.formIsValid = false;
    this.toggleSubmitButton()
  }


  save() {
    this.formIsValid = this.checkValidationFrom()

    if (this.formIsValid) {
      this.addNewComment(this.formData)
      this.formReset()
    }
  }

  checkUsername(elem) {
    let valid = false

    const min = 5,
      max = 30;

    const username = elem.value.trim();

    if (this.isEmpty(username)) {
      this.showMessage(elem, 'Username cannot be blank.');
    } else if (!this.isBetween(username.length, min, max)) {
      this.showMessage(elem, `Username must be between ${min} and ${max} characters.`)
    } else {
      this.showMessage(elem);
      valid = true;
    }

    return valid;
  }

  checkDate(elem) {
    let valid = false

    const date = elem.value.trim();

    if (new Date(date) > new Date()) {
      this.showMessage(elem, `Incorrect date`)
    } else {
      this.showMessage(elem);
      valid = true;
    }

    return valid;
  }

  checkText(elem) {
    let valid = false

    const min = 3,
      max = 1500;

    const text = elem.value.trim();

    if (this.isEmpty(text)) {
      this.showMessage(elem, 'Comment cannot be blank.');
    } else if (!this.isBetween(text.length, min, max)) {
      this.showMessage(elem, `Comment must be between ${min} and ${max} characters.`)
    } else {
      this.showMessage(elem);
      valid = true;
    }

    return valid;
  }

  showMessage(input, message = '') {
    const elementName = input.dataset.formelement

    const error = this.messageElements[elementName]
    error.textContent = message;
  };

  resetMessages() {
    for (const elementName in this.messageElements) {
      this.messageElements[elementName].textContent = '';
    }
  }

  setValid() {
    this.formIsValid = this.checkValidationFrom()
    this.toggleSubmitButton()
  }

  checkValidationFrom() {
    const isUsernameValid = this.checkUsername(this.formElements.username),
      isDateValid = this.checkDate(this.formElements.date),
      isTextValid = this.checkText(this.formElements.text)

    return isUsernameValid && isDateValid && isTextValid
  }

  toggleSubmitButton() {
    this.subElements.formButton.disabled = !this.formIsValid
  }

  addNewComment(commentData) {
    commentData.id = this.getNewId()

    const comment = new Comment(commentData, this.deleteComment.bind(this))

    this.subElements.comments.prepend(comment.element)
    this.commentsData.push(commentData)

    this.updateCommentsCount()
  }

  loadComments() {
    this.commentsData.map((commentData) => {
      const comment = new Comment(commentData, this.deleteComment.bind(this))

      this.subElements.comments.append(comment.element)
    })
  }

  deleteComment(commentId) {
    for (const index in this.commentsData) {
      const comment = this.commentsData[index]

      if (comment.id === commentId) {
        this.commentsData.splice(index, 1)
      }
    }

    this.updateCommentsCount()
  }

  updateCommentsCount() {
    this.subElements.commentsCount.innerHTML = this.commentsData.length
  }

  getNewId() {
    const maxId = Math.max(...this.commentsData.map(x => x.id));
    return maxId + 1;
  }

  initListeners() {
    this.subElements.commentForm.addEventListener('submit', this.onSubmit)
    this.subElements.formButton.addEventListener('click', this.onSubmit)
    this.subElements.commentForm.addEventListener('keypress', this.onKeypressSubmit)

    this.formElements.username.addEventListener('input', this.onInput)
    this.formElements.date.addEventListener('input', this.onInput)
    this.formElements.text.addEventListener('input', this.onInput)

    this.formElements.text.addEventListener('input', this.autoResize)

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
      <div class="form__borderline borderline"></div>
      <h1 class="comments__header header">
        <span data-subelement="commentsCount">${this.commentsData.length}</span>
        Comments
      </h1>
      <form class="comments__form form" action="" data-subelement="commentForm">
        <div class="form__title-wrapper">
          <div  class="form__username-field form-field">
            <input class="form__username form-field__field" value="" autocomplete="off" maxlength="30" autofocus placeholder="Enter your name" type="text" data-formelement="username" />
            <small data-messageelement="username" class="form-field__message"></small>
          </div>
          <div  class="form__date-field form-field">
            <input class="form__date form-field__field" type="date" data-formelement="date" />
            <small data-messageelement="date" class="form-field__message"></small>
          </div>
        </div>
        <div class="form__text-field form-field">
          <textarea class="form__textarea form-field__field"   placeholder="Add a comment..." name="text" cols="30" rows="4" data-formelement="text"></textarea>
          <small data-messageelement="text"  class="form-field__message"></small>
        </div>
        <div class="form__footer-wrapper">
          <button class="form__button-submit button" type="submit" disabled aria-pressed="false" data-subelement="formButton">Comment</button>
        </div>
        </form>
      <div class="comments__comments-wrapper comments-wrapper" data-subelement="comments"></div>
      <div class="form__borderline borderline"></div>
    </div>
    `
  }

  isEmpty = (value) => value === '' ? true : false

  isBetween = (length, min, max) => (length < min || length > max) ? false : true

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

    (!this.likeIsActive) ?
    this.data.likeCount += 1: this.data.likeCount -= 1

    this.likeIsActive = !this.likeIsActive;
    this.updateLikesCount()
  }

  deleteOnClick = (event) => {
    event.preventDefault();
    this.destroy()
    this.deleteComment(this.data.id)
  }

  constructor(commentData, deleteCallback) {
    this.data = commentData;
    this.likeIsActive = false
    this.deleteComment = deleteCallback;

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
    this.subElements.deleteButton.addEventListener("click", this.deleteOnClick)
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
            <div class="comment__title-column">
              <a class="comment__user-preview">${this.getUserPreview(commentData.username)}</a>
              <a class="comment__username">${escapeHtml(commentData.username)}</a>
              <p class="comment__date">${this.formatDate(commentData.date)}</p>
            </div>
            <div class="comment__title-column">
              <button class="comment__delete-button" data-element="deleteButton"> 
              <svg class="comment__delete-icon" data-element="deleteIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="32px" height="32px" fill-rule="nonzero"><g fill="#bebebe" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8,8)"><path d="M15,4c-0.52344,0 -1.05859,0.18359 -1.4375,0.5625c-0.37891,0.37891 -0.5625,0.91406 -0.5625,1.4375v1h-6v2h1v16c0,1.64453 1.35547,3 3,3h12c1.64453,0 3,-1.35547 3,-3v-16h1v-2h-6v-1c0,-0.52344 -0.18359,-1.05859 -0.5625,-1.4375c-0.37891,-0.37891 -0.91406,-0.5625 -1.4375,-0.5625zM15,6h4v1h-4zM10,9h14v16c0,0.55469 -0.44531,1 -1,1h-12c-0.55469,0 -1,-0.44531 -1,-1zM12,12v11h2v-11zM16,12v11h2v-11zM20,12v11h2v-11z"></path></g></g></svg>
              </button>
            </div>
          </div>
          <p class="comment__text">${escapeHtml(commentData.text)}</p>
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
    const startOfYesterday = new Date(),
      startOfToday = new Date()

    startOfYesterday.setDate(startOfYesterday.getDate() - 1)
    startOfYesterday.setHours(0, 0, 0, 0);

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
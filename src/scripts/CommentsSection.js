// import escapeHtml from './src/utils/escape-html.js';
import Comment from './Comment'

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
      this.subElements.message.innerHTML = 'Не все поля заполнены'
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

    this.subElements.commentForm.addEventListener("focus", () => this.subElements.commentForm.classList.add('form_focused'), true);
    this.subElements.commentForm.addEventListener("blur", () => {
      this.subElements.commentForm.classList.remove('form_focused')
    }, true)
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
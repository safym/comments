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
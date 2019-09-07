/**
 * @description: update review info
 * @param {content} markdown content
 * @return:
 */
export function updateReviewInfo (content) {
  const reviewDuration = [
    1, 3, 7, 14, 30, 60, 90
  ]
  const dateHeader = 'Review_date: '
  const timesHeader = 'Review_times: '
  var yamlExp = new RegExp('---\n((.|\n)+)---')
  var dateExp = new RegExp('Review_date: (.*)')
  var timesExp = new RegExp('Review_times: (.*)')
  var res

  if (!yamlExp.test(content ||
    !dateExp.test(content) || !timesExp.test(content))) {
    return ''
  }

  var yaml = yamlExp.exec(content)[0]
  res = dateExp.exec(yaml)
  var dateString = res[0]
  var lastDate = new Date(res[1])

  res = timesExp.exec(yaml)
  var timesString = res[0]
  var lastTimes = res[1]
  lastTimes = parseInt(lastTimes, 10)

  if (lastTimes > reviewDuration.length) {
    lastTimes = reviewDuration.length
  }

  var newDate = new Date()
  newDate.setDate(lastDate.getDate() + reviewDuration[lastTimes - 1])
  console.log(newDate.toLocaleDateString())

  var newContent = content.replace(dateString, dateHeader + newDate.toLocaleDateString())
  newContent = newContent.replace(timesString, timesHeader + (lastTimes + 1))
  console.log(newContent)

  return newContent
}

export function startReview (content) {
  const needHeader = 'Review_need: '
  const dateHeader = 'Review_date: '
  const timesHeader = 'Review_times: '
  var yamlExp = new RegExp('---\n((.|\n)+)---')
  var needExp = new RegExp('Review_need: (.*)')
  var dateExp = new RegExp('Review_date: (.*)')
  var timesExp = new RegExp('Review_times: (.*)')
  var res

  if (!yamlExp.test(content ||
    !dateExp.test(content) || !timesExp.test(content))) {
    return ''
  }

  var yaml = yamlExp.exec(content)[0]

  res = needExp.exec(yaml)
  var needString = res[0]

  res = dateExp.exec(yaml)
  var dateString = res[0]

  res = timesExp.exec(yaml)
  var timesString = res[0]
  var newDate = new Date()
  newDate.setDate(newDate.getDate() + 1)

  console.log(newDate.toLocaleDateString())

  var newContent = content.replace(needString, needHeader + 'True')
  newContent = newContent.replace(dateString, dateHeader + newDate.toLocaleDateString())
  newContent = newContent.replace(timesString, timesHeader + '1')

  console.log(newContent)

  return newContent
}

export type position = {
  _id: string
  clubId: string
  name: string
  description: string
  numberOfOpenings: number
  q: Array<string>
  skills: Array<string>
}

export type application = {
  id: string
  fields: Array<field>
}

export type applicationResponse = {
  _id: string
  name: string
  email: string
  description: string
  resumeURL: string
  qA: [{ answer: string; question: string }]
}

export type field = {
  id: string
  question: string
  answerType: 'text' | 'textarea' | 'dropdown'
}

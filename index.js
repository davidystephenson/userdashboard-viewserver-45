const express = require('express')
const axios = require('axios')

const app = express()

const port = 3000

app.listen(
  port,
  () => console.log(`Listening on :${port}`)
)

function render (title, heading, content) {
  const page = `<html>
    <head>
      <title>${title}</title>
    </head>
    <body>
      <h1>${heading}</h1>

      ${content}
    </body>
  </html>`

  return page
}

app.get(
  '/',
  async (request, response) => {
    try {
      const result = await axios.get('http://localhost:4000')

      // Don't forget to do this
      const { data } = result
      // const data = result.data

      const names = data
        .map(user => `<p>
          <a href="/${user.name}">${user.name}</a>
        </p>`)

      const paragraphs = names.join('')

      const page = render(
        'Welcome to the User Dashboard',
        'Users',
        paragraphs
      )

      console.log('page test:', page)

      response.send(page)
    } catch (error) {
      console.log(error.message)
    }
  }
)

const getUser = async (request, response) => {
  const { user } = request.params

  const url = `http://localhost:4000/user/${user}`
  const { data } = await axios.get(url)

  const content = `
    <h4>Hours online per day</h4>
    <p>${data.hours}</p>

    <h4>Last visited website</h4>
    <p>${data.website}</p>
  `

  const heading = `<a href='/'>${data.name}</a>`

  const page = render(
    data.name,
    heading,
    content
  )

  response.send(page)
}

app.get('/:user', getUser)
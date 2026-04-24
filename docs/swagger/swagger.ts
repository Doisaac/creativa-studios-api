import swaggerAutogen from 'swagger-autogen'

const outputFile = './docs/swagger/swagger_output.json'
const endpointsFiles = ['./src/index.ts']

const doc = {
  info: {
    title: 'Creativa Studios API',
    description: 'API documentation for Creativa Studios',
  },
  host: 'localhost:4000',
  schemes: ['http'],
}

swaggerAutogen()(outputFile, endpointsFiles, doc)

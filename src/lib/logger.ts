import pino from 'pino'
import pinoHttp from 'pino-http'

import configKeys from '@src/config'
import HttpStatusCodes from '@src/constants/HTTPStatusCode'
import { getKeyByValue } from '@src/utils/common'

export const logger = pino({ level: 'info' })

export const httpLogger = pinoHttp({
  logger,
  serializers: {
    req: (req) => {
      if (configKeys.NODE_ENV) {
        return req
      }
    },
    res: (res) => {
      if (configKeys.NODE_ENV) {
        return res
      }
    },
  },

  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode} ${getKeyByValue(HttpStatusCodes, res.statusCode)}`
  },
})

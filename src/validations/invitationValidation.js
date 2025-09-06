/* eslint-disable no-multi-spaces */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNewBoardInvitation = async (req, res, next ) => {
  const correctConditon = Joi.object({
    inviteeEmail: Joi.string().required(),
    boardId: Joi.string().required()
  })

  try {
    await correctConditon.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const invitationValidation = {
  createNewBoardInvitation
}
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    // console.log(req.body)
    // console.log(req.query)
    // console.log(req.params)
    // console.log(req.files)
    // console.log(req.cookies)
    // console.log(req.jwtDecoded)

    const userId = req.jwtDecoded._id

    // Điều hướng dữ sang Service
    const createdBoard = await boardService.createNew(userId, req.body)

    // throw new ApiError(StatusCodes.BAD_GATEWAY,'thanhtrinhdev test error')
    // Có kết quả thì trả về
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {next(error)}
}

const getDetails = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    // console.log(req.params)
    const boardId = req.params.id
    // Sau này sẽ có thêm userId
    const board = await boardService.getDetails(userId, boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {next(error)}
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.update(boardId, req.body)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {next(error)}
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {next(error)}
}

const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    // page và itemsPerPage được truyền vào trong query url từ phía FE nên BE sẽ lấy thông qua req.query
    const { page, itemsPerPage } = req.query
    const results = await boardService.getBoards(userId, page, itemsPerPage)

    res.status(StatusCodes.OK).json(results)
  } catch (error) {next(error)}
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards
}
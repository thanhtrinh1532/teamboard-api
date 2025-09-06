/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) =>{
  try {
    const newcolumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newcolumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      getNewColumn.cards = []
      // Cập nhất mảng columnOrderIds
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) {
    throw error
  }
}

const update = async (columnId, reqBody) =>{
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updateColumn = await columnModel.update(columnId, updateData)
    return updateColumn
  } catch (error) {
    throw error
  }
}

const deleteItem = async (columnId) =>{
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }

    // Xóa column
    await columnModel.deleteOneById(columnId)

    // Xóa toàn bộ card
    await cardModel.deleteManyByColumnId(columnId)

    // Xóa một comlumnId khỏi columnOrderIds
    await boardModel.pullColumnOrderIds(targetColumn)

    return {deleteResult: 'Đã xóa Column và toàn bộ card trong đó!'}
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}

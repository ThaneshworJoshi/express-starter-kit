import mongoose, { Model, Schema } from 'mongoose'

import { IToken, TokenType } from '@src/types/token/TokenType'

const tokenSchema: Schema<IToken> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  type: { type: String, enum: Object.values(TokenType), required: true },
  expires: { type: Date, required: true },
})

const TokenModel: Model<IToken> = mongoose.model<IToken>('Token', tokenSchema)

export default TokenModel

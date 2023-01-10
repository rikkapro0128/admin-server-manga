import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const name = 'Chapter';

const chapterSchema = new Schema({
  id: {
    type: Schema.Types.String,
    require: true,
    unique: true,
  },
  idManga: {
    type: Schema.Types.String,
    ref: 'Manga',
  },
  number: {
    type: Schema.Types.Number,
    require: true,
    unique: true,
  },
  desc: {
    type: Schema.Types.String,
  },
  images: [
    {
      type: Schema.Types.Mixed,
      unique: true,
    }
  ]
});

export default model(name, chapterSchema);

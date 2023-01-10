import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { name } from '@/model/chapter';

const mangaSchema = new Schema({
  name: {
    type: Schema.Types.String,
    require: true,
    unique: true,
  },
  id: {
    type: Schema.Types.String,
    require: true,
    unique: true,
  },
  desc: {
    type: Schema.Types.String,
  },
  avatar: {
    type: Schema.Types.Mixed,
  },
  cover: {
    type: Schema.Types.Mixed,
  },
  chapters: [{
    type: Schema.Types.String,
    ref: name,
  }]
});

export default model('Manga', mangaSchema);

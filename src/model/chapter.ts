import { Schema, model, FilterQuery, Model } from 'mongoose';

import { mongooseSoftDelete, PluginModel, ModelSoftDelete } from '@/utils/plugins';

export const name = 'Chapter';

interface Chapter {
  id: Schema.Types.String,
  idManga: Schema.Types.String,
  number: Schema.Types.Number,
  desc?: Schema.Types.String,
  images: Array<Schema.Types.Mixed>,
}

interface ChapterInstance extends ModelSoftDelete, Chapter {}
interface ChapterModel extends Model<ChapterInstance>, PluginModel {}

const chapterSchema = new Schema<ChapterInstance, ChapterModel>({
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
}, {
  timestamps: true,
});

chapterSchema.plugin(mongooseSoftDelete);

export default model<ChapterInstance, ChapterModel>(name, chapterSchema);

import { Schema, model, ObjectId, Model } from 'mongoose';

import { mongooseSoftDelete, PluginModel, ModelSoftDelete } from '@/utils/plugins';
import { name } from '@/model/chapter';

interface Manga {
  name: Schema.Types.String,
  id: Schema.Types.String,
  desc?: Schema.Types.Number,
  postAt?: Schema.Types.Date,
  avatar?: Schema.Types.Mixed,
  cover?: Schema.Types.Mixed,
  chapters: Array<Schema.Types.ObjectId>,
}

interface MangaInstance extends ModelSoftDelete, Manga { }
interface MangaModel extends Model<MangaInstance>, PluginModel { }

const mangaSchema = new Schema<Manga, MangaModel>({
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
  postAt: {
    type: Schema.Types.Date,
  },
  chapters: [{
    type: Schema.Types.ObjectId,
    ref: name,
  }]
}, {
  timestamps: true,
});

mangaSchema.plugin(mongooseSoftDelete);

export default model<Manga, MangaModel>('Manga', mangaSchema);

import { Schema, SchemaOptions, FilterQuery, Model, Document, HydratedDocument, QueryWithHelpers } from 'mongoose';

export interface ModelSoftDelete {
  deleted: Schema.Types.Boolean | boolean,
  deleteAt: Schema.Types.Date | DateConstructor | number | undefined,
}

export interface PluginModel {
  findOneAndSoftDelete(filter: FilterQuery<{}>): ResponseType;
  findAndSoftDelete(filter: FilterQuery<{}>): ResponseType;
  findOneAndRestore(filter: FilterQuery<{}>): ResponseType;
  findAndRestore(filter: FilterQuery<{}>): ResponseType;
  // findAndSoftDelete(filter: FilterQuery<{}>): Document<any>;
  // findOneAndRestore(filter: FilterQuery<{}>): Document<any>;
  // findAndRestore(filter: FilterQuery<{}>): Document<any>;
}

interface InstanceModel extends PluginModel, Model<ModelSoftDelete> {}

interface DocumentSoftDelete extends ModelSoftDelete, Document {
  modifiedCount: any;
  matchedCount: any;
}

export enum ErrorType {
  DocumentNotExist = 'document is not exist.',
  DocumentDeleted = 'remove successfully',
  DocumentRestored = 'restore successfully',
}

interface ResponseType {  
  documentDeleted: number,
  message: ErrorType,
}

export function mongooseSoftDelete(scheme: Schema<any, any | InstanceModel>, options: SchemaOptions) {
  // Define new field for insert to model
  scheme.add({
    deleted: {
      type: Schema.Types.Boolean,
      default: false,
    },
    deleteAt: {
      type: Schema.Types.Date,
    },
  });
  
  // Un-search any document has ben field deleted = true
  scheme.pre(/^find/, function () {
    this.where({ deleted: false }).select('-deleted');
  })

  // Static function of scheme
  scheme.statics.findOneAndRestore = async function (filter: FilterQuery<{}>) {
    return new Promise(async (res, rej) => {
      try {
        const ctx: DocumentSoftDelete = await this.updateOne(filter, { $set: { deleted: false }, $unset: { deleteAt: 1 } });
        if(!ctx.modifiedCount) {
          res({ documentDeleted: 0, message: ErrorType.DocumentNotExist });
        }else {
          res({ documentDeleted: 1, message: ErrorType.DocumentRestored });
        }
      } catch (error) {
        rej(error);
      }
    })
  };
  scheme.statics.findAndRestore = async function (filter: FilterQuery<{}>) {
    return new Promise(async (res, rej) => {
      try {
        const ctx: Array<DocumentSoftDelete> = await this.updateMany(filter, { $set: { deleted: false }, $unset: { deleteAt: 1 } });
        if(ctx.length > 0) {
          res({ documentRestored: 0, message: ErrorType.DocumentNotExist });
        }else {
          res({ documentRestored: ctx.length, message: ErrorType.DocumentRestored });
        }
      } catch (error) {
        rej(error);
      }
    })
  };
  scheme.statics.findOneAndSoftDelete = async function (filter: FilterQuery<{}>) {
    return new Promise(async (res, rej) => {
      try {
        const ctx: DocumentSoftDelete = await this.updateOne(filter, { $set: { deleted: true, deleteAt: Date.now() }, });
        if(!ctx.modifiedCount) {
          res({ documentDeleted: 0, message: ErrorType.DocumentNotExist });
        }else {
          res({ documentDeleted: 1, message: ErrorType.DocumentDeleted });
        }
      } catch (error) {
        rej(error);
      }
    })
  };
  scheme.statics.findAndSoftDelete = function (filter: FilterQuery<{}>) {
    return new Promise(async (res, rej) => {
      try {
        const ctx: Array<DocumentSoftDelete> = await this.updateMany(filter, { $set: { deleted: true, deleteAt: Date.now() }, });
        if(ctx.length > 0) {
          res({ documentDeleted: 0, message: ErrorType.DocumentNotExist });
        }else {
          res({ documentDeleted: ctx.length, message: ErrorType.DocumentDeleted });
        }
      } catch (error) {
        rej(error);
      }
    })
  };
}

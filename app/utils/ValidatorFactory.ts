// deno-lint-ignore-file no-explicit-any
import { Schema, string, Type, unknown } from "../deps.ts";
import { IModel } from "../types/denodb.ts";

export type ListParams = Type<typeof ValidatorFactory.listSchema>;

/**
 * This class can build generic endpoint validators using the "computed-types" library.
 */
export class ValidatorFactory {
  static getSchema = {
    id: unknown.number().integer().gt(0),
  };
  static listSchema = {
    page: unknown.number().integer().gt(0).optional().transform(
      ValidatorFactory.toDefault(1),
    ),
    pageSize: unknown.number().integer().gt(0).optional().transform(
      ValidatorFactory.toDefault(50),
    ),
    order: Schema.either("asc" as const, "desc" as const).optional().transform(
      ValidatorFactory.toDefault("asc" as const),
    ),
    sortBy: string.max(200).trim().optional(),
  };

  /**
 * 
 * @returns a validator for GET resource 
 */
  static buildGetValidator() {
    const getSchema = Schema(ValidatorFactory.getSchema);
    return getSchema.destruct();
  }

  /**
 * 
 * @returns a validator for LIST resource
 */
  static buildListValidator() {
    const listSchema = Schema(ValidatorFactory.listSchema);
    return listSchema.destruct();
  }

  /**
 * 
 * @param Model model class
 * @returns a validator for UPDATE resource
 */
  static buildUpdateValidator(Model: IModel) {
    const schema = Schema.merge(
      ValidatorFactory.getSchema,
      Model.schema,
    );
    return schema.destruct();
  }

  /**
   * 
   * @returns a validator for DELETE resource
   */
  static buildDeleteValidator() {
    const getSchema = Schema(ValidatorFactory.getSchema);
    return getSchema.destruct();
  }

  /**
 * 
 * @param Model model class
 * @returns a validator for PATCH resource
 */
  static buildPatchValidator(Model: IModel) {
    const newSchema = ValidatorFactory.convertAllSchemaItemsToOptional(
      Model.schema,
    );
    const schema = Schema.merge(
      { id: unknown.number().integer().gt(0) },
      newSchema,
    );
    return schema.destruct();
  }

  /**
 * 
 * @param defaultValue 
 * @returns a function that can be used by Schema.transform to set a default
 * value in the validation process.
 */
  private static toDefault<T, K>(defaultValue: K) {
    return (x: T) => {
      if (x == null) {
        return defaultValue;
      } else {
        return x;
      }
    };
  }

  /**
 * 
 * @param schema a raw "computed-types" schema
 * @returns the new schema with all items as optional
 */
  private static convertAllSchemaItemsToOptional(
    schema: { [key: string]: any },
  ) {
    const keys = Object.keys(schema);
    const res = {} as any;
    keys.forEach((key) => {
      res[key] = Schema.either(Schema.either(null, undefined), schema[key]);
    });
    return res;
  }
}

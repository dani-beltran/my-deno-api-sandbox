// deno-lint-ignore-file no-explicit-any
import { Schema, unknown } from "./deps.ts";
import { listSchema } from "./list.ts";
import { IModel } from "./types.ts";

/**
 * This class can build generic endpoint validators using the schema of
 * Denodb models with the help of "computed-types" library.
 */
export class ValidatorFactory {
  static getSchema = {
    id: unknown.number().integer().gt(0),
  };

  /**
   * 
   * @returns a validator for GET resource 
   */
  static buildGetValidator() {
    const schema = Schema(ValidatorFactory.getSchema, {strict: true});
    return schema.destruct();
  }

  /**
   * 
   * @returns a validator for LIST resource
   */
  static buildListValidator() {
    const schema = Schema(listSchema, {strict: false});
    return schema.destruct();
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
    return Schema(schema, {strict: true}).destruct();
  }

  /**
   * 
   * @returns a validator for DELETE resource
   */
  static buildDeleteValidator() {
    const schema = Schema(ValidatorFactory.getSchema, {strict: true});
    return schema.destruct();
  }

  /**
   * 
   * @param Model model class
   * @returns a validator for PATCH resource
   */
  static buildPatchValidator(Model: IModel) {
    const optSchema = ValidatorFactory.convertAllSchemaItemsToOptional(
      Model.schema,
    );
    const schema = Schema.merge(
      { id: unknown.number().integer().gt(0) },
      optSchema,
    );
    return schema.destruct();
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

// deno-lint-ignore-file no-explicit-any
import { Schema, string, unknown } from "./deps.ts";
import { getSchema, listSchema } from "./schema-definitions.ts";

/**
 * This class can build generic endpoint validators using the schemas
 * from "computed-types" library.
 */
export class ValidatorFactory {
  /**
   * @param params
   * @returns a validator that does nothing but returning an array containing error as false and the params.
   */
  static buildEmptyValidator() {
    return (params: any) => [false, params];
  }

  /**
   * Builds a validation function from a "computed-types" schema.
   * Check computed-types library to know how to build a schema object.
   * @param schema
   * @param strict By default, the validator will ignore all properties that aren't exist on the schema. If you want to throw an error instead you can toggle the strict mode on.
   * @returns validation function
   */
  static buildValidatorFromSchema(schema: { [key: string]: any }, strict = false) {
    return Schema(schema, { strict }).destruct();
  }

  /**
   * Validates if the request is sending content of type JSON.
   * @returns
   */
  static buildJsonAppValidator() {
    const headerSchema = {
      "content-type": string.equals("application/json"),
    };
    return Schema(headerSchema, { strict: false }).destruct();
  }

  /**
   * @returns a validator for GET resource
   */
  static buildGetValidator() {
    const schema = Schema(getSchema, { strict: true });
    return schema.destruct();
  }

  /**
   * @returns a validator for LIST resource
   */
  static buildListValidator() {
    const schema = Schema(listSchema, { strict: false });
    return schema.destruct();
  }

  /**
   * @param modelSchema model class schema
   * @returns a validator for UPDATE resource
   */
  static buildUpdateValidator(modelSchema: any) {
    const schema = Schema.merge(
      getSchema,
      modelSchema,
    );
    return Schema(schema, { strict: true }).destruct();
  }

  /**
   * @returns a validator for DELETE resource
   */
  static buildDeleteValidator() {
    const schema = Schema(getSchema, { strict: true });
    return schema.destruct();
  }

  /**
   * @param modelSchema model class schema
   * @returns a validator for PATCH resource
   */
  static buildPatchValidator(modelSchema: any) {
    const optSchema = ValidatorFactory.convertAllSchemaItemsToOptional(
      modelSchema,
    );
    const schema = Schema.merge(
      { id: unknown.number().integer().gt(0) },
      optSchema,
    );
    return schema.destruct();
  }

  /**
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

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import json from "json-to-ast";
import babel from "prettier/parser-babel";
import prettier from "prettier/standalone";
import * as yup from "yup";

import * as schemas from "./schemas";

const getLiteralSchema = (value: unknown, property?: string) => {
  const booleanSchema = yup
    .boolean()
    .strict(true)
    .required()
    .isValidSync(value);

  if (booleanSchema) {
    return schemas.getBooleanSchema(property);
  }

  const numberSchema = yup.number().strict(true).required().isValidSync(value);
  if (numberSchema) {
    return schemas.getNumberSchema(property);
  }

  const stringSchema = yup.string().strict(true).isValidSync(value);
  if (stringSchema) {
    return schemas.getStringSchema(value, property);
  }

  /**
   * I don't know how test a
   * nullable schema properly :/
   */

  return schemas.getNullSchema(property);
};

type Node =
  | json.ArrayNode
  | json.LiteralNode
  | json.ObjectNode
  | json.PropertyNode;

const transform = (node: Node, property?: string): string => {
  switch (node.type) {
    case "Array": {
      const arraySchema = schemas.getArraySchema(property);
      if (node.children.length) {
        arraySchema.push(transform(node.children.shift()!));
      }

      return arraySchema.stringify();
    }
    case "Literal":
      return getLiteralSchema(node.value, property).stringify();
    case "Object": {
      const objectSchema = schemas.getObjectSchema(property);
      if (node.children.length) {
        objectSchema.push(
          node.children.map((next) => transform(next)).join("")
        );
      }

      return objectSchema.stringify();
    }
    case "Property":
      return transform(node.value, node.key.value);
  }
};

const parse = (input: string) =>
  prettier.format(transform(json(input)).slice(0, -1) + ";", {
    parser: "babel",
    plugins: [babel],
  });

export default parse;

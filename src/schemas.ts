const useProperty = (baseSchema: string[], property?: string) =>
  property ? [property + ":", ...baseSchema] : baseSchema;

export const getArraySchema = (property?: string) => {
  const prefix = useProperty(["yup.array().of("], property);
  const sufix = [")", ".defined()"];

  const operations = {
    push: (schema: string) => {
      prefix.push(schema);

      return schema;
    },
    stringify: () => [...prefix, ...sufix].join("") + ",",
  };

  return operations;
};

export const getBooleanSchema = (property?: string) => {
  const prefix = useProperty(["yup.boolean()"], property);
  const sufix = [".nullable()"];

  const operations = {
    push: (schema: string) => schema,
    stringify: () => [...prefix, ...sufix].join("") + ",",
  };

  return operations;
};

export const getNullSchema = (property?: string) => {
  /**
   * We don't know the type of the root value
   * So we use the .mixed() schema
   */

  const prefix = useProperty(["yup.mixed()"], property);
  const sufix = [".nullable()"];

  const operations = {
    push: (schema: string) => schema,
    stringify: () => [...prefix, ...sufix].join("") + ",",
  };

  return operations;
};

export const getNumberSchema = (property?: string) => {
  const prefix = useProperty(["yup.number()"], property);
  const sufix = [".required()"];

  const operations = {
    push: (schema: string) => schema,
    stringify: () => [...prefix, ...sufix].join("") + ",",
  };

  return operations;
};

export const getObjectSchema = (property?: string) => {
  const prefix = useProperty(["yup.object().shape({"], property);
  const sufix = ["})", ".noUnknown()", ".required()"];

  const operations = {
    push: (schema: string) => {
      prefix.push(schema);

      return schema;
    },
    stringify: () => [...prefix, ...sufix].join("") + ",",
  };

  return operations;
};

export const getStringSchema = (value: unknown, property?: string) => {
  const prefix = useProperty(["yup.string()"], property);
  const sufix: string[] = [];

  /**
   * With an empty string, .required() throws a validation error
   * In such cases, type validation is more assertive :)
   */

  sufix.push(value ? ".required()" : ".typeError()");

  const operations = {
    push: (schema: string) => schema,
    stringify: () => [...prefix, ...sufix].join("") + ",",
  };

  return operations;
};

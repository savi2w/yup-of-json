# Yup of JSON

Convert JSON to a [`yup`](https://github.com/jquense/yup) schema

- [Try it now!](https://yup-of-json.savi2w.moe/)

## Usage

```typescript
import parse from "@savi2w/yup-of-json";
```

## Example

- JSON Schema

```json
{
  "addresses": {
    "raw": "Kukuroo Mountain"
  },
  "age": 14,
  "github": "https://github.com/savi2w",
  "hunter": true,
  "name": "Killua Zoldyck",
  "role": null,
  "tags": [
    {
      "label": "cute"
    }
  ]
}
```

- Result

```typescript
yup
  .object()
  .shape({
    addresses: yup
      .object()
      .shape({ raw: yup.string().required() })
      .noUnknown()
      .required(),
    age: yup.number().required(),
    github: yup.string().required(),
    hunter: yup.boolean().nullable(),
    name: yup.string().required(),
    role: yup.mixed().nullable(),
    tags: yup
      .array()
      .of(
        yup
          .object()
          .shape({ label: yup.string().required() })
          .noUnknown()
          .required()
      )
      .defined(),
  })
  .noUnknown()
  .required();
```

## License

This project is distributed under the [MIT license](LICENSE)

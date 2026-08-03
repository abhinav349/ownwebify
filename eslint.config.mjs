import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      /**
       * `ignoreRestSiblings` makes the omit idiom lint-clean:
       *
       *     const { secret, ...safe } = user;
       *
       * The named bindings exist precisely so they are *excluded* from the
       * rest object, so flagging them as unused reports the mechanism as the
       * defect. This is typescript-eslint's own recommended setting; the Next
       * preset ships it off. `_`-prefixed args stay exempt by the usual
       * convention, for signatures whose shape is fixed by a caller.
       */
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
]);

export default eslintConfig;

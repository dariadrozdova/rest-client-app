import bodyEditor from "@shared/lib/i18n/messages/be/body-editor.json";
import codeGen from "@shared/lib/i18n/messages/be/codegen.json";
import dropdown from "@shared/lib/i18n/messages/be/dropdown.json";
import errors from "@shared/lib/i18n/messages/be/errors.json";
import footer from "@shared/lib/i18n/messages/be/footer.json";
import header from "@shared/lib/i18n/messages/be/header.json";
import headerTab from "@shared/lib/i18n/messages/be/header-tab.json";
import protectedHeader from "@shared/lib/i18n/messages/be/protected-header.json";
import signIn from "@shared/lib/i18n/messages/be/sign-in.json";
import signUp from "@shared/lib/i18n/messages/be/sign-up.json";
import variablesEditor from "@shared/lib/i18n/messages/be/variables-editor.json";

export default {
  errors,
  footer,
  header,
  "header-tab": headerTab,
  "protected-header": protectedHeader,
  "body-editor": bodyEditor,
  "variables-editor": variablesEditor,
  "sign-in": signIn,
  "sign-up": signUp,
  "code-gen": codeGen,
  "dropdown": dropdown,
} as const;

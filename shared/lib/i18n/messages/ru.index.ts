import bodyEditor from "@shared/lib/i18n/messages/ru/body-editor.json";
import codeGen from "@shared/lib/i18n/messages/ru/codegen.json";
import dropdown from "@shared/lib/i18n/messages/ru/dropdown.json";
import errorPage from "@shared/lib/i18n/messages/ru/error-page.json";
import errors from "@shared/lib/i18n/messages/ru/errors.json";
import footer from "@shared/lib/i18n/messages/ru/footer.json";
import header from "@shared/lib/i18n/messages/ru/header.json";
import headerTab from "@shared/lib/i18n/messages/ru/header-tab.json";
import historyTable from "@shared/lib/i18n/messages/ru/history-table.json";
import mainPage from "@shared/lib/i18n/messages/ru/main.json";
import passwordStrength from "@shared/lib/i18n/messages/ru/password-strength.json";
import protectedHeader from "@shared/lib/i18n/messages/ru/protected-header.json";
import responsePanel from "@shared/lib/i18n/messages/ru/response-panel.json";
import signIn from "@shared/lib/i18n/messages/ru/sign-in.json";
import signUp from "@shared/lib/i18n/messages/ru/sign-up.json";
import variablesEditor from "@shared/lib/i18n/messages/ru/variables-editor.json";

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
  dropdown: dropdown,
  "response-panel": responsePanel,
  "main-page": mainPage,
  "history-table": historyTable,
  "error-page": errorPage,
  "password-strength": passwordStrength,
} as const;

import bodyEditor from "@shared/lib/i18n/messages/en/body-editor.json";
import codeGen from "@shared/lib/i18n/messages/en/codegen.json";
import dropdown from "@shared/lib/i18n/messages/en/dropdown.json";
import errorPage from "@shared/lib/i18n/messages/en/error-page.json";
import errors from "@shared/lib/i18n/messages/en/errors.json";
import footer from "@shared/lib/i18n/messages/en/footer.json";
import header from "@shared/lib/i18n/messages/en/header.json";
import headerTab from "@shared/lib/i18n/messages/en/header-tab.json";
import historyTable from "@shared/lib/i18n/messages/en/history-table.json";
import mainPage from "@shared/lib/i18n/messages/en/main.json";
import protectedHeader from "@shared/lib/i18n/messages/en/protected-header.json";
import responsePanel from "@shared/lib/i18n/messages/en/response-panel.json";
import signIn from "@shared/lib/i18n/messages/en/sign-in.json";
import signUp from "@shared/lib/i18n/messages/en/sign-up.json";
import variablesEditor from "@shared/lib/i18n/messages/en/variables-editor.json";

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
} as const;

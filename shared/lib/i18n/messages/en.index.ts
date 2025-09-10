import bodyEditor from "@shared/lib/i18n/messages/en/body-editor.json";
import errors from "@shared/lib/i18n/messages/en/errors.json";
import footer from "@shared/lib/i18n/messages/en/footer.json";
import header from "@shared/lib/i18n/messages/en/header.json";
import headerTab from "@shared/lib/i18n/messages/en/header-tab.json";
import protectedHeader from "@shared/lib/i18n/messages/en/protected-header.json";

export default {
  errors,
  footer,
  header,
  "header-tab": headerTab,
  "protected-header": protectedHeader,
  "body-editor": bodyEditor,
} as const;

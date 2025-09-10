import bodyEditor from "@shared/lib/i18n/messages/be/body-editor.json";
import errors from "@shared/lib/i18n/messages/be/errors.json";
import footer from "@shared/lib/i18n/messages/be/footer.json";
import header from "@shared/lib/i18n/messages/be/header.json";
import protectedHeader from "@shared/lib/i18n/messages/be/protected-header.json";

export default {
  errors,
  footer,
  header,
  "protected-header": protectedHeader,
  "body-editor": bodyEditor,
} as const;

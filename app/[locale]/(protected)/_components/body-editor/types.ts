export interface BodyEditorActions {
  clearBody: () => void;
  handleBodyChange: (value: string) => void;
  prettifyJson: () => void;
  setBody: (body: string) => void;
  setContentType: (type: string) => void;
  setJsonError: (error: string) => void;
}

export interface BodyEditorState {
  body: string;
  contentType: string;
  jsonError: string;
}

export interface BodyEditorToolbarProps {
  contentType: string;
  onClearBody: () => void;
  onContentTypeChange: (type: string) => void;
  onPrettifyJson: () => void;
  showJsonControls: boolean;
}

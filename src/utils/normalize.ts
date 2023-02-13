import { messagePrefix } from "@ethersproject/hash";

export const normaliseMessage = (message: string) => {
  return message
    .replaceAll("_", "\\_")
    .replaceAll("|", "\\|")
    .replaceAll(".", "\\.")
    .replaceAll("{", "\\{")
    .replaceAll("}", "\\}")
    .replaceAll("=", "\\=")
    .replaceAll("+", "\\+")
    .replaceAll(">", "\\>")
    .replaceAll("<", "\\<")
    .replaceAll("-", "\\-")
    .replaceAll("!", "\\!");
};

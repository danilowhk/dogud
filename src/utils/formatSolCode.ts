import prettier from "prettier";
import solidityPlugin from "prettier-plugin-solidity";

export const formatSolidityCode = (code: string): string => {
  try {
    const formattedCode = prettier.format(code, {
      parser: "solidity",
      plugins: [solidityPlugin],
    });
    return formattedCode;
  } catch (error) {
    console.error("Error formatting Solidity code:", error);
    return code;
  }
};

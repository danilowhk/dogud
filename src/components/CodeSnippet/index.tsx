import React from "react";
import { formatSolidityCode } from "../../utils/formatSolCode";

interface CodeSnippetProps {
  code: string;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ code }) => {
  return (
    <pre className="bg-black text-white p-4 rounded-md overflow-x-auto w-full">
      <code>{code}</code>
    </pre>
  );
};

export default CodeSnippet;

// components/MarkdownMessage.jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// import rehypeRaw from "rehype-raw";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const MarkdownMessage = ({ text }) => {
  return (
    <div className="prose max-w-none text-left">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // rehypePlugins={[rehypeRaw]}
        // components={{
        //   code({ node, inline, className, children, ...props }) {
        //     const match = /language-(\w+)/.exec(className || "");
        //     return !inline && match ? (
        //       <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
        //         {String(children).replace(/\n$/, "")}
        //       </SyntaxHighlighter>
        //     ) : (
        //       <code className={className} {...props}>
        //         {children}
        //       </code>
        //     );
        //   },
        // }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;

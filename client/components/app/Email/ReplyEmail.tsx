import React, { useState } from "react";
import ReactMde, { Suggestion } from "react-mde";
import Showdown from "showdown";
import Script from "next/script";
import Head from "next/head";

interface ReplyEmailProps {
  message: string;
  setMessage: (x: string) => void;
  replyToEmail: () => void;
}
const ReplyEmail = ({ message, setMessage, replyToEmail }: ReplyEmailProps) => {
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const loadSuggestions = async (text: string) => {
    return new Promise<Suggestion[]>((accept, reject) => {
      setTimeout(() => {
        const suggestions: Suggestion[] = [
          {
            preview: "Prism One",
            value: "@prism",
          },
          {
            preview: "Lorenze | Prism One CRM ",
            value: "@Lorenze",
          },
        ].filter((i) => i.preview.toLowerCase().includes(text.toLowerCase()));
        accept(suggestions);
      }, 250);
    });
  };
  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });
  return (
    <div className="w-full">
      <Head>
        <Script src="/path/to/showdown/src/showdown.js"></Script>
        <Script src="/path/to/xss/dist/xss.min.js"></Script>
        <Script src="/path/to/showdown-xss-filter.js"></Script>
      </Head>
      <ReactMde
        value={message}
        onChange={setMessage}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
        loadSuggestions={loadSuggestions}
        childProps={{
          writeButton: {
            tabIndex: -1,
          },
        }}
        // paste={{
        //   saveImage: save,
        // }}
      />
      <button
        className="rounded-md bg-blue-theme p-2 mt-4 float-right text-white"
        onClick={replyToEmail}
      >
        Reply
      </button>
    </div>
  );
};

export default ReplyEmail;

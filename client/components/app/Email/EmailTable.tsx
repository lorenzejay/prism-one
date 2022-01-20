import Link from "next/link";
import React from "react";
import sanitize from "sanitize-html";
import ErrorMessage from "../ErrorMessage";
import Loader from "../Loader";

interface EmailTableProps {
  emails: any[] | undefined;
  loadingEmails: boolean;
  fetchingEmailError: string;
}

const EmailTable = ({
  emails,
  loadingEmails,
  fetchingEmailError,
}: EmailTableProps) => {
  // emails && console.log("emails", emails);
  return (
    <>
      <h2 className="tracking-wide flex-grow text-3xl my-7 font-medium ">
        Emails
      </h2>
      {fetchingEmailError && (
        <ErrorMessage error={fetchingEmailError as string} />
      )}
      {loadingEmails ? (
        <Loader />
      ) : (
        <table className="w-full border border-collapse p-3">
          <thead>
            <tr className="text-left  ">
              <th className="w-1/6 border p-3 bg-white font-normal">
                Recieved
              </th>
              <th className="w-2/6 border p-3 bg-white font-normal">From</th>
              <th className="w-1/2 border p-3 bg-white font-normal">Message</th>
              {/* <th className="w-1/6 font-semibold text-left">Etc</th> */}
            </tr>
          </thead>
          <tbody className="text-sm">
            {emails &&
              emails.map((e, i) => {
                const sanitizeHtml = sanitize(e.snippet);
                const dateObj: { name: string; value: string } =
                  e.payload.headers.find((e: any) => e.name === "Date");
                const emailFromObj: { name: string; value: string } =
                  e.payload.headers.find((e: any) => e.name === "From");

                return (
                  <Link href={`/email/view/${e.id}`} key={i}>
                    <tr className="bg-white border rounded-md mt-3">
                      {e.payload.headers && dateObj && (
                        <td className="border p-3">
                          {dateObj.value.slice(0, 16)}
                          {/* {e.payload.headers.find((e: any) => e.name === "Date")} */}
                        </td>
                      )}
                      <td className="border p-3">{emailFromObj.value}</td>
                      <td
                        className="border p-3 overflow-hidden"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml,
                        }}
                      >
                        {/* <span></span> */}
                      </td>
                      {/* <td className="border p-3">placeholder x</td> */}
                    </tr>
                  </Link>
                );
              })}
          </tbody>
        </table>
      )}
    </>
  );
};

export default EmailTable;

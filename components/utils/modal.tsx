import { useState } from "react";

interface ModalProps {
  title: string;
  warn?: boolean;
  description?: string[] | null;
  rejectText?: string | null;
  acceptText?: string | null;
  rejectHandler: () => any;
  acceptHandler: () => any;
}

export default function Modal(props: ModalProps){
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">{props.title}</h2>
        {props.description && props.description.map(text => {
          return (
            <p key={text} className="text-gray-700 mb-4">
              {text}
            </p>
          )
        })}

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              props.rejectHandler();
            }}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800"
          >
            {props.rejectText}
          </button>
          <button
            onClick={() => {
              props.acceptHandler();
            }}
            className={props.warn ? "px-4 py-2 text-white rounded bg-red-500 hover:bg-red-600" :"px-4 py-2 text-white rounded bg-blue-500 hover:bg-blue-600"}
          >
            {props.acceptText}
          </button>
        </div>
      </div>
    </div>
  )
}
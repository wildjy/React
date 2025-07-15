"use client";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { HTMLAttributes } from "react";
import { cn } from "../common/cn";

interface Studytype {
  title?: string;
  children?: React.ReactNode;
  addClass?: string;
}

interface StudyPreType extends HTMLAttributes<HTMLDivElement> {
  children: string;
  language?: string;
}

interface StudyProps extends React.FC<Studytype> {
  Pre: typeof StudyPre;
}

const StudyBlock: StudyProps = ({ title, children, addClass }) => {
  return (
    <div>
      <div className={`${cn('mt-5 py-6 border-t border-gray-300', addClass)}`}>
        <p className="mb-3 text-lg"><b>{title}</b></p>
        {children}
      </div>
    </div>
  )
}

const StudyPre: React.FC<StudyPreType> = ({ children, language = "jsx" }) => {
  return (
    <div>
      {/* <pre className="bg-gray-100 p-4 text-sm overflow-x-auto whitespace-pre-wrap">
      {children}
      </pre> */}
      <SyntaxHighlighter language={language} style={oneDark} customStyle={{ borderRadius: '0.5rem', fontSize: '0.875rem' }}>
        {children.trim()}
      </SyntaxHighlighter>
    </div>
  )
}

StudyBlock.Pre = StudyPre;

export default StudyBlock;
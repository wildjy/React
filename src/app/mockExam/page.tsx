import React from "react";

const MockExamPage: React.FC = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">Mock Exam Page</h1>
          <p className="text-gray-700">
            This is a placeholder for the mock exam content.
          </p>
        </div>
      </div>
    </>
  );
};

export default MockExamPage;

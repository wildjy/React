import React from "react";

const ExamplePage: React.FC = () => {
  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex justify-center space-x-2 mob:space-x-4 mb-4">
        <button className="border-b-2 border-blue-500 text-blue-500 font-semibold px-2">
          3.28 학력평가
        </button>
        <button className="text-gray-600 px-2">5.8 학력평가</button>
        <button className="text-gray-600 px-2">6.4 모의평가</button>
        <button className="text-gray-600 px-2">7.11 학력평가</button>
        <button className="text-gray-600 px-2">9.4 모의평가</button>
        <button className="text-gray-600 px-2">10.15 학력평가</button>
      </div>

      {/* Dropdown */}
      <div className="flex justify-end mb-4">
        <select className="border border-gray-300 rounded px-2 py-1 text-gray-700">
          <option>3학년</option>
          {/* Add more options here */}
        </select>
      </div>

      {/* Table-like Grid */}
      <div className="grid grid-cols-3 mob:grid-cols-5 bg-gray-100 text-center font-semibold">
        <div className="py-2 border border-gray-300">과목</div>
        <div className="py-2 border border-gray-300">원점수</div>
        <div className="py-2 border border-gray-300">표준점수</div>
        <div className="hidden mob:block py-2 border border-gray-300">
          백분위
        </div>
        <div className="hidden mob:block py-2 border border-gray-300">등급</div>
      </div>

      {/* Rows */}
      <div className="grid grid-cols-3 mob:grid-cols-5 text-center border border-gray-300">
        <div className="py-2 border-r border-gray-300">한국사</div>
        <div className="py-2 border-r border-gray-300">50</div>
        <div className="py-2 border-r border-gray-300">-</div>
        <div className="hidden mob:block py-2 border-r border-gray-300">-</div>
        <div className="hidden mob:block py-2">1</div>
      </div>
      <div className="grid grid-cols-3 mob:grid-cols-5 text-center border border-gray-300">
        <div className="py-2 border-r border-gray-300">
          <a href="#" className="text-blue-600">
            화법과작문
          </a>
        </div>
        <div className="py-2 border-r border-gray-300">75</div>
        <div className="py-2 border-r border-gray-300">95</div>
        <div className="hidden mob:block py-2 border-r border-gray-300">
          34.00
        </div>
        <div className="hidden mob:block py-2">2</div>
      </div>
      <div className="grid grid-cols-3 mob:grid-cols-5 text-center border border-gray-300">
        <div className="py-2 border-r border-gray-300">
          <a href="#" className="text-blue-600">
            미적분
          </a>
        </div>
        <div className="py-2 border-r border-gray-300">80</div>
        <div className="py-2 border-r border-gray-300">120</div>
        <div className="hidden mob:block py-2 border-r border-gray-300">
          93.00
        </div>
        <div className="hidden mob:block py-2">3</div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center  space-x-4 mt-4">
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          disabled
        >
          수정
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          수능예측 점수 보러가기
        </button>
      </div>
    </div>
  );
};

export default ExamplePage;

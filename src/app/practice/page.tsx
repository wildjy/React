"use client";
import React from "react";
import { useState, useEffect, useCallback, useRef, ChangeEvent } from "react";
import Map from "./map";

const liValue = {
  list1: [
    {name: '1', value: false},
    {name: '2', value: false},
  ],
  list2: [
    {name: '1', value: false},
    {name: '2', value: false},
  ]
}

const liLists = [
  {name: 'name 1', value: false},
  {name: 'name 2', value: false},
  {name: 'name 3', value: false},
  {name: 'name 4', value: false},
  {name: 'name 5', value: false},
]

const PracticePage: React.FC = () => {
  return (
    <>
      <div>
        <Map listProps={liLists} />
      </div>
    </>
  )
}

export default PracticePage;
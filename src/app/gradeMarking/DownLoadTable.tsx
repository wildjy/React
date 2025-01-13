/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { } from "react";
import { ContSlot } from "../../sharedUI/Layout/ContSlot";

import { Title } from "../../sharedUI/Title/Title";

import Table from "../../sharedUI/Table/Table";

import { ButtonLink } from "../../sharedUI/Button/Link";

export const DownLoadTable = () => {
  return (
    <div>
      <Title tag="h3" title="문제정답 다운로드" addClass="mt-10" />
      <ContSlot addClass="mt-4 md:mt-6 grid-cols-1 md:grid-cols-2 gap-10 md:gap-7">
        <div>
          <Table typeClass="">
            <Table.Colgroup>
              <col width="50%" />
              <col width="50%" />
            </Table.Colgroup>
            <Table.Thead>
              <th>구분</th>
              <th>문제</th>
            </Table.Thead>
            <Table.Tbody>
              <tr>
                <td>해설 및 정답</td>
                <td>
                  <ButtonLink mode="tertiary" size="sm" blank addClass="min-w-[5.41rem] ">
                    다운로드
                  </ButtonLink>
                </td>
              </tr>
            </Table.Tbody>
          </Table>
        </div>

        <div>
          <Table typeClass="">
            <Table.Colgroup>
              <col width="50%" />
              <col width="50%" />
            </Table.Colgroup>
            <Table.Thead>
              <th>구분</th>
              <th>문제</th>
            </Table.Thead>
            <Table.Tbody>
              <tr>
                <td>영어</td>
                <td>
                  <ButtonLink mode="tertiary" size="sm" blank addClass="min-w-[5.41rem] ">
                    다운로드
                  </ButtonLink>
                </td>
              </tr>
            </Table.Tbody>
          </Table>
        </div>
      </ContSlot>
    </div>
  );
};

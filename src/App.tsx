import {SearchOutlined} from '@ant-design/icons';
import type {InputRef} from 'antd';
import {Button, Input, Space, Table} from 'antd';
import type {ColumnsType, ColumnType} from 'antd/es/table';
import type {FilterConfirmProps} from 'antd/es/table/interface';
import React, {useEffect, useRef, useState} from 'react';
import 'antd/dist/antd.min.css'
// @ts-ignore
import Highlighter from 'react-highlight-words';
import axios from "axios";
import moment from "moment";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

type DataIndex = keyof DataType;


const App: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [whitelists, setWhitelists] = useState([])

  useEffect(() => {
    axios.get('https://slimeroyale.com/api/v1/user/whitelist')
      .then(function (response) {
        console.log(response);
        setWhitelists(response.data.results)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });

  }, [])





  const columns: ColumnsType<DataType> = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '30%',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: '20%',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Created At',
      render: (record) => {
        return (
          <div>{moment(record.createdAt).format('L')}</div>
        )
      },
      key: 'email',
      width: '30%',
    },
  ];

  return (
    <div
      className={"container d-flex align-items-center"}
      style={{
        minHeight: "100vh",
      }}
    >
      <div className={"w-100"}>
        <h2 className={"text-center"}>Whitelist registration list : {whitelists.length} address</h2>
        <Table className={"w-100 mt-3"} columns={columns} dataSource={whitelists}/>
      </div>
    </div>
  );
};

export default App;

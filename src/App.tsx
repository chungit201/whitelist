
import {Button, Input, Space, Table} from 'antd';
import type {ColumnsType, ColumnType} from 'antd/es/table';
import React, {useEffect, useRef, useState} from 'react';
import 'antd/dist/antd.min.css'
import axios from "axios";
import moment from "moment";
import * as XLSX from 'xlsx';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

type DataIndex = keyof DataType;


const App: React.FC = () => {
  const [whitelists, setWhitelists] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    axios.get('https://slimeroyale.com/api/user-ticket?page=0&limit=10000')
      .then(async function (response) {
        console.log(response);
        const data = await response.data.results;
        let convert = data && data.map((o:any, i:any) => {
          return {
            ...o,
            eventName: o.event.name
          };
        });
        setWhitelists(convert)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });

  }, [])

  console.log(whitelists)
  const columns: ColumnsType<DataType> = [
    {
      title: 'Event',
      dataIndex: 'eventName',
      key: 'eventName',
      width: '30%',

    },
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'type',
      width: '20%',
    },
    {
      title: 'Reward',
      render: (record) => {
        console.log("record",record )
        return (
          <div>{(record?.reward.description)}</div>
        )
      },
      key: 'type',
      width: '20%',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sortDirections: ['descend', 'ascend'],
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


  const handleExport = () => {
    console.log(whitelists);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(whitelists);
    ws["!cols"] = [{wch: 30}, {wch: 10}, {wch: 10}, {wch: 30}, {wch: 50}, {wch: 30}, {wch: 30}];
    XLSX.utils.book_append_sheet(wb, ws, "MySheet");
    XLSX.writeFile(wb, "whitelist.xlsx", {bookType: 'xlsx', type: 'buffer'})
  }

  const account: any = {
    username: "slimeroyale@2022",
    password: "0x616Ba1b07f2001"
  }

  const user: any = JSON.parse(localStorage.getItem('user') as any);
  console.log("user", user);

  useEffect(() => {
    if (!user) {
      const username:any = prompt("Enter username");
      setUsername(username)
      const password:any = prompt("Enter password");
      setPassword(password)
      console.log("username", username);
      console.log("pass", password);

      if (username && password) {
        if (username == account.username && password == account.password) {
          localStorage.setItem("user", JSON.stringify(account));
          window.location.reload()
        } else {
          window.location.reload()
        }
      }
    }
  }, [user, username, password])

  return (
    <div className={"app"}>
        <div
          className={"container d-flex align-items-center"}
          style={{
            minHeight: "100vh",
          }}
        >
          <div className={"w-100"}>
            <h2 className={"text-center"}>LIST OF WINNER : {whitelists.length} ADDRESS</h2>
            <div className={"d-flex justify-content-end"}>
              <button onClick={handleExport} className="btn btn-success mb-3">Export User Data</button>
            </div>
            <Table className={"w-100 mt-3"} columns={columns} dataSource={whitelists}/>
          </div>
        </div>

    </div>
  );
};

export default App;

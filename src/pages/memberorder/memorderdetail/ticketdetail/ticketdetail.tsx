import Taro from "@tarojs/taro";
import './ticketdetail.scss';
import React, {useCallback, useEffect, useState} from "react";
import {Button, Image, Text, View} from "@tarojs/components";
import {AtButton, AtTabs, AtTabsPane} from "taro-ui";
import "taro-ui/dist/style/components/tabs.scss";
import {useRouter} from "@tarojs/taro";


const ticketdetail = () => {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const { oname, usedstates, oimage, ftitle, oprice, otime } = router.params;

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleString('zh-CN', {
      hour12: false, // 24小时制
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  const [quanlists,setQuanlists] =useState([
    {
      name: "券名称1",
      state: true,
      hxtime: "2024-07-10T10:58:13",
    },
    {
      name: "券名称2",
      state: true,
      hxtime: "2024-07-10T10:58:13",
    },
    {
      name: "券名称3",
      state: true,
    },
    {
      name: "券名称4",
      state: true,
    },
  ]);



  return (
    <View className="ticket">

    </View>
  );
};

export default ticketdetail;

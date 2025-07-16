import './memberorder.scss';
import React, {useCallback, useEffect, useState} from "react";
import {Button, Image, Text, View} from "@tarojs/components";
import {AtButton, AtTabs, AtTabsPane} from "taro-ui";
import "taro-ui/dist/style/components/tabs.scss";
import Taro from "@tarojs/taro";


const memberorder = () => {

  const [orderitems,setOrderitems] = useState([
    {
      id: 1,
      oname: "优惠投放活动名称",
      usedstates: "待使用",
      oimage: "https://i.111666.best/image/60kQdD7ZIW56DacyTDOsWF.png",
      ftitle: "副标题",
      oprice: "9.80",
      otime: "2024-07-10T10:58:13",
    },
    {
      id: 2,
      oname:"优惠投放活动名称2",
      usedstates:"退款中",
      oimage:"https://i.111666.best/image/BMHZvtsK9q8OgQ35JMHJ1t.png",
      ftitle:"副标题2",
      oprice:"10.80",
      otime:"2024-06-18T16:40:41",
    },
    {
      id: 3,
      oname:"优惠投放活动名称3",
      usedstates:"退款成功",
      oimage:"https://i.111666.best/image/zCBsk3xXlvZHMEaCZPy6vh.png",
      ftitle:"副标题3",
      oprice:"102.80",
      otime:"2024-06-26T00:07:17",
    },
    {
      id: 4,
      oname:"优惠投放活动名称4",
      usedstates:"使用中",
      oimage:"https://i.111666.best/image/j2j9JGVhlytGmgEGTdV0VH.jpg",
      ftitle:"副标题4",
      oprice:"54.80",
      otime:"2024-07-05T10:08:16",
    },
  ])
  const [current, setCurrent] = useState(0);
  const formatTime = (time) => {
    const date = new Date(time)
    // 格式化时间
    const formattedDateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).
    padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).
    padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).
    padStart(2, '0')}`;

    return formattedDateTime;
  };

  const renderOrderItems = (filterState) => (
    <View className="ordercol">
      {orderitems.filter(item => filterState === '全部订单' || item.usedstates === filterState).map(item => (
        <View className="memordercol" key={item.oname}>
          <View className="membet">
            <Text className="actname">{item.oname}</Text>
            <Text className="usedstate">{item.usedstates}</Text>
          </View>
          <View className="memrow">
            <Image className="orrderimage" src={item.oimage}></Image>
            <View className="titlecol">
              <Text className="fname">{item.ftitle}</Text>
              <Text className="price">￥{'\u00A0\u00A0'}{item.oprice}</Text>
              <Text className="time">{formatTime(item.otime)}</Text>
            </View>
          </View>
          <AtButton className="selbutton" onClick={()=>openorder(item)}>查看详情</AtButton>
        </View>
      ))}
    </View>
  );
  const openorder=(item)=>{
    Taro.navigateTo({
      url:`/pages/memberorder/memorderdetail/memorderdetail?oname=${item.oname}&usedstates=${item.usedstates}&`+
      `oimage=${item.oimage}&ftitle=${item.ftitle}&oprice=${item.oprice}&otime=${item.otime}&id=${item.id}`,
    })
  }

  const tabList2 = [
    { title: '全部订单', content: renderOrderItems('全部订单') },
    { title: '待使用', content: renderOrderItems('待使用') },
    { title: '使用中', content: renderOrderItems('使用中') },
    { title: '退款中', content: renderOrderItems('退款中') },
    { title: '退款成功', content: renderOrderItems('退款成功') },
  ];
  const handleClick = useCallback((value) => {
    setCurrent(value);
  }, [])

  return (
    <View className="order">
      <AtTabs current={current} scroll tabList={tabList2.map(tab => ({ title: tab.title }))} onClick={handleClick}>
        {tabList2.map((tab, index) => (
          <AtTabsPane current={current} index={index} key={index}>
            {tab.content}
          </AtTabsPane>
        ))}
      </AtTabs>
    </View>
  );
};

export default memberorder;

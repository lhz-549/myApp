import Taro from "@tarojs/taro";
import './backpricedetail.scss';
import React, {useCallback, useEffect, useState} from "react";
import {Button, Image, Text, View} from "@tarojs/components";
import {AtButton, AtTabs, AtTabsPane, AtTimeline} from "taro-ui";
import "taro-ui/dist/style/components/tabs.scss";
import {useRouter} from "@tarojs/taro";
import "taro-ui/dist/style/components/timeline.scss";
import "taro-ui/dist/style/components/icon.scss";
import dayjs from 'dayjs';


const backpricedetail = () => {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const { id, oprice, usedstates} = router.params;
  // Taro.setNavigationBarTitle({
  //   title: title
  // });

  const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const backing = [
    {
      title: '退款受理中',
      content: [`${currentTime}`],
      icon: 'clock',
      color: 'yellow',
    },
    {
      title: '提交申请',
      content: ['2024-07-08 15:21:10'],
      icon: 'check-circle',
      color: 'green',
    },
  ];

  const backed = [
    {
      title: '退款已成功',
      content: [`${currentTime}`],
      //icon: 'clock',
      //color: 'yellow',
      icon: 'check-circle',
      color: 'green',
    },
    {
      title: '退款受理中',
      content: ['2024-07-08 15:21:10'],
      icon: 'check-circle',
      color: 'green',
    },
    {
      title: '提交申请',
      content: ['2024-07-08 15:21:10'],
      icon: 'check-circle',
      color: 'green',
    },
  ];


  return (
    <View className="backprice">
      <View className="title2">
        {usedstates==="退款中"&&
          <View className="back-row" >
            <Image className="icon" src={"https://i.111666.best/image/PZDu1vxQoWJ8Qk1QwO3QQF.png"}/>
            <Text className="title2-text">退款中</Text>
          </View>
        }
        {usedstates==="退款成功"&&
          <View className="back-row" >
            <Image className="icon" src={"https://i.111666.best/image/wOErnebEKnhOEaJIsFAk7W.png"}/>
            <Text className="title2-text">退款成功</Text>
          </View>
        }
        <Text className="title2-text3">￥{'\u00A0'}{oprice}</Text>
      </View>
      <View className="backstepcol">
        {usedstates === "退款中" &&
          <AtTimeline
            className="timeline"
            pending
            items={backing}
          >
          </AtTimeline>
        }
        {usedstates==="退款成功"&&
          <AtTimeline
            className="timeline"
            pending
            items={backed}
          >
          </AtTimeline>
        }
      </View>
    </View>
  );
};

export default backpricedetail;

import Taro from "@tarojs/taro";
import './applyforbackprice.scss';
import React, {useCallback, useEffect, useState} from "react";
import {Button, Image, Text, View} from "@tarojs/components";
import {AtButton, AtTabs, AtTabsPane} from "taro-ui";
import "taro-ui/dist/style/components/tabs.scss";
import {useRouter} from "@tarojs/taro";


const applyforbackprice = () => {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const { id, oname, oprice, usedstates} = router.params;


  const backprice=()=>{
    Taro.showToast({
      title: '正在申请退款处理',
      icon: 'none',
    });
  };


  return (
    <View className="backprice">
      <View className="notice">
        <Text className="notice-text">退款申请一经提交后不可撤销</Text>
      </View>
      <View className="title">
        <Text className="title-text">{oname}</Text>
      </View>
      <View className="title2">
        <Text className="title2-text">退款金额{'\u00A0\u00A0'}<Text className="title2-text2">(实付金额)</Text></Text>
        <Text className="title2-text3">￥{'\u00A0'}{oprice}</Text>
      </View>
      <View className="title3">
        <Text className="title2-text4">退回账户</Text>
        <View className="backcol">
          <Text className="title2-text5">原支付账户</Text>
          <Text className="title2-text3">1-3个工作{'\u00A0\u00A0'}<Text className="title2-text6">内到账</Text></Text>
        </View>
      </View>

      <View className="backbuttonview">
        <AtButton className="backbutton" onClick={backprice}>申请退款</AtButton>
      </View>
    </View>
  );
};

export default applyforbackprice;

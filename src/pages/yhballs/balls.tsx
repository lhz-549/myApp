import React, {useEffect, useState} from 'react';
import './balls.scss';
import {Button, Image, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import request from '../../utils/request'

const balls = () => {
  const userInfo = Taro.getStorageSync('userInfo');
  const[yhrecords,setYhrecords]=useState([
    {

    },
  ])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=>{
    if(userInfo){
      request({
        url: `/maintainrecord/allRecordByUserid3?userid=${userInfo.id}`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.message === "success") {
          const proItems = res.data.map(item => ({
            id: item.id,
            plantId: item.plantId,
            productId: item.productId,
            operation: item.operation,
            operationValue: item.operationValue,
            currentValue: item.currentValue,
            executeTime: item.executeTime,
            pname: item.pname,
          }));
          //console.log(proItems);
          setYhrecords(proItems);
        }
      }).catch(err => {
        Taro.showToast({
          title: '请求失败: ' + err.message,
          icon: 'none',
        });
      });
    }

  },[])

  const formatTime = (time) => {
    const date = new Date(time)
    // 格式化时间
    const formattedDateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).
    padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).
    padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).
    padStart(2, '0')}`;

    return formattedDateTime;
  };

  return (
    <View className="order">
      <Text className="ordertitle">助力记录</Text>
      {yhrecords.map(item => (
        <View  key={item.id} className='orderinfo' >
          <View className="main-container">
            <View className="image-container">
              <Image className="icon" src="https://i.111666.best/image/1b34YUzdSflvLnF3Sp0zzE.png" />
            </View>
            <View className="text-container">
              <View className="left-text">
                <Text className="orderiteminfo">产品：{item.pname}{'\u00A0\u00A0'}|{'\u00A0\u00A0'}{item.plantId}</Text>
                <Text className="orderiteminfo">时间：{formatTime(item.executeTime)}</Text>
              </View>
              <View className="right-text">
                <Text className="orderiteminfo">成长值：{item.currentValue}</Text>
                <Text className="orderiteminfo">数值变更：{item.operationValue}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default balls;

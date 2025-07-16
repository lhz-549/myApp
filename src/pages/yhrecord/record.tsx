import React, {useEffect, useState} from 'react';
import './record.scss';
import {Button, Image, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import request from '../../utils/request'
import {AtSearchBar} from "taro-ui";

const record = () => {
  const userInfo = Taro.getStorageSync('userInfo');
  const[yhrecords,setYhrecords]=useState([
    {

    },
  ])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=>{
    if(userInfo){
      request({
        url: `/maintainrecord/allRecordByUserid2?userid=${userInfo.id}`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.message === "success") {
          const proItems = res.data.map(item => ({
            id: item.id,
            productId: item.productId,
            operation: item.operation,
            aoperationValue: item.operationValue,
            currentValue: item.currentValue,
            executeTime: item.executeTime,
            pname: item.pname,
            plantId:item.plantId,
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

  const [value, setValue] = useState('')
  const onChange = (val) => {
    setValue(val)
  }

  const onActionClick = () => {
    //console.log("value:"+value);
    request({
      url: `/maintainrecord/allRecordByuidpnameoper?userid=${userInfo.id}&keywords=${value}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const proItems = res.data.map(item => ({
          id: item.id,
          productId: item.productId,
          operation: item.operation,
          aoperationValue: item.operationValue,
          currentValue: item.currentValue,
          executeTime: item.executeTime,
          pname: item.pname,
          plantId:item.plantId,
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
  const onClear = () => {
    setValue("");
    Taro.showToast({
      title: '已清除',
      icon: 'none',
      duration: 1000,
    })
  }

    //控制记录image显示
  const getImageSrc = (operation) => {
    switch (operation) {
      // case '浇水':
      //   return "https://i.111666.best/image/zCBsk3xXlvZHMEaCZPy6vh.png";
      // case '施肥':
      //   return "https://i.111666.best/image/60kQdD7ZIW56DacyTDOsWF.png";
      // case '修剪':
      //   return "https://i.111666.best/image/BMHZvtsK9q8OgQ35JMHJ1t.png";
      case '浇水':
        return "https://i.111666.best/image/h8YPVTlY1bIFvvZcKvNIdI.png";
      case '施肥':
        return "https://i.111666.best/image/OsLDQn0FOy7R0Tlne9MdeH.png";
      case '修剪':
        return "https://i.111666.best/image/xUhyZdscubFs5qVYl5WWBP.png";
      default:
        return require("../../assets/feiliao.jpg"); // 默认图片
    }
  };

  return (
    <View className="order">
      <View className="searchframe">
        <AtSearchBar
          value={value}
          onChange={onChange}
          onActionClick={onActionClick}
          onClear={onClear}
          placeholder=" 名称,类型 模糊查询 树,水 (,号隔开)"
          maxLength={50}
        />
      </View>
      <Text className="ordertitle">操作记录</Text>
      {yhrecords.map(item => (
        <View  key={item.id}  >
          <View className='orderinfo2'>
            <Text className="orderiteminfo1">{item.pname}</Text>
            <Text className="orderiteminfo1">{'\u00A0\u00A0'}|{'\u00A0\u00A0'}{item.plantId}</Text>
            <Text className="orderiteminfo1">{'\u00A0\u00A0'}|{'\u00A0\u00A0'}记录号:{item.id}</Text>
          </View>
          <View className='orderinfo'>
            <View className="oiimage">
              <Image className="icon" src={getImageSrc(item.operation)}></Image>
            </View>
            <View className="oitext">
              <View className="oitext2">
                <Text className="orderiteminfo">{item.operation}</Text>
                <Text className="orderiteminfo">{item.aoperationValue}</Text>
              </View>
              {/*<Text className="orderiteminfo">{item.pname}</Text>*/}
              <View className="oitext2">
                <Text className="orderiteminfo2">成长值：{item.currentValue }{'\u00A0\u00A0'}</Text>
                <Text className="orderiteminfo2">|{'\u00A0\u00A0'}时间：{formatTime(item.executeTime)}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default record;

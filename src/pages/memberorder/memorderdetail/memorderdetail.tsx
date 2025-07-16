import Taro from "@tarojs/taro";
import './memorderdetail.scss';
import React, {useCallback, useEffect, useState} from "react";
import {Button, Image, Text, View} from "@tarojs/components";
import {AtButton, AtTabs, AtTabsPane} from "taro-ui";
import "taro-ui/dist/style/components/tabs.scss";
import {useRouter} from "@tarojs/taro";


const memorderdetail = () => {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const { id, oname, usedstates, oimage, ftitle, oprice, otime } = router.params;

  const formatTime = (time) => {
    const date = new Date(time)
    // 格式化时间
    const formattedDateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).
    padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).
    padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).
    padStart(2, '0')}`;

    return formattedDateTime;
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=>{
    if(usedstates==="使用中"){
      setQuanlists(prevQuanlists => {
        // 克隆数组并修改第一个和第二个元素的 state 为 false
        const newQuanlists = [...prevQuanlists];
        if (newQuanlists.length > 0) newQuanlists[0].state = false;
        if (newQuanlists.length > 1) newQuanlists[1].state = false;
        return newQuanlists;
      });
    }
  },[])

  const handleCopy = (value) => {
    Taro.setClipboardData({
      data: value,
      success: function () {
        Taro.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        });
      }
    });
  };
  const ticketdetail=(item)=>{
    Taro.navigateTo({
      url:`ticketdetail/ticketdetail?ticketname=${item.name}`,
    })
  }
  const backprice=()=>{
    Taro.navigateTo({
      url:`applyforbackprice/applyforbackprice?id=${id}&oname=${oname}&oprice=${oprice}&usedstates=${usedstates}`,
    })
  };
  const backpricestep=()=>{
    Taro.navigateTo({
      url:`backpricedetail/backpricedetail?id=${id}&oprice=${oprice}&usedstates=${usedstates}`,
    })
  };


  const ordernum = "20240708194556789";

  return (
    <View className="orderdt">
      <View className="orderrow">
        <Image className="oiamge" src={'https://i.111666.best/image/YtPphr4jjR7wyomsdWTsnx.png'}/>
        <Text className="usedstate">{usedstates}</Text>
      </View>
      <View className="memordercol">
        <View className="membet">
          <Text className="actname">{oname}</Text>
        </View>
        <View className="memrow">
          <Image className="orrderimage" src={oimage}></Image>
          <View className="titlecol">
            <Text className="fname">{ftitle}</Text>
            <Text className="time">实付 {'\u00A0\u00A0'} ￥ {oprice}</Text>
          </View>
        </View>
        {usedstates==="待使用"&&
          <AtButton className="selbutton" onClick={backprice}>申请退款</AtButton>
        }
        {usedstates==="退款中"&&
          <View className="buttonbet">
            <Text className="backprice">退款中</Text>
            <AtButton className="selbutton" onClick={backpricestep} >退款进度</AtButton>
          </View>
        }
        {usedstates==="退款成功"&&
          <View className="buttonbet">
            <Text className="backprice">退款成功</Text>
            <AtButton className="selbutton" onClick={backpricestep} >退款进度</AtButton>
          </View>
        }
      </View>
      {(usedstates==="使用中"||usedstates==="待使用")&&
        <View className="memordercol2">
          <Text className="actname2">商品详情</Text>
          {quanlists.map((item,index)=>(
            <View className="quandetailcol">
              <View className="quanrow" key={index}>
                <Text className="quanname">{item.name}</Text>
                {item.state &&
                  <AtButton className="selbutton2" onClick={()=>ticketdetail(item)}>详情</AtButton>
                }
                {!item.state &&
                  <View className='selbutton2'>
                    <Text>已使用</Text>
                  </View>
                }
              </View>
              {(usedstates==="使用中" && !item.state)&&
                <Text className="memordertitle">核销时间：<Text className="memordertitle">{item.hxtime}</Text></Text>
              }
            </View>

          ))}
        </View>
      }


      <View className="memordercol">
        <Text className="actname3">订单信息</Text>
        <Text className="memordertitle">手机号码：<Text className="memorderinfo">136****1258</Text></Text>
        <Text className="memordertitle">订单编号：<Text className="memorderinfo">{ordernum}</Text ><Text className="memorderinfo2" onClick={()=>handleCopy(ordernum)}>复制</Text></Text>
        <Text className="memordertitle2">下单时间：<Text className="memorderinfo">2024-10-02 23:59:15</Text></Text>
      </View>
    </View>
  );
};

export default memorderdetail;

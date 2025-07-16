import request from "../../utils/request";
import Taro, {useRouter} from "@tarojs/taro";
import './paysuccess.scss';
import React, {useEffect, useState} from "react";
import {Button, Image, Input, Text, View} from "@tarojs/components";
import {AtButton, AtInputNumber} from "taro-ui";
import "taro-ui/dist/style/components/input-number.scss";
import "taro-ui/dist/style/components/icon.scss";

const paysuccess = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const { orderid, price, paymethod, orderStrcurr } = router.params;
  const [payfun,setPayfun] = useState("");
  useEffect(()=>{
    switch (paymethod) {
      case 1: setPayfun("微信支付");break;
      case 2: setPayfun("云果余额支付");break;
    }
  },[]);

  const findorder=()=>{
    if(orderid){
      console.log("orderid");
      request({
        url: `/orderitems/selectorderinfobyorderid?orderid=${orderid}`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.message === "success") {
          const cartItems = {
            orderitemId: res.data.orderitemId,
            productId: res.data.productId,
            remark: res.data.remark,
            quantity: res.data.quantity,
            price: res.data.price,
            updateTime: res.data.updateTime,
            finishTime: res.data.finishTime,
            orderitemState: res.data.orderitemState,
            pname: res.data.pname,
            pimage: res.data.pimage,
            orderNum: res.data.orderNum,
            originalOrdernum: res.data.originalOrdernum,
            badge: res.data.badge,
            stockQuantity: res.data.stockQuantity,
            selledQuantity: res.data.selledQuantity,
            categoryName: res.data.categoryName,
            categoryDescription: res.data.categoryDescription,
            pprice: res.data.pprice,
            pdescription: res.data.pdescription,
            pmarketprice: res.data.pmarketprice,
            specvalueId: res.data.specvalueId,
            specvalueName: res.data.specvalueName,
          };
          Taro.navigateTo({
            url: `/pages/orderdetail/orderdetail?orderitemId=${cartItems.orderitemId}&productId=${cartItems.productId}&quantity=${cartItems.quantity}&price=${cartItems.price}&` +
              `updateTime=${cartItems.updateTime}&finishTime=${cartItems.finishTime}&orderitemState=${cartItems.orderitemState}&pname=${cartItems.pname}&pimage=${cartItems.pimage}&` +
              `badge=${cartItems.badge}&categoryName=${cartItems.categoryName}&categoryDescription=${cartItems.categoryDescription}&remark=${cartItems.remark}&` +
              `pprice=${cartItems.pprice}&pdescription=${cartItems.pdescription}&pmarketprice=${cartItems.pmarketprice}&specvalueId=${cartItems.specvalueId}&specvalueName=${cartItems.specvalueName}&orderNum=${cartItems.orderNum}`,
          });
        } else {
          Taro.showToast({
            title: '没有找到相关订单',
            icon: 'none',
          });
        }
      }).catch(err => {
        Taro.showToast({
          title: '网络请求失败',
          icon: 'none',
        });
      });
    }
    if(orderStrcurr){
      console.log("orderStrcurr");
      Taro.navigateTo({
        url: `/pages/orderdetail/orderdetail?orderStrcurr=${orderStrcurr}&totalprice=${price}`,
      });
    }

  };
  const finish=()=>{
    if(orderStrcurr||orderid){
      console.log("orderid:"+orderid+"orderStrcurr:"+orderStrcurr);
      Taro.switchTab({
        url:`/pages/shop/shop`,
      });
    }else{
      Taro.showToast({
        title: '测试页不响应',
        icon: 'none',
      });
    }
  }

  const [prize, setPrize] = useState(null);
  const prizes = [
    { name: '5果仔', image: 'https://i.111666.best/image/JjKwDwzzeFSVPZ0BZuGYx0.png' },
    { name: '会员礼包', image: 'https://i.111666.best/image/Ug9W4w0LoPngB8YpgyEHH3.png' },
    { name: '满99减8.9', image: 'https://i.111666.best/image/u0rGqKALY3qT1MaB4H3eyK.png' },
    { name: '满3.01减3', image: 'https://i.111666.best/image/RbW9HSVJwmShHYXbNF8Wa6.png' },
    { name: 'PLUS会员卡', image: 'https://i.111666.best/image/m8IjmnpmSz6Sp1IMkroO03.png' },
    { name: '至高1年PLUS', image: 'https://i.111666.best/image/KknCEKTcUrO2j6AQpK16Ng.png' },
    { name: '谢谢参与', image: 'https://i.111666.best/image/LCXhd9PzlbcEoSyy6zw10W.png' },
    { name: '云果农场', image: 'https://i.111666.best/image/zL1N61gacxIsDjKCmJueQT.png' },
  ];


  const handleDraw = () => {
    const randomIndex = Math.floor(Math.random() * prizes.length);
    setPrize(prizes[randomIndex].name);
  };


  return (
    <View className="paysuccess-view">
      <View className="paysuccess">
        <View>
          <Text className="pay-right" onClick={finish}>完成</Text>
        </View>
        <View  className="pay-bet-out">
          <View className="pay-bet">
            <View className="pay-col">
              <Text className="pay-s1">付款成功</Text>
              <Text className="pay-s2">实付{'\u00A0'}￥{parseFloat(price).toFixed(2)}</Text>
              <Text className="pay-s2">{payfun}</Text>
            </View>
            <View className="pay-icon-out">
              <Image  className="pay-icon" src={"https://i.111666.best/image/UatrL3nHpxqUG5Iw0K1Xdl.png"}/>
            </View>
          </View>
        </View>
        <View>
          <AtButton className="findorder" onClick={findorder}>查看订单</AtButton>
        </View>
      </View>
      <View className="choujiangview">
        <View className="result2">下单抽抽乐</View>
        <View className="prizes-grid">
          {prizes.slice(0, Math.ceil(prizes.length / 2)).map((item, index) => (
            <View key={index} className="prize-item">
              <Image className="imageicon" src={item.image}></Image>
              <Text className="icontext">{item.name}</Text>
            </View>
          ))}
          <View  className="draw-button2" onClick={handleDraw}>
            <Text className="buttext">立即抽奖</Text>
            <Text className="buttext2">GO</Text>
          </View>
          {/*<Button className="draw-button" onClick={handleDraw}>立即抽奖</Button>*/}
          {prizes.slice(Math.ceil(prizes.length / 2)).map((item, index) => (
            <View key={index} className="prize-item">
              <Image className="imageicon" src={item.image}></Image>
              <Text className="icontext">{item.name}</Text>
            </View>
          ))}
        </View>
        {prize && <View className="result">恭喜你，获得 {'\u00A0'} <Text className="result3">{prize} {'\u00A0'}</Text>!</View>}
      </View>
    </View>
  );
};

export default paysuccess;

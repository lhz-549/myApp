import request from "../../utils/request";
import Taro, {useRouter} from "@tarojs/taro";
import './gpwaitpay.scss';
import React, {useEffect, useState} from "react";
import {Button, Image, Input, Text, View} from "@tarojs/components";
import {AtButton, AtInputNumber} from "taro-ui";
import "taro-ui/dist/style/components/input-number.scss";
import "taro-ui/dist/style/components/icon.scss";

const gpwaitpay = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const { orderid , orderidcurr, orderStrcurr, proprice,ordercreatetime} = router.params;
  const [orderinfo,setOrderinfo]=useState([{}]);

  const userInfo = Taro.getStorageSync('userInfo');

  const cancel=()=>{
    // /orderitems/updateorderstate
    request({
      url: `/orderitems/updateorderstrstate?orderitemidstr=${orderStrcurr}&state=0`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (res.message === "success"&& res.data === 1) {
        Taro.showToast({
          title: '订单已取消',
          icon: 'success',
        });
        setTimeout(() => {
          setSeconds(0);
        }, 500);
      }}).catch(err => {
      Taro.showToast({
        title: '网络请求失败',
        icon: 'none',
      });
    });
  };

  const formatTime = (time) => {
    const date = new Date(time)
    // 格式化时间
    const formattedDateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).
    padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).
    padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).
    padStart(2, '0')}`;

    return formattedDateTime;
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=>{
    request({
      url: `/orderitems/selectorderinfobyorderitemidstr?orderitemidstr=${orderStrcurr}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (res.message === "success") {
        const proItems = res.data.map(item => ({
          orderitemId: item.orderitemId,
          orderNum: item.orderNum,
          quantity: item.quantity,
          price: item.price,
          pprice: item.pprice,
          createTime: formatTime(item.finishTime),
          specvalueName: item.specvalueName,
          pimage: item.pimage,
          pname: item.pname,
          stockQuantity: item.stockQuantity,
          selledQuantity: item.selledQuantity,
          remark: item.remark,
        }));
        setOrderinfo(proItems);
      }}).catch(err => {
      Taro.showToast({
        title: '网络请求失败',
        icon: 'none',
      });
    });
  },[])

  const gotopay=()=>{
    request({
      url: `/orderitems/updateorderstatus2?userid=${userInfo.id}&orderitemidstr=${orderStrcurr}&orderstate=2&paystate=2&paymethod=2`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (res.message === "success"&& res.data === 1) {
        Taro.showToast({
          title: '订单已支付',
          icon: 'success',
        });
        Taro.eventCenter.trigger('cartUpdated');
        Taro.redirectTo({
          url: `/pages/paysuccess/paysuccess?price=${proprice}&paymethod=2&orderStrcurr=${orderStrcurr}`,
        });
      }else {
        Taro.showToast({
          title: '未开通云果余额账户或余额不足',
          icon: 'none',
        });
      }}).catch(err => {
      Taro.showToast({
        title: '网络请求失败',
        icon: 'none',
      });
    });
  }

  const [seconds, setSeconds] = useState(600);
  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(countdown);
          request({
            url: `/orderitems/updateorderstrstate?orderitemidstr=${orderStrcurr}&state=0`,
            method: 'POST',
            header: {
              //'token': `Bearer ${Taro.getStorageSync('token')}`,
              'Content-Type': 'application/json',
            },
          }).then(res => {
            if (res.message === "success"&& res.data === 1) {
              Taro.showToast({
                title: '订单已取消',
                icon: 'success',
              });
            }}).catch(err => {
            Taro.showToast({
              title: '网络请求失败',
              icon: 'none',
            });
          });
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);
  const formatTime2 = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs < 10 ? '0' : ''}${hrs} : ${mins < 10 ? '0' : ''}${mins} : ${secs < 10 ? '0' : ''}${secs}`;
  };

  const deleteorder=()=>{
    request({
      url: `/orderitems/deleteorderbyidstr?orderitemidstr=${orderStrcurr}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (res.message === "success"&& res.data === 1) {
        Taro.showToast({
          title: '订单已删除',
          icon: 'success',
        });
        setTimeout(() => {
          Taro.navigateBack();
        }, 500);
      }}).catch(err => {
      Taro.showToast({
        title: '网络请求失败',
        icon: 'none',
      });
    });
  };
  const againbuy=()=>{
    Taro.navigateBack();
    Taro.navigateBack();
  };

  return (
    <View className="confirm">
      {seconds > 0 &&
        <View className="payinfo-col">
          <View className="payinfo-row">
            <Image className="pay-iamge" src={'https://i.111666.best/image/YtPphr4jjR7wyomsdWTsnx.png'}/>
            <Text className="waitpay-text">等待付款</Text>
          </View>
          <View className="payinfo-between">
            <Text className="warning-text">需付 : ￥{parseFloat(proprice).toFixed(2)}</Text>
            <Text className="warning-text">请在{'\u00A0'}<Text
              className="daojishi">{formatTime2(seconds)}</Text>{'\u00A0'}内支付</Text>
          </View>
        </View>
      }
      {seconds <= 0 &&
        <View className="payinfo-col">
          <View className="payinfo-row">
            <Image  className="pay-iamge" src={'https://i.111666.best/image/YtPphr4jjR7wyomsdWTsnx.png'} />
            <Text className="waitpay-text" >已取消</Text>
          </View>
          <View className="payinfo-row">
            <Text className="warning-text">取消原因： 超时未支付</Text>
          </View>
        </View>
      }
      {orderinfo.map(item => (
        <View>
          <View className="pro-row" key={item.orderitemId}>
            <Image src={item.pimage} className="pro-image"></Image>
            <View className="pro-clo-info">
              <Text className="pro-title">{item.pname}</Text>
              <View className="pro-spec">
                <Text className="specvalue">
                  {item.specvalueName}
                </Text>
              </View>
              <View className="pro-between">
                <Text className="pro-price">￥{(parseFloat(item.price) / item.quantity).toFixed(2)}</Text>
                <Text className="pro-quantity"> x {item.quantity}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
      <View className="orderinfo-col">
        <View className="orderinfo-view">
          <Text className="orderinfo-text">订单编号：</Text>
          <Text className="orderinfo-numtext">{orderidcurr}</Text>
        </View>
        <View className="orderinfo-view">
          <Text className="orderinfo-text">下单时间：</Text>
          <Text className="orderinfo-numtext">{ordercreatetime}</Text>
        </View>
        <View className="orderinfo-view">
          <Text className="orderinfo-text">支付方式：</Text>
          <Text className="orderinfo-numtext">在线支付</Text>
        </View>
        <View className="orderinfo-view">
          <Text className="orderinfo-text">订单备注：</Text>
          <Text className="orderinfo-numtext">{orderinfo[0].remark}</Text>
        </View>
        <View className= "totalprice-view">
          <Text className= "totalprice">商品总额</Text>
          <Text className= "totalpricenum"> ￥ {parseFloat(proprice).toFixed(2)}</Text>
        </View>
        <View className= "shouldpay">
          <Text className= "shouldpayname">应付金额 {'\u00A0'}{'\u00A0'}<Text className= "shouldpaynum">￥ {parseFloat(proprice).toFixed(2)}</Text></Text>
        </View>
      </View>

      <View className="xuniline"></View>

      {seconds > 0 &&
        <View className="actions2">
          <View className="actions2-viewout1">
            <Text className="action2-button-car" onClick={cancel}>取消订单</Text>
          </View>
          <View className="actions2-viewout2">
            <AtButton className="action2-button-buy" onClick={gotopay}>支付 ￥ {parseFloat(proprice).toFixed(2)}</AtButton>
          </View>
        </View>
      }
      {seconds <= 0 &&
        <View className="actions2">
          <View className="actions2-viewout1">
            <Text className="action2-button-car" onClick={deleteorder}>删除订单</Text>
          </View>
          <View className="actions2-viewout2">
            <AtButton className="action2-button-buy" onClick={againbuy}>重新购买</AtButton>
          </View>
        </View>
      }
    </View>
  );
};

export default gpwaitpay;

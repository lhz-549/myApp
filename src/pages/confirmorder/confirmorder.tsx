import request from "../../utils/request";
import Taro, {useRouter} from "@tarojs/taro";
import './confirmorder.scss';
import React, {useEffect, useState} from "react";
import {Button, Image, Input, Text, View} from "@tarojs/components";
import {AtButton, AtFloatLayout, AtInputNumber} from "taro-ui";
import "taro-ui/dist/style/components/input-number.scss";
import "taro-ui/dist/style/components/icon.scss";
// import "taro-ui/dist/style/components/float-layout.scss";

const confirmorder = () => {
  const router = useRouter();
  const { id, image, title, price, quantity, specvalueId, specvalueName,specfreight} = router.params;

  const [proprice,setProprice]=useState(0);

  const [freight,setFreight]=useState(0);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (price && quantity) {
      setProprice(parseFloat(price) * parseInt(quantity, 10));
    }
    if(specfreight){
      setFreight(parseFloat(specfreight));
    }
  }, [price, quantity]);

  const [amount, setAmount] = useState('');
  const handleAmountChange = (e) => {
    setAmount(e.detail.value);
  };

  const [quantityvalue,setQuantityvalue]=useState(parseInt(quantity));
  const handleChange = (value) => {
    setQuantityvalue(value);
    setProprice(parseFloat(price) * parseInt(value, 10));
  };

  const userInfo = Taro.getStorageSync('userInfo');
  const daipay=()=>{
    Taro.showToast({
      title: '代付正在开发中',
      icon: 'success',
    });
  };
  const oneselfpay=()=>{
    console.log("自己付");
    handleOpen();
  };
  const [orderidcurr,setOrderidcurr] = useState('');
  const [isOpened, setIsOpened] = useState(false);
  const handleOpen = () => {
    if(userInfo){
      setIsOpened(true);
      request({
        url: `/orderitems/addorder`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        },
        data:{
          userid: userInfo.id,
          productId: id,
          quantity: quantityvalue,
          specvalueId: specvalueId,
          specvalueName: specvalueName,
          remark: amount
        }
      }).then(res => {
        if (res.message === "success") {
          Taro.showToast({
            title: '订单创建成功',
            icon: 'success',
          });
          console.log("订单id:" + res.data); // 修改为 console.log
          setOrderidcurr(res.data);
        } else {
          Taro.showToast({
            title: '创建订单失败',
            icon: 'none',
          });
        }
      }).catch(err => {
        console.error("请求错误:", err); // 输出具体的错误信息
        Taro.showToast({
          title: '网络请求失败',
          icon: 'none',
        });
      });
    }else {
      Taro.showToast({
        title: '请先登录账号',
        icon: 'none',
      });
    }
  };
  const handleClose = () => {
    if(userInfo){
      setIsOpened(false);
      Taro.navigateTo({
        url: `/pages/waitpay/waitpay?orderid=${orderidcurr}`,
      });
    }else {
      Taro.showToast({
        title: '请先登录账号',
        icon: 'none',
      });
    }
  };

  const gotopay=()=>{

    if(userInfo){
      request({
        url: `/orderitems/updateorderstatus?orderid=${orderidcurr}&orderstate=2&paystate=2&paymethod=2`,
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
          setIsOpened(false);
          setTimeout(() => {
            Taro.redirectTo({
              url: `/pages/paysuccess/paysuccess?orderid=${orderidcurr}&price=${proprice}&paymethod=2`,
            });
          }, 500);
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
    }else {
      Taro.showToast({
        title: '请先登录账号',
        icon: 'none',
      });
    }
    // /orderitems/updateorderstatus
  }

  return (
    <View className="confirm">
      <View className="pro-clo">
        <View className="pro-row">
          <Image src={image} className="pro-image"></Image>
          <View className="pro-clo-info">
            <Text className="pro-title">{title}</Text>
            <View className="pro-spec">
              <Text className="specvalue">
                {specvalueName}
              </Text>
            </View>
            <View className="pro-between">
              <Text className="pro-price">￥{parseFloat(price).toFixed(2)}</Text>
              {/*<Text className="pro-quantity"> x {quantity}</Text>*/}
              <AtInputNumber
                className="pro-quantity"
                type='number'
                min={1}
                max={100}
                step={1}
                value={quantityvalue}
                onChange={handleChange}
              />
            </View>
            <View>
              <Text className="pro-service">售出概不退货</Text>
            </View>
          </View>
        </View>
        {id &&
          <View className="pro-clo">
            <Text className="pro-give">[赠品]
              <Text>
                {/*小包卫生纸 (包 x 1)*/}
                {'\u00A0\u00A0'}|{'\u00A0\u00A0'}( 暂无 )
              </Text></Text>
            <View className="pro-message-out">
              <Text className="pro-message-title">留言</Text>
              <Input
                className="pro-message"
                type="text"
                placeholder="建议留言前与客服提前沟通确认"
                value={amount}
                onInput={handleAmountChange}
              />
            </View>
          </View>
        }
      </View>
      <View className="pro-clo">
        <View className="pro-info-between">
          <Text className="pro-message-title">商品金额</Text>
          <Text className="pro-message-title">￥ {proprice.toFixed(2)}</Text>
        </View>
        <View className="pro-info-between">
          <Text className="pro-message-title">运费(暂不支持运送)</Text>
          <Text className="pro-message-title">￥ {freight.toFixed(2)}</Text>
        </View>
        <View className="pro-info-total">
          <Text className="pro-message-title">合计：
            <Text className="pro-price2">￥ {proprice.toFixed(2)}</Text>
          </Text>
        </View>
      </View>
      <View className="actions2">
        {/*<View className="pro-info-total">*/}
        {/*  <Text className="pro-message-title">合计：*/}
        {/*    <Text className="pro-price2">￥ {proprice.toFixed(2)}</Text>*/}
        {/*  </Text>*/}
        {/*</View>*/}
        {/*<View className="actions-daizi">*/}
          <AtButton className="action2-button-car" onClick={daipay}>代付</AtButton>
          <AtButton className="action2-button-buy" onClick={oneselfpay}>自付</AtButton>
        {/*</View>*/}
      </View>

      <AtFloatLayout className="payframe" isOpened={isOpened} onClose={handleClose}
        // title="付款"
      >
        <View className="closebutton-out">
          <Text className="closebutton" onClick={handleClose}>✕</Text>
          <Text className="mimaused">使用密码</Text>
        </View>
        <View className="payment-container">
          <View className="payment-info">
            <Text className="payment-title">云果</Text>
            <Text className="payment-amount-icon">¥ <Text className="payment-amount">{proprice.toFixed(2)}</Text></Text>
          </View>
          <View className="payment-method">
            <Text className="payment-description">付款方式</Text>
            <View className="payment-method-details">
              <Image className="payment-icon" src={'https://i.111666.best/image/ElOE5LNQT9C62qjqhNxJP5.png'}>💎</Image>
              <Text className="payment-description">云果余额</Text>
            </View>
          </View>
          <View className="payment-method2">
            <Text className="payment-description">付款说明</Text>
            <Text className="payment-description">由腾安公司和万家基金提供基金相关服务</Text>
          </View>

          <Button className="payment-button" onClick={gotopay}>支付</Button>
        </View>
      </AtFloatLayout>
    </View>
  );
};

export default confirmorder;

import request from "../../utils/request";
import Taro, {useRouter} from "@tarojs/taro";
import './gpconfirmorder.scss';
import React, {useEffect, useState} from "react";
import {Button, Image, Input, Text, View} from "@tarojs/components";
import {AtButton, AtFloatLayout, AtInputNumber} from "taro-ui";
import "taro-ui/dist/style/components/input-number.scss";
import "taro-ui/dist/style/components/icon.scss";

const gpconfirmorder = () => {
  const router = useRouter();
  const {cartItemIdstr} = router.params;

  const [proprice,setProprice]=useState(0);

  const [freight,setFreight]=useState(0);

  const [confirmorder,setConfirmorder]=useState([{},]);

  const userInfo = Taro.getStorageSync('userInfo');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // if (price && quantity) {
    //   setProprice(parseFloat(price) * parseInt(quantity, 10));
    // }

    request({
      url: `/user-cart-details/selectcartdetalbyuseridandcartitemidstr?userid=${userInfo.id}&cartitemidstr=${cartItemIdstr}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const cartItems = res.data.map(item => ({
          id: item.productId,
          cartitemId: item.cartitemId,
          specvalueId: item.specvalueId,
          specvalueName: item.specvalueName,
          title: item.pname,
          price: item.unitPrice,
          quantity: item.quantity,
          image: item.pimage,
          liuyan: "",
        }));
        setConfirmorder(cartItems);
        calculateTotalPrice(cartItems);
      }}).catch(err => {
        Taro.showToast({
          title: '请求失败: ' + err.message,
          icon: 'none',
        });
      });
  }, []);

  const calculateTotalPrice = (items) => {
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setProprice(totalPrice);
  };

  const handleQuantityChange = (value, cartitemId) => {
    const updatedOrder = confirmorder.map(item => {
      if (item.cartitemId === cartitemId) {
        return { ...item, quantity: value };
      }
      return item;
    });

    request({
      url: `/cartitems/cartitemsupdatenum?cartitemid=${cartitemId}&newQuantity=${value}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        Taro.showToast({
          title: '已调整',
          icon: 'success',
        });
        Taro.eventCenter.trigger('cartUpdated');
        setConfirmorder(updatedOrder);
        calculateTotalPrice(updatedOrder);
      }}).catch(err => {
      Taro.showToast({
        title: '请求失败: ' + err.message,
        icon: 'none',
      });
    });

    // setConfirmorder(updatedOrder);
    // calculateTotalPrice(updatedOrder);
  };
  const [amount,setAmount] = useState("");
  const handleAmountChange2 = (e) => {
    setAmount(e.detail.value);
  };

  // const handleAmountChange = (e, cartitemId) => {
  //   const updatedOrder = confirmorder.map(item => {
  //     if (item.cartitemId === cartitemId) {
  //       return { ...item, liuyan: e.detail.value };
  //     }
  //     return item;
  //   });
  //   setConfirmorder(updatedOrder);
  // };

  const oneselfpay=()=>{
    console.log("自己付");
    handleOpen();
  };
  const [isOpened, setIsOpened] = useState(false);

  const [orderidcurr,setOrderidcurr] = useState('');
  const [orderStrcurr,setOrderStrcurr] = useState('');
  const [ordercreatetime,setOrdercreatetime] = useState('');
  const handleOpen = () => {
    setIsOpened(true);

    request({
      url: `/orderitems/addorderzuhepay2?userid=${userInfo.id}&cartitemidstr=${cartItemIdstr}&amount=${amount}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (res.message === "success") {
        Taro.showToast({
          title: '订单创建成功',
          icon: 'success',
        });
        console.log("订单id:" + res.data.ordernum); // 修改为 console.log
        setOrderidcurr(res.data.ordernum);
        setOrderStrcurr(res.data.orderstr);
        setOrdercreatetime(res.data.ordercreatetime);
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

  };
  const handleClose = () => {
    setIsOpened(false);
    Taro.navigateTo({
      url: `/pages/gpwaitpay/gpwaitpay?orderidcurr=${orderidcurr}&orderStrcurr=${orderStrcurr}&proprice=${proprice}&ordercreatetime=${ordercreatetime}`,
    });

  };

  const gotopay=()=>{

    // orderitemidstr=${cartItemIdstr}  需要调整

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
        setIsOpened(false);
        setTimeout(() => {
          Taro.redirectTo({
            url: `/pages/paysuccess/paysuccess?price=${proprice}&paymethod=2&orderStrcurr=${orderStrcurr}`,
          });
        }, 500);
      }else {
        Taro.showToast({
          title: '余额不足',
          icon: 'none',
        });
      }}).catch(err => {
      Taro.showToast({
        title: '网络请求失败',
        icon: 'none',
      });
    });
  }

  return (
    <View className="confirm">
      {confirmorder.map(item => (
        <View className="pro-clo" key={item.cartitemId}>
          <View className="pro-row">
            <Image src={item.image} className="pro-image"></Image>
            <View className="pro-clo-info">
              <Text className="pro-title">{item.title}</Text>
              <View className="pro-spec">
                <Text className="specvalue">
                  {item.specvalueName}
                </Text>
              </View>
              <View className="pro-between">
                <Text className="pro-price">￥{parseFloat(item.price).toFixed(2)}</Text>
                {/*<Text className="pro-quantity"> x {quantity}</Text>*/}
                <AtInputNumber
                  className="pro-quantity"
                  type='number'
                  min={1}
                  max={100}
                  step={1}
                  value={item.quantity}
                  onChange={(value) => handleQuantityChange(value, item.cartitemId)}
                />
              </View>
              <View>
                <Text className="pro-service">售出概不退货</Text>
              </View>
            </View>
          </View>
          {/*{cartItemIdstr &&*/}
          {/*  <View className="pro-clo">*/}
          {/*    <Text className="pro-give">[赠品]*/}
          {/*      <Text>*/}
          {/*        /!*小包卫生纸 (包 x 1)*!/*/}
          {/*        {'\u00A0\u00A0'}|{'\u00A0\u00A0'}( 暂无 )*/}
          {/*      </Text></Text>*/}
          {/*    <View className="pro-message-out">*/}
          {/*      <Text className="pro-message-title">留言</Text>*/}
          {/*      <Input*/}
          {/*        className="pro-message"*/}
          {/*        type="text"*/}
          {/*        placeholder="建议留言前与客服提前沟通确认"*/}
          {/*        value={item.liuyan}*/}
          {/*        onInput={(e) => handleAmountChange(e, item.cartitemId)}*/}
          {/*      />*/}
          {/*    </View>*/}
          {/*  </View>*/}
          {/*}*/}
        </View>
      ))}
      <View className="pro-clo">
        {cartItemIdstr &&
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
                onInput={(e) => handleAmountChange2(e)}
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

      <View className="xuniline"></View>

      <View className="actions2">
        <View >
          <Text className="hjtotal">合计：
            <Text className="hjprice">￥ {proprice.toFixed(2)}</Text>
          </Text>
        </View>
        <AtButton className="action2-button-buy" onClick={oneselfpay}>自付</AtButton>
      </View>

      <AtFloatLayout className="payframe" isOpened={isOpened} onClose={handleClose}>
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

export default gpconfirmorder;

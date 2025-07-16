import request from "../../utils/request";
import Taro, {useRouter} from "@tarojs/taro";
import './orderdetail.scss';
import React, {useEffect, useState} from "react";
import {Button, Image, Text, View} from "@tarojs/components";

const orderlist = () => {
  const router = useRouter();
  const { orderitemId, productId, quantity, price, updateTime, finishTime,
    orderitemState, pname, pimage,badge, stockQuantity, selledQuantity, categoryName,
    pprice, pdescription, pmarketprice,specvalueId,specvalueName,orderNum,remark ,orderStrcurr,totalprice} = router.params;

  const formatTime = (time) => {
    const date = new Date(time)
    // 格式化时间
    const formattedDateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).
    padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).
    padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).
    padStart(2, '0')}`;

    return formattedDateTime;
  };
  const judgepay=(value)=>{
    let str = "";
    if(value==='0'||value==='1'){
      str = "应付";
    }else{
      str = "实付";
    }
    return str;
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const openpid=(productId)=>{
    Taro.navigateTo({
      url: `/pages/goodsdetail/gooddetail?id=${productId}&image=${pimage}&title=${pname}&`+
        `price=${pprice}&badge=${badge}&marketprice=${pmarketprice}&category=${categoryName}&descript=${pdescription}&specvalueId=${specvalueId}&specvalueName=${specvalueName}`,
    });
  };
  const openpid2 =(item)=>{
    Taro.navigateTo({
      url: `/pages/goodsdetail/gooddetail?id=${item.id}&image=${item.pimage}&title=${item.pname}&`+
        `price=${item.pprice}&badge=${item.badge}&marketprice=${item.pmarketprice}&category=${item.categoryName}&descript=${item.pdescription}&specvalueId=${item.specvalueId}&specvalueName=${item.specvalueName}`,
    });
  }

  const [orderitem,setOrderitem] = useState({});
  const [orderitems,setOrderitems] = useState([{}]);

  useEffect(()=>{
    if(orderitemId){
      if(judgepay(orderitemState)==='实付'){
        request({
          url: `/payments/selpaymethodbyorderid?orderid=${orderitemId}`,
          method: 'POST',
          header: {
            //'token': `Bearer ${Taro.getStorageSync('token')}`,
            'Content-Type': 'application/json',
          }
        }).then(res => {
          if (res.message === "success") {
            const cartItems = {
              payId: res.data.payId,
              orderId: res.data.orderId,
              payMethod: res.data.payMethod,
              payStatus: res.data.payStatus,
              payAmount: res.data.payAmount,
              payDate: res.data.payDate,
            };
            //console.log(cartItems);
            setOrderitem(cartItems);
          }else{

          }}).catch(err => {
          Taro.showToast({
            title: '网络请求失败',
            icon: 'none',
          });
        });
      }
    }
  },[]);

  useEffect(()=>{
    if(orderStrcurr){
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
            id: item.id,
            orderNum: item.orderNum,
            quantity: item.quantity,
            price: item.price,
            badge: item.badge,
            pmarketprice: item.pmarketprice,
            categoryName: item.categoryName,
            pdescription: item.pdescription,
            specvalueId: item.specvalueId,
            pprice: item.pprice,
            createTime: formatTime(item.finishTime),
            updateTime: formatTime(item.updateTime),
            specvalueName: item.specvalueName,
            pimage: item.pimage,
            pname: item.pname,
            stockQuantity: item.stockQuantity,
            selledQuantity: item.selledQuantity,
            remark: item.remark,
            orderitemState: item.orderitemState,
          }));
          setOrderitems(proItems);
        }}).catch(err => {
        Taro.showToast({
          title: '网络请求失败',
          icon: 'none',
        });
      });
    }
  },[])

  return (
    <View className="order">
      {orderitemId&&
        <View className='cart-item' key={orderitemId} onClick={() =>openpid(productId)}>
          <View className='cart-image-text'>
            <View className='cart-item-right'>
              <Image className='cart-item-image' src={pimage} />
              <View className='cart-item-info'>
                <Text className='cart-item-title'>{pname}</Text>
                <View className="spec">
                  <Text className="specvalue">
                    {specvalueName}
                  </Text>
                </View>
              </View>
            </View>
            <View className='cart-item-price-quantity'>
              <View className='cart-item-price'>
                <View>
                  <Text className='cart-item-currency1'>{judgepay(orderitemState)}{'\u00A0\u00A0'}</Text>
                  <Text className='cart-item-currency'>¥</Text>
                  {parseFloat(price).toFixed(2)}
                </View>
                <Text className='cart-item-currency2'>x {quantity}</Text>
              </View>
            </View>
          </View>
        </View>
      }

      {orderStrcurr &&
        <View>
          {orderitems.map(item => (
            <View className='cart-item' key={item.orderitemId} onClick={() =>openpid2(item)}>
              <View className='cart-image-text'>
                <View className='cart-item-right'>
                  <Image className='cart-item-image' src={item.pimage} />
                  <View className='cart-item-info'>
                    <Text className='cart-item-title'>{item.pname}</Text>
                    <View className="spec">
                      <Text className="specvalue">
                        {item.specvalueName}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className='cart-item-price-quantity'>
                  <View className='cart-item-price'>
                    <View>
                      <Text className='cart-item-currency1'>{judgepay(item.orderitemState)}{'\u00A0\u00A0'}</Text>
                      <Text className='cart-item-currency'>¥</Text>
                      {(parseFloat(item.price) / item.quantity).toFixed(2)}
                    </View>
                    <Text className='cart-item-currency2'>x {item.quantity}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      }

      {orderitemId &&
        <View>
          <Text className="ordertitle">订单信息</Text>
          <View className='orderinfo'>
            <Text className="orderiteminfo"><Text className="orderiteminfoname">订单编号：</Text>{orderNum}</Text>
            {/*<Text className="orderiteminfo"><Text className="orderiteminfoname">产品规格：</Text>{specvalueName}</Text>*/}
            <Text className="orderiteminfo"><Text className="orderiteminfoname">下单时间：</Text>{formatTime(finishTime)}
            </Text>
            {judgepay(orderitemState) === '实付' &&
              <Text className="orderiteminfo"><Text className="orderiteminfoname">支付方式：</Text>{orderitem.payMethod}
              </Text>
            }
            {judgepay(orderitemState) === '实付' &&
              <Text className="orderiteminfo"><Text
                className="orderiteminfoname">支付时间：</Text>{formatTime(orderitem.payDate)}</Text>
            }
            <Text className="orderiteminfo"><Text
              className="orderiteminfoname">商品总额：</Text>￥{parseFloat(price).toFixed(2)}</Text>
            <Text className="orderiteminfo"><Text className="orderiteminfoname">订单备注：</Text> {remark}</Text>
          </View>
        </View>
      }
      {/*组合支付*/}
      {orderStrcurr &&
        <View>
          <Text className="ordertitle">订单信息</Text>
          <View className='orderinfo'>
            <Text className="orderiteminfo"><Text className="orderiteminfoname">订单编号：</Text>{orderitems[0].orderNum}</Text>
            {/*<Text className="orderiteminfo"><Text className="orderiteminfoname">产品规格：</Text>{specvalueName}</Text>*/}
            <Text className="orderiteminfo"><Text className="orderiteminfoname">下单时间：</Text>{orderitems[0].createTime}
            </Text>
            {judgepay(orderitemState) === '实付' &&
              <Text className="orderiteminfo"><Text className="orderiteminfoname">支付方式：</Text>在线支付</Text>
            }
            {judgepay(orderitemState) === '实付' &&
              <Text className="orderiteminfo"><Text
                className="orderiteminfoname">支付时间：</Text>{orderitems[0].updateTime}</Text>
            }
            <Text className="orderiteminfo"><Text
              className="orderiteminfoname">商品总额：</Text>￥{parseFloat(totalprice).toFixed(2)}</Text>
            <Text className="orderiteminfo"><Text className="orderiteminfoname">订单备注：</Text> {orderitems[0].remark}</Text>
          </View>
        </View>
      }
    </View>
  );
};

export default orderlist;

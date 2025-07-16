import React, {useEffect, useState} from 'react';
import { View, Image, Text, Button, Input } from '@tarojs/components';
import './order.scss';
import request from "../../utils/request";
import {AtSearchBar} from "taro-ui";
import Taro from "@tarojs/taro";
import "taro-ui/dist/style/components/search-bar.scss";
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/icon.scss";

const orderlist = () => {
  const [items,setItems] = useState([])

  const [value, setValue] = useState('')

  const onChange = (val) => {
    setValue(val)
  }
  const userInfo = Taro.getStorageSync('userInfo');
  const userid = userInfo.id;
  const onActionClick = () => {
    console.log("value:"+value);
    request({
      url: `/orderitems/allorderByuseridandcondition?userid=${userid}&pname=${value}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        if (res.data != "") {
          const cartItems = res.data.map(item => ({
            orderitemId: item.orderitemId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            updateTime: item.updateTime,
            finishTime: item.finishTime,
            orderitemState: item.orderitemState,
            pname: item.pname,
            pimage: item.pimage,
            orderNum:item.orderNum,
            originalOrdernum:item.originalOrdernum,
            badge: item.badge,
            stockQuantity: item.stockQuantity,
            selledQuantity:item.selledQuantity,
            categoryName: item.categoryName,
            categoryDescription: item.categoryDescription,
            pprice: item.pprice,
            pdescription: item.pdescription,
            pmarketprice: item.pmarketprice,
            specvalueId: item.specvalueId,
            specvalueName: item.specvalueName,
          }));
          setItems(cartItems);
        } else {
          Taro.showToast({
            title: '目前还没有相关订单',
            icon: 'none',
          });
        }
      } else {
        Taro.showToast({
          title: '没有找到相关订单',
          icon: 'none',
        });
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
      request({
        url: `/orderitems/allorderByuserid?userid=${userid}`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.message === "success") {
          if (res.data != "") {
            console.log("res.data.orderItemDtos",res.data.orderItemDtos);
            const cartItems = res.data.orderItemDtos.map(item => ({
              orderitemId: item.orderitemId,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              updateTime: item.updateTime,
              finishTime: item.finishTime,
              orderitemState: item.orderitemState,
              pname: item.pname,
              pimage: item.pimage,
              orderNum:item.orderNum,
              originalOrdernum:item.originalOrdernum,
              badge: item.badge,
              stockQuantity: item.stockQuantity,
              selledQuantity:item.selledQuantity,
              categoryName: item.categoryName,
              categoryDescription: item.categoryDescription,
              pprice: item.pprice,
              pdescription: item.pdescription,
              pmarketprice: item.pmarketprice,
              specvalueId: item.specvalueId,
              specvalueName: item.specvalueName,
              remark: item.remark,
            }));
            setItems(cartItems);
          } else {
            Taro.showToast({
              title: '没有找到相关订单',
              icon: 'none',
            });
          }
        } else {
          Taro.showToast({
            title: '查询失败',
            icon: 'none',
          });
        }
      }).catch(err => {
        Taro.showToast({
          title: '请求失败: ' + err.message,
          icon: 'none',
        });
      });
  }, []);

  const orderdetall=(item)=>{
    Taro.navigateTo({
      //Taro.redirectTo({
      // Taro.switchTab({
      url: `/pages/orderdetail/orderdetail?orderitemId=${item.orderitemId}&productId=${item.productId}&quantity=${item.quantity}&price=${item.price}&remark=${item.remark}&` +
        `updateTime=${item.updateTime}&finishTime=${item.finishTime}&orderitemState=${item.orderitemState}&pname=${item.pname}&pimage=${item.pimage}&`+
      `badge=${item.badge}&stockQuantity=${item.stockQuantity}&selledQuantity=${item.selledQuantity}&categoryName=${item.categoryName}&categoryDescription=${item.categoryDescription}&`+
      `pprice=${item.pprice}&pdescription=${item.pdescription}&pmarketprice=${item.pmarketprice}&specvalueId=${item.specvalueId}&specvalueName=${item.specvalueName}&orderNum=${item.orderNum}`,
    });
  }

  const againorder=(item)=>{
    let pid = item.productId;
    let specvalueId = item.specvalueId;
    let specvalueName = item.specvalueName;
    let quantity = item.quantity;
    console.log(quantity);
    request({
      url: `/cartitems/addprotocartlistnew?userid=${userid}&pid=${pid}&quantity=${quantity}&svid=${specvalueId}&svname=${specvalueName}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        Taro.eventCenter.trigger('cartUpdated');
        Taro.showToast({
          title: '成功加入购物车',
          icon: 'success',
        });
      } else {
        Taro.showToast({
          title: '加入购物车失败',
          icon: 'none',
        });
      }
    });
    Taro.navigateTo({
      //Taro.redirectTo({
      // Taro.switchTab({
      url: '/pages/shopcar2/shopcar2',
    });
  }

  const judgestate = (value)=>{
    let orderstate = "";
    switch (value) {
      case "0": orderstate = "已取消"; break;
      case "1": orderstate = "已创建"; break;
      case "2": orderstate = "已付款"; break;
      case "3": orderstate = "已种植"; break;
      case "4": orderstate = "取消种植"; break;
      case "5": orderstate = "退货中"; break;
      case "6": orderstate = "已退货"; break;
      case "7": orderstate = "已退款"; break;
      case "8": orderstate = "待使用"; break;
      case "9": orderstate = "已使用"; break;
      case "10": orderstate = "已完成"; break;
      case "11": orderstate = "备货中"; break;
      case "12": orderstate = "已发货"; break;
      case "13": orderstate = "已收货"; break;
      default: orderstate = "unknown"; break;
    };
    return orderstate;
  };

  const deleteorderitem=(orderid)=>{


    Taro.showModal({
      title: '提示',
      content: '是否确认删除？',
      success: function (res) {
        if (res.confirm) {
          request({
            url: `/orderitems/deleteorderbyid?orderid=${orderid}`,
            method: 'POST',
            header: {
              //'token': `Bearer ${Taro.getStorageSync('token')}`,
              'Content-Type': 'application/json',
            },
          }).then(res => {
            if (res.message === "success"&& res.data === 1) {
              setItems(prevItems => prevItems.filter(item => item.orderitemId !== orderid));
              Taro.showToast({
                title: '订单已删除',
                icon: 'success',
              });
            }}).catch(err => {
            Taro.showToast({
              title: '网络请求失败',
              icon: 'none',
            });
          });
        } else if (res.cancel) {

        }
      }
    });
  };

  return (
    <View className="order">
      <View className="searchframe">
        <AtSearchBar
          value={value}
          onChange={onChange}
          onActionClick={onActionClick}
          onClear={onClear}
          placeholder="请输入搜索内容"
          maxLength={50}
        />
      </View>
      {items.length>0 && items.map(item => (
        <View className='cart-item' key={item.orderitemId} >
          <View className='cart-image-text' onClick={() =>orderdetall(item)}>
            <View className='cart-item-right'>
              <Image className='cart-item-image' src={item.pimage} />
              <View className='cart-item-nameandspec'>
                <Text className='cart-item-title'>{item.pname}</Text>
                <Text className='cart-item-title2'>{item.specvalueName}</Text>
              </View>
            </View>
            <View className='cart-item-price-quantity'>
              <View className='cart-item-price'>
                <Text className='cart-item-currency2'>共{item.quantity}件{'\u00A0\u00A0'}</Text>
                <Text className='cart-item-currency1'>实付{'\u00A0'}</Text>
                <Text className='cart-item-currency'>¥</Text>
                {parseFloat(item.price).toFixed(2)}
              </View>
            </View>
          </View>
          <View className='again-out'>
            {(judgestate(item.orderitemState)==='已取消'||judgestate(item.orderitemState)==='已创建')&&
              <Text className='orderitem-delete' onClick={()=>deleteorderitem(item.orderitemId)}>删除订单</Text>
            }
            {/*{judgestate(item.orderitemState)==='已创建'&&*/}
            {/*  <Text className='orderitem-delete' onClick={()=>cancel(item)} >取消订单</Text>*/}
            {/*}*/}
            <Text className='orderitem-sign'>{judgestate(item.orderitemState)}</Text>
            <Button className='again' onClick={()=>againorder(item)}>再来一单</Button>
          </View>
        </View>
      ))}
    </View>
  );
};

export default orderlist;

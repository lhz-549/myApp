import React, {useEffect, useState} from 'react';
import { View, Image, Text, Button, Input } from '@tarojs/components';
import './shopcar.scss';
import Taro, {usePullDownRefresh, useRouter} from "@tarojs/taro";
import request from "../../utils/request";

const shopcar = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [items, setItems] = useState([]);

  const userInfo = Taro.getStorageSync('userInfo');

  const handleQuantityChange = (id, newQuantity) => {
    const validQuantity = isNaN(newQuantity) ? 1 : Math.max(newQuantity, 1);
    setItems(items.map(item => item.cartitemId === id ? { ...item, quantity: validQuantity } : item));
    //  产品 id,产品数量 newQuantity

    //const userid = userInfo.id;
    if(userInfo){
      request({
        url: `/cartitems/cartitemsupdatenum?cartitemid=${id}&newQuantity=${validQuantity}`,
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
        }}).catch(err => {
        Taro.showToast({
          title: '请求失败: ' + err.message,
          icon: 'none',
        });
      });
    }
  };

  const handleCheckboxChange = (id) => {
    setItems(items.map(item => item.cartitemId === id ? { ...item, checked: !item.checked } : item));
  };

  const [total, setTotal] = useState(0);

  // 全选/全不选
  const toggleAll = () => {
    // 计算当前是否有商品未被选中
    const isAllSelected = items.every(item => item.checked);
    setItems(items.map(item => ({ ...item, checked: !isAllSelected })));
  };

  const calculateTotal = (items) => {
    return items
      .filter(item => item.checked)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  useEffect(() => {
    fetchCartItems();
    Taro.stopPullDownRefresh();
    Taro.eventCenter.on('cartUpdated', fetchCartItems);
    Taro.eventCenter.on('logout', setNull);
    Taro.eventCenter.on('login', fetchCartItems);
    // 组件卸载时取消监听
    return () => {
      Taro.eventCenter.off('cartUpdated', fetchCartItems);
      Taro.eventCenter.on('logout', setNull);
      Taro.eventCenter.on('login', fetchCartItems);
    };
    }, []
  );

  usePullDownRefresh(() => {fetchCartItems();});

  const setNull = () => {
    console.log("执行了setnull方法");
    setItems([]);
  }

  const fetchCartItems = async() => {
    const userid = Taro.getStorageSync('userInfo').id;
    console.log("执行了cart初始化方法");
    if (userid) {
      request({
        url: `/user-cart-details/selectcartdetal?userid=${userid}`,
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
            checked: true,
          }));
          setItems(cartItems);
        }}).catch(err => {
        Taro.showToast({
          title: '请求失败: ' + err.message,
          icon: 'none',
        });
      });
    }
  };

  //eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setTotal(calculateTotal(items));
  }, [items]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setTotalquantity(calculateTotalquantity(items));
  }, [items]);


  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isEditMode, setIsEditMode] = useState(false);
  const deleteproduct =()=>{
    // 筛选出 checked 为 true 的商品
    const checkedItems = items.filter(item => item.checked);
    // 获取 pid 列表
    const pidList = checkedItems.map(item => item.cartitemId);

    if(userInfo && pidList.length > 0 ){
      //console.log(pidList);
      Taro.showModal({
        title: '提示',
        content: '是否确认删除？',
        success: function (res) {
          if (res.confirm) {
            // 用户点击了确认按钮
            // 向后端发送请求
            request({
              url: `/cartitems/delcartitems?cartitemids=${pidList}`,
              method: 'POST',
              header: {
                //'token': `Bearer ${Taro.getStorageSync('token')}`,
                'Content-Type': 'application/json',
              }}).then(res => {
              if (res.message === "success") {
                // 请求成功，更新本地状态
                const newItems = items.filter(item => !item.checked);
                setItems(newItems);
                Taro.showToast({
                  title: '删除成功',
                  icon: 'waiting',
                  //duration: 2000
                });
              } else {
                Taro.showToast({
                  title: '删除失败',
                  icon: 'error'
                });
              }
            }).catch(err => {
              Taro.showToast({
                title: '网络错误',
                icon: 'error'
              });
            });
          } else if (res.cancel) { }
        }
      });
    }else if(!userInfo){
      Taro.showToast({
        title: '请先登录账号',
        icon: 'none'
      });
    }else if(userInfo && pidList.length === 0 ){
      Taro.showToast({
        title: '没有可删除的购物车项',
        icon: 'none'
      });
    }
  };

  const[totalquantity,setTotalquantity] = useState("");


  const calculateTotalquantity = (items) => {
    return items
      .filter(item => item.checked)
      .reduce((total, item) => total + item.quantity, 0);
  };



  //20240618
  const deleteItem = (id) => {

    // const userid = userInfo.id;

    Taro.showModal({
      title: '提示',
      content: '是否确认删除？',
      success: function (res) {
        if (res.confirm) {
          // 用户点击了确认按钮
          request({
            url: `/cartitems/delcartitems2?cartitemid=${id}`,
            method: 'POST',
            header: {
              //'token': `Bearer ${Taro.getStorageSync('token')}`,
              'Content-Type': 'application/json',
            }}).then(res => {
            if (res.message === "success") {
              // 请求成功，更新本地状态
              setItems(items.filter(item => item.cartitemId !== id));

              Taro.showToast({
                title: '删除成功',
                icon: 'waiting',
                //duration: 2000
              });
            } else {
              Taro.showToast({
                title: '删除失败',
                icon: 'error'
              });
            }
          }).catch(err => {
            Taro.showToast({
              title: '网络错误',
              icon: 'error'
            });
          });
        } else if (res.cancel) { }
      }
    });

  };

  const [startX, setStartX] = useState(0);
  const [swipedItemId, setSwipedItemId] = useState(null);
  const [currentX, setCurrentX] = useState(0);
  const handleTouchStart = (e, id) => {
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
    setSwipedItemId(null);
  };
  const handleTouchMove = (e) => {
    setCurrentX(e.touches[0].clientX);
  };
  const handleTouchEnd = (id) => {
    if (startX - currentX > 50) { // 如果左滑超过50px
      setSwipedItemId(id);
    } else if(startX - currentX < -50) {
      setSwipedItemId(null);
    }
    // else{
    //   setSwipedItemId(null);
    // }
    setStartX(0);
    setCurrentX(0);
  };

  const openspecid=(item)=>{
    Taro.navigateTo({
      url: `/pages/goodsdetail/gooddetail?id=${item.id}&image=${item.image}&title=${item.title}&price=${item.price}&`+
        // `badge=${badge}&marketprice=${pmarketprice}&category=${categoryName}&descript=${pdescription}&`+
        `specvalueId=${item.specvalueId}&specvalueName=${item.specvalueName}`,
    });
  }

  const zuhepay = () => {
    // 首先筛选出checked为true的items
    const checkedItems = items.filter(item => item.checked);

    console.log(checkedItems);

    const cartItemIdsString = checkedItems.map(item => item.cartitemId).join(',');

    console.log(cartItemIdsString);
    if(userInfo && checkedItems.length >0){
      // 使用Taro.navigateTo进行页面跳转，并将数据放在URL的query参数中
      Taro.navigateTo({
        url: `/pages/grouppayconfirmorder/gpconfirmorder?cartItemIdstr=${cartItemIdsString}`,
      });
      // 显示Toast
      Taro.showToast({
        title: '正在跳转到组合支付确认页面',
        icon: 'success'
      });
    } else if(!userInfo){
      Taro.showToast({
        title: '请先登录账号',
        icon: 'none'
      });
    }else if(userInfo && checkedItems.length===0){
      Taro.showToast({
        title: '没有可结算的购物车项',
        icon: 'none'
      });
    }
  };

  return (
    <View className="cart">
      <Text className="edit" onClick={() => setIsEditMode(!isEditMode)} >{isEditMode ? '完成' : '编辑'}</Text>
      {items.map(item => (
        <View className='cart-item' key={item.cartitemId}
              onTouchStart={(e) => handleTouchStart(e, item.cartitemId)}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleTouchEnd(item.cartitemId)}
        >
          <View className={`cart-item-left ${swipedItemId === item.cartitemId ?'swiped-nodisplay':''}`}>
            <View
              className={`custom-checkbox ${item.checked ? 'checked' : ''}`}
              onClick={() => handleCheckboxChange(item.cartitemId)}
            />
          </View>
          <View className='cart-item-right'>
            <Image className='cart-item-image' src={item.image} onClick={()=>openspecid(item)}/>
            <View className='cart-item-info'>
              <Text className='cart-item-title'>{item.title}</Text>
              <View className="spec">
                <Text className="specvalue">
                  {item.specvalueName}
                </Text>
              </View>
              <View className='cart-item-price-quantity'>
                <Text className='cart-item-price'>
                  <Text className='cart-item-currency'>¥</Text>{parseFloat(item.price).toFixed(2)}
                </Text>
                <View className='cart-item-quantity'>
                  <Text className='cart-item-quantity-button' onClick={() => handleQuantityChange(item.cartitemId, item.quantity - 1)}>-</Text>
                  <Input
                    className='cart-item-quantity-input'
                    type='number'
                    value={item.quantity}
                    onInput={e => handleQuantityChange(item.cartitemId, parseInt(e.detail.value, 10))}
                  />
                  <Text className='cart-item-quantity-button' onClick={() => handleQuantityChange(item.cartitemId, item.quantity + 1)}>+</Text>
                </View>
              </View>
            </View>
          </View>
          <View className={` ${swipedItemId === item.cartitemId ? 'swiped2' : 'swiped-nodisplay2'}`} onClick={() => deleteItem(item.cartitemId)}>
            <Text className='swipe-item-del'>删除</Text>
          </View>
        </View>
      ))}
      <Text className="warningdoc">{items.length>0?"已经到底了":"去商城看看有中意的商品呦！"}</Text>
      {isEditMode ? (
        <View className="actions">
          <View className="buy-action">
            <button className="product-text" onClick={() => toggleAll()}>全选</button>
          </View>
          <Button className="action-button-delete" onClick={()=>deleteproduct()}>删除</Button>
        </View>
      ) : (
        <View className="actions">
          <View className="buy-action">
            <button className="product-text" onClick={() => toggleAll()}>全选</button>
            <Text className="product-text">合计 :
              <Text className="cart-item-currency">¥</Text>
              <Text className="text-price">{total.toFixed(2)}</Text></Text>
          </View>
          <Button className="action-button-buy" onClick={zuhepay}>去结算 ({totalquantity})</Button>
        </View>
      )}
    </View>
  );
};

export default shopcar;

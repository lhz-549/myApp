import React, {useEffect, useState} from 'react';
import {Image, Swiper, SwiperItem, View} from '@tarojs/components';
import ProductCard from '../component/ProductCard';
import './shop.scss';
import {AtSearchBar} from "taro-ui";
import "taro-ui/dist/style/components/search-bar.scss";
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/icon.scss";
import Taro from "@tarojs/taro";
import request from "../../utils/request";

// eslint-disable-next-line react-hooks/rules-of-hooks


const ProductList = () => {
  const [ products, setProducts] = useState([
    {
      id: 1,
      title: 'YH 樱花',
      price: '2199',
      marketprice: '2399',
      badge: '赠',
      category: '科目: 乔木',
      image: 'https://i.111666.best/image/c7aJzF1fD7Q84qiUiYGwbX.png',
    },
    {
      id: 2,
      title: 'GT 古藤',
      price: '899',
      marketprice: '1099',
      badge: '加价购',
      category: '科目: 木质藤本',
      image: 'https://i.111666.best/image/1TK2ojGLqNgUnFGRMBbkit.png',
    },
    {
      id: 3,
      title: 'YX 银杏',
      price: '899',
      marketprice: '1099',
      badge: '加价购',
      category: '科目: 乔木',
      image: 'https://i.111666.best/image/a4QxFjyK2zD5aPJOw1jze6.png',
    },
  ]);
  const [current, setCurrent] = useState(0);

  const images = [
    require("../../assets/tree/ds7.jpg"),
    require("../../assets/tree/ds10.jpg"),
    require("../../assets/tree/ds6.jpg"),
    require("../../assets/tree/ds4.jpg")
  ];
  const top = [
    require("../../assets/effect/xiao3.png"),
    require("../../assets/c3.png"),
    require("../../assets/c1.png"),
    require("../../assets/c2.png")
  ];
  const handleSwiperChange = (e) => {
    setCurrent(e.detail.current);
  };

  const [value, setValue] = useState('')
  const onChange = (val) => {
    setValue(val)
  }
  const onActionClick = () => {
    //console.log("value:"+value);
    request({
      url: `/products/searchthing?keyword=${value}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        if(res.data!=""){
          const cartItems = res.data.map(item => ({
            id: item.id,
            title: item.pname,
            price: item.pprice,
            marketprice: item.pmarketprice,
            badge: item.badge,
            category: item.categoryName,
            image: item.pimage,
            descript: item.pdescription,
          }));
          setProducts(cartItems);
        }else{
          Taro.showToast({
            title: '换个关键词重试',
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

    // Taro.showToast({
    //   title: `搜索: ${value}`,
    //   icon: 'success',
    //   duration: 2000,
    // })
  }

  const onClear = () => {
    setValue("");
    Taro.showToast({
      title: '已清除',
      icon: 'none',
      duration: 2000,
    })
  }

  useEffect(() => {
      request({
        url: `/products/allprolistandtype`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.message === "success") {
          const proItems = res.data.map(item => ({
            id: item.id,
            title: item.pname,
            price: item.pprice,
            marketprice: item.pmarketprice,
            badge: item.badge,
            category: '类目: '+item.categoryName,
            quantity: item.stockQuantity,
            image: item.pimage,
            descript: item.pdescription,
          }));
          //console.log(proItems);
          setProducts(proItems);
        } else {
          Taro.showToast({
            title: '获取商品列表失败',
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

  return (
    <View className="outview">
      <View className='double-swiper-container'>
        {/* Bottom Swiper: 这是底层的轮播图，展示图片集 */}
        <View
          className='bottom-view'
          style={{ backgroundImage: `url(${images[current]})` }}
        >
        </View>
        {/*<Swiper*/}
        {/*  className='bottom-swiper' // 类名用于CSS样式定制*/}
        {/*  current={current} // 表示当前显示的是哪个swiper-item*/}
        {/*  onChange={handleSwiperChange} // 当swiper-item变化时触发，确保两个轮播图同步*/}
        {/*  autoplay={false} // 自动播放轮播图*/}
        {/*  circular // 循环播放*/}
        {/*  indicatorDots={false} // 隐藏底层轮播图的指示点*/}
        {/*>*/}
        {/*  {images.map((src, index) => (*/}
        {/*    <SwiperItem className='bottom-item' key={index}>*/}
        {/*      <Image className='bottom-img' src={src} />*/}
        {/*    </SwiperItem>*/}
        {/*  ))}*/}
        {/*</Swiper>*/}
        {/* Top Swiper: 这是顶层的轮播图，也展示相同的图片集，但尺寸小一些 */}
        <Swiper
          className='top-swiper' // 类名用于CSS样式定制，使这个轮播图位于顶层
          current={current} // 同步当前显示的swiper-item，与底层轮播图一致
          onChange={handleSwiperChange} // 处理swiper-item变化
          autoplay // 自动播放轮播图
          circular // 循环播放
          indicatorDots={false} // 显示顶层轮播图的指示点
        >
          {top.map((src, index) => (
            <SwiperItem className='top-item' key={index}>
              <Image className='top-img' src={src} onError={() => console.log('Image load error', src)} />
            </SwiperItem>
          ))}
        </Swiper>
        {/* 自定义指示器 */}
        <View className='swiper-indicator'>
          {top.map((_, index) => (
            <View
              key={index}
              className={`swiper-dot ${index === current ? 'swiper-dot-active' : ''}`}
            />
          ))}
        </View>
      </View>
      <View>
        <AtSearchBar
          value={value}
          onChange={onChange}
          onActionClick={onActionClick}
          onClear={onClear}
          placeholder="请输入搜索内容"
          maxLength={50}
        />
      </View>
      <View >
          <ProductCard  products={products} />
      </View>
    </View>

  );
};

export default ProductList;

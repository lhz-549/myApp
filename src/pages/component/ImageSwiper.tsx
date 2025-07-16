import React, { useState } from 'react';
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';
import './ImageSwiper.scss';

const ImageSwiper = ({ images }) => {
  const [swiperCurrent, setSwiperCurrent] = useState(0);

  return (
    <View className='viewout'>
      <Swiper
        className='lbw'
        indicatorColor='#f3e4e4'
        indicatorActiveColor='#07b912'
        vertical={false}
        circular
        indicatorDots={false}
        autoplay
        onChange={(e) => setSwiperCurrent(e.detail.current)}
        // previousMargin="55rpx"
        // nextMargin="50rpx"
      >
        {images.map((src, index) => (
          <SwiperItem key={index}>
            <View className='lunbo'>
              <Image className={`lbt ${index === swiperCurrent ? 'imgActive' : ''}`} src={src} />
            </View>
          </SwiperItem>
        ))}
      </Swiper>
      <View className="dots">
        {images.map((_, index) => (
          <View key={index} className={`dot ${index === swiperCurrent ? 'active' : ''}`}></View>
        ))}
      </View>
    </View>
  );
};

export default ImageSwiper;
